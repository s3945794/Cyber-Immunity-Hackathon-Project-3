'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { accessApi, AccessApiError } from '@/lib/api/access'
import { LOCKED_FIELD_LABELS } from '@/components/incidents/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAccessData, useOperation } from '@/features/access-requests/hooks/useAccessData'
import type { AccessRequest, RequestPage, AuditPage } from '@/types/access'

const buttonClass =
  'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50'
const cardClass =
  'rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
const date = (value: number) => new Date(value).toLocaleString('en-AU')
import { duration } from '@/features/access-requests/format'
export function StatusMessage({ request }: { request: AccessRequest }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium capitalize">
        {request.status} · {request.approvalCount} of 2 approvals
      </p>
      <p className="text-zinc-600 dark:text-zinc-300">
        {request.status === 'pending'
          ? 'Waiting for two distinct other SOC staff members. Evidence is locked.'
          : request.status === 'authorising' || request.status === 'active'
            ? 'Two business approvals are recorded. Tide authorisation is unavailable; evidence remains locked.'
            : request.status === 'rejected'
              ? 'Rejected: ' + request.rejectionReason
              : request.status === 'expired'
                ? 'Access has expired. Request a new access period.'
                : 'This request was cancelled. Evidence is locked.'}
      </p>
    </div>
  )
}
export function LoadState({
  loading,
  error,
  retry,
}: {
  loading: boolean
  error: string | null
  retry: () => void
}) {
  if (loading)
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  if (error)
    return (
      <div role="alert" className={cardClass}>
        <p>{error}</p>
        <button type="button" onClick={retry} className={buttonClass + ' mt-4'}>
          Retry
        </button>
      </div>
    )
  return null
}
function HistoryContent({ review }: { review: boolean }) {
  const [before, setBefore] = useState<string | null>(null)
  const { data, loading, error, refresh } = useAccessData<RequestPage>(
    (review ? '/approvals' : '/requests') + (before ? '?before=' + encodeURIComponent(before) : '')
  )
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{review ? 'Approvals' : 'My Requests'}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {review
          ? 'Review other SOC users’ requests. Two distinct approvals are required.'
          : 'Your retained access requests and their current status.'}
      </p>
      <LoadState loading={loading} error={error} retry={refresh} />
      {data && (
        <div className="space-y-4">
          {data.requests.length === 0 ? (
            <p className={cardClass}>
              {review ? 'No eligible requests on this page.' : 'No requests on this page.'}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  {review ? 'Approval queue' : 'Request history'}
                </caption>
                <thead className="bg-zinc-50 dark:bg-zinc-950">
                  <tr>
                    {[
                      'Incident',
                      'Resource',
                      'Status',
                      'Approvals',
                      'Duration',
                      'Created',
                      'Details',
                    ].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.requests.map((r) => (
                    <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                      <td className="px-4 py-3">{r.incidentId}</td>
                      <td className="px-4 py-3">{LOCKED_FIELD_LABELS[r.resource]}</td>
                      <td className="px-4 py-3 capitalize">{r.status}</td>
                      <td className="px-4 py-3">{r.approvalCount} of 2</td>
                      <td className="px-4 py-3">{duration(r.durationSeconds)}</td>
                      <td className="px-4 py-3">{date(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Link
                          className="text-blue-700 underline focus-visible:outline-2 dark:text-blue-300"
                          href={'/requests/' + r.id}
                        >
                          View request
                          <span className="sr-only">
                            {' '}
                            for {r.incidentId} {LOCKED_FIELD_LABELS[r.resource]}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setBefore(null)
                refresh()
              }}
            >
              Refresh latest
            </button>
            {data.nextCursor && (
              <button
                type="button"
                className={buttonClass}
                onClick={() => setBefore(data.nextCursor)}
              >
                Older requests
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export function RequestHistory({ review = false }: { review?: boolean }) {
  const { user, authenticated } = useAuth()
  return <HistoryContent key={String(user?.uid) + authenticated + review} review={review} />
}
export function RequestDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, authenticated } = useAuth()
  return <DetailContent key={String(user?.uid) + authenticated + id} id={id} />
}
function DetailContent({ id }: { id: string }) {
  const { getToken } = useAuth()
  const { data, loading, error, refresh } = useAccessData<{ request: AccessRequest }>(
    '/requests/' + encodeURIComponent(id)
  )
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const operation = useOperation()
  const inflight = useRef(false)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])
  // Cleanup guards mutation completions after context/session change.
  // useAccessData independently protects reads.
  // Effects only subscribe/clean up; state changes happen after API responses.
  const request = data?.request
  async function mutate(decision: 'approve' | 'reject' | 'cancel') {
    if (inflight.current) return
    if (decision === 'reject' && (reason.trim().length < 1 || reason.trim().length > 500)) {
      setActionError('Enter a rejection reason of 1 to 500 characters.')
      return
    }
    inflight.current = true
    setBusy(true)
    setActionError(null)
    const body =
      decision === 'cancel'
        ? {}
        : decision === 'reject'
          ? { decision, reason: reason.trim() }
          : { decision }
    try {
      await accessApi(
        { getToken },
        '/requests/' + encodeURIComponent(id) + (decision === 'cancel' ? '/cancel' : '/decisions'),
        body,
        operation(decision, body)
      )
      if (alive.current) refresh()
    } catch (err) {
      if (alive.current)
        setActionError(
          err instanceof AccessApiError ? err.message : 'Operation failed. Please retry.'
        )
    } finally {
      inflight.current = false
      if (alive.current) setBusy(false)
    }
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/requests" className="text-blue-700 underline dark:text-blue-300">
        My Requests
      </Link>
      <h1 className="text-2xl font-bold">Access request details</h1>
      <LoadState loading={loading} error={error} retry={refresh} />
      {request && (
        <>
          <section className={cardClass}>
            <StatusMessage request={request} />
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-zinc-500">Incident</dt>
                <dd>
                  <Link
                    className="text-blue-700 underline dark:text-blue-300"
                    href={'/incidents/' + request.incidentId}
                  >
                    {request.incidentId}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Resource</dt>
                <dd>{LOCKED_FIELD_LABELS[request.resource]}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Permission</dt>
                <dd>Read-only</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Duration</dt>
                <dd>{duration(request.durationSeconds)}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Requester reference</dt>
                <dd className="font-mono text-sm">{request.requesterRef.slice(0, 12)}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Created</dt>
                <dd>{date(request.createdAt)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-zinc-500">Reason</dt>
                <dd className="break-words whitespace-pre-wrap">{request.reason}</dd>
              </div>
            </dl>
            <h2 className="mt-5 font-semibold">Distinct approvals</h2>
            {request.approvals.length ? (
              <ul className="mt-2 space-y-2">
                {request.approvals.map((a) => (
                  <li key={a.actorRef}>
                    <span className="font-mono text-sm">{a.actorRef.slice(0, 12)}</span> ·{' '}
                    {date(a.at)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">No approvals recorded.</p>
            )}
          </section>
          {(request.canApprove || request.canCancel) && (
            <section className={cardClass}>
              {actionError && (
                <p
                  role="alert"
                  id="decision-error"
                  className="mb-4 text-sm text-red-700 dark:text-red-300"
                >
                  {actionError}
                </p>
              )}
              {request.canApprove && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium" htmlFor="rejection-reason">
                    Rejection reason
                  </label>
                  <textarea
                    id="rejection-reason"
                    rows={3}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    aria-describedby={actionError ? 'decision-error' : undefined}
                    className="w-full rounded-md border border-zinc-300 p-3 focus:border-blue-600 focus:outline-2 focus:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-950"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={busy}
                      className={buttonClass}
                      onClick={() => void mutate('approve')}
                    >
                      Approve request
                    </button>
                    <button
                      disabled={busy}
                      className={buttonClass}
                      onClick={() => void mutate('reject')}
                    >
                      Reject request
                    </button>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Approval records your decision. Access also requires verified Tide authority.
                  </p>
                </div>
              )}
              {request.canCancel && (
                <button
                  disabled={busy}
                  className={buttonClass}
                  onClick={() => void mutate('cancel')}
                >
                  Cancel pending request
                </button>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}
export function IncidentRequestStatus({ incidentId }: { incidentId: string }) {
  const { data, loading, error, refresh } = useAccessData<{ requests: AccessRequest[] }>(
    '/access/incidents/' + encodeURIComponent(incidentId) + '/requests'
  )
  return (
    <section className={cardClass}>
      <h2 className="font-semibold">Your access requests</h2>
      <LoadState loading={loading} error={error} retry={refresh} />
      {data?.requests.length === 0 && (
        <p className="mt-2 text-sm text-zinc-500">
          No requests for this incident. All protected fields are locked.
        </p>
      )}
      <ul className="mt-3 space-y-4">
        {data?.requests.map((r) => (
          <li key={r.id}>
            <Link
              href={'/requests/' + r.id}
              className="font-medium text-blue-700 underline dark:text-blue-300"
            >
              {LOCKED_FIELD_LABELS[r.resource]}
            </Link>
            <StatusMessage request={r} />
          </li>
        ))}
      </ul>
    </section>
  )
}
export function AuditHistory() {
  const [before, setBefore] = useState<string | null>(null)
  const { data, loading, error, refresh } = useAccessData<AuditPage>(
    '/audit' + (before ? '?before=' + encodeURIComponent(before) : '')
  )
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Retained application lifecycle events. Actor references identify distinct verified users.
        These database records are not cryptographically tamper-proof.
      </p>
      <LoadState loading={loading} error={error} retry={refresh} />
      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Audit history</caption>
              <thead className="bg-zinc-50 dark:bg-zinc-950">
                <tr>
                  {[
                    'Event',
                    'Actor',
                    'Incident / resource',
                    'Duration',
                    'Reason',
                    'Effective time',
                    'Observed time',
                    'Request',
                  ].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.events.map((e) => (
                  <tr key={e.id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="px-4 py-3">{e.type}</td>
                    <td className="px-4 py-3 font-mono">{e.actorRef?.slice(0, 12) ?? 'System'}</td>
                    <td className="px-4 py-3">
                      {e.incidentId} · {LOCKED_FIELD_LABELS[e.resource]}
                    </td>
                    <td className="px-4 py-3">{duration(e.durationSeconds)}</td>
                    <td className="max-w-xs px-4 py-3 break-words">{e.reason ?? '—'}</td>
                    <td className="px-4 py-3">{date(e.effectiveAt)}</td>
                    <td className="px-4 py-3">{date(e.observedAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={'/requests/' + e.requestId}
                        className="text-blue-700 underline dark:text-blue-300"
                      >
                        View request
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.events.length === 0 && <p className="p-6">No audit events recorded.</p>}
          </div>
          <div className="flex gap-3">
            <button
              className={buttonClass}
              onClick={() => {
                setBefore(null)
                refresh()
              }}
            >
              Refresh latest
            </button>
            {data.nextCursor && (
              <button className={buttonClass} onClick={() => setBefore(data.nextCursor)}>
                Older events
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
