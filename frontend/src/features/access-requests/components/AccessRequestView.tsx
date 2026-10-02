'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { fetchIncidentById, IncidentApiError, IncidentNotFoundError } from '@/lib/api/incidents'
import {
  isLockedResourceKey,
  LOCKED_FIELD_LABELS,
  type LockedResourceKey,
} from '@/components/incidents/constants'
import { IncidentErrorState } from '@/components/incidents/IncidentErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import {
  accessRequestSchema,
  REQUEST_DURATIONS,
  type AccessRequestFormValues,
} from '@/features/access-requests/validation'
import type { IncidentDetail } from '@/types/incident'

interface AccessRequestViewProps {
  incidentId: string
  resourceQuery: string | null
}

interface AccessRequestFormProps {
  incident: IncidentDetail
  resource: LockedResourceKey
  onPrepared: (request: AccessRequestFormValues) => void
}

interface PreparedRequestSummaryProps {
  incidentId: string
  resource: LockedResourceKey
  request: AccessRequestFormValues
}

const ACKNOWLEDGMENT =
  'I understand that access requires approval from two other SOC staff members and that this demonstration does not submit a real request or grant access.'

function incidentHref(incidentId: string): string {
  return `/incidents/${encodeURIComponent(incidentId)}`
}

function ReturnToIncidentLink({ incidentId, label }: { incidentId: string; label: string }) {
  return (
    <Link
      href={incidentHref(incidentId)}
      className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {label}
    </Link>
  )
}

function AccessRequestForm({ incident, resource, onPrepared }: AccessRequestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AccessRequestFormValues>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      reason: '',
      acknowledged: false,
    },
  })

  const reasonLength = useWatch({ control, name: 'reason' })?.length ?? 0
  const reasonDescriptionId = errors.reason ? 'reason-help reason-error' : 'reason-help'

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onPrepared)}
      className="space-y-6"
      aria-label="Prepare emergency access request"
    >
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Request details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Incident ID
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {incident.id}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Threat</dt>
            <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{incident.threat}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Protected resource
            </dt>
            <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {LOCKED_FIELD_LABELS[resource]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Permission
            </dt>
            <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Read-only</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="reason"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              Reason
            </label>
            <span
              className={`text-xs ${reasonLength > 500 ? 'text-red-600' : 'text-zinc-500'}`}
              aria-live="polite"
            >
              {reasonLength}/500 characters
            </span>
          </div>
          <textarea
            id="reason"
            rows={5}
            aria-invalid={errors.reason ? 'true' : 'false'}
            aria-describedby={reasonDescriptionId}
            className="block w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="Explain why temporary access is needed for this incident."
            {...register('reason')}
          />
          <p id="reason-help" className="text-xs text-zinc-500">
            Enter 20 to 500 characters. Leading and trailing whitespace is removed.
          </p>
          {errors.reason && (
            <p id="reason-error" role="alert" className="text-sm text-red-600">
              {errors.reason.message}
            </p>
          )}
        </div>

        <fieldset aria-describedby={errors.duration ? 'duration-error' : undefined}>
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Requested duration
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {REQUEST_DURATIONS.map((duration) => (
              <label
                key={duration}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <input
                  type="radio"
                  value={duration}
                  className="size-4 accent-blue-600"
                  {...register('duration')}
                />
                {duration} minutes
              </label>
            ))}
          </div>
          {errors.duration && (
            <p id="duration-error" role="alert" className="mt-2 text-sm text-red-600">
              {errors.duration.message}
            </p>
          )}
        </fieldset>

        <div>
          <label className="flex items-start gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            <input
              type="checkbox"
              aria-invalid={errors.acknowledged ? 'true' : 'false'}
              aria-describedby={errors.acknowledged ? 'acknowledgment-error' : undefined}
              className="mt-0.5 size-4 shrink-0 accent-blue-600"
              {...register('acknowledged')}
            />
            <span>{ACKNOWLEDGMENT}</span>
          </label>
          {errors.acknowledged && (
            <p id="acknowledgment-error" role="alert" className="mt-2 text-sm text-red-600">
              {errors.acknowledged.message}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ReturnToIncidentLink incidentId={incident.id} label="Cancel" />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Prepare request
          </button>
        </div>
      </section>
    </form>
  )
}

function PreparedRequestSummary({ incidentId, resource, request }: PreparedRequestSummaryProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Request prepared</h2>
          <p className="mt-1 text-sm font-medium text-blue-800 dark:text-blue-200">
            Demo only — this request was not submitted, saved or approved.
          </p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-zinc-100 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">Incident ID</dt>
          <dd className="text-sm text-zinc-900 sm:col-span-2 dark:text-zinc-100">{incidentId}</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">Protected resource</dt>
          <dd className="text-sm text-zinc-900 sm:col-span-2 dark:text-zinc-100">
            {LOCKED_FIELD_LABELS[resource]}
          </dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">Permission</dt>
          <dd className="text-sm text-zinc-900 sm:col-span-2 dark:text-zinc-100">Read-only</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">Requested duration</dt>
          <dd className="text-sm text-zinc-900 sm:col-span-2 dark:text-zinc-100">
            {request.duration} minutes
          </dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">Reason</dt>
          <dd className="text-sm break-words whitespace-pre-wrap text-zinc-900 sm:col-span-2 dark:text-zinc-100">
            {request.reason}
          </dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">Approval requirement</dt>
          <dd className="text-sm text-zinc-900 sm:col-span-2 dark:text-zinc-100">
            Two other SOC staff members
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <ReturnToIncidentLink incidentId={incidentId} label="Return to incident" />
      </div>
    </section>
  )
}

function InvalidRequestState({ incidentId, message }: { incidentId: string; message: string }) {
  return (
    <EmptyState
      title="Access request unavailable"
      description={message}
      action={<ReturnToIncidentLink incidentId={incidentId} label="Return to incident" />}
    />
  )
}

function requestContextKey({ incidentId, resourceQuery }: AccessRequestViewProps): string {
  return JSON.stringify([incidentId, resourceQuery])
}

export function AccessRequestView(props: AccessRequestViewProps) {
  return <AccessRequestViewContent key={requestContextKey(props)} {...props} />
}

function AccessRequestViewContent({ incidentId, resourceQuery }: AccessRequestViewProps) {
  const { authenticated, loading: authLoading, getToken } = useAuth()
  const resource =
    resourceQuery !== null && isLockedResourceKey(resourceQuery) ? resourceQuery : null
  const resourceError =
    resourceQuery === null
      ? 'Choose a protected resource from the incident page before preparing a request.'
      : resource === null
        ? 'The requested protected resource is not recognised.'
        : null
  const requestKey = `${incidentId}:${resourceQuery ?? ''}`

  const [incident, setIncident] = useState<IncidentDetail | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadedForKey, setLoadedForKey] = useState(requestKey)
  const [reloadToken, setReloadToken] = useState(0)
  const [preparedRequest, setPreparedRequest] = useState<AccessRequestFormValues | null>(null)

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setReloadToken((value) => value + 1)
  }, [])

  const isLoading = authLoading || loading || loadedForKey !== requestKey

  useEffect(() => {
    if (authLoading || !authenticated || resourceError) return

    let ignore = false

    fetchIncidentById({ getToken }, incidentId)
      .then((data) => {
        if (ignore) return
        setIncident(data)
        setNotFound(false)
        setError(null)
      })
      .catch((caught: unknown) => {
        if (ignore) return
        setIncident(null)
        if (caught instanceof IncidentNotFoundError) {
          setNotFound(true)
          setError(null)
          return
        }
        const message = caught instanceof IncidentApiError ? caught.message : undefined
        setNotFound(false)
        setError(message ?? 'Could not load this incident. Please try again.')
      })
      .finally(() => {
        if (ignore) return
        setLoading(false)
        setLoadedForKey(requestKey)
      })

    return () => {
      ignore = true
    }
    // getToken is stable through the TideCloak provider; reloadToken is the explicit retry trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, authLoading, incidentId, requestKey, reloadToken, resourceError])

  if (authLoading || !authenticated) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (resourceError) {
    return <InvalidRequestState incidentId={incidentId} message={resourceError} />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (notFound) {
    return (
      <EmptyState
        title="Incident not found"
        description="The incident for this access request does not exist."
        action={<ReturnToIncidentLink incidentId={incidentId} label="Return to incident" />}
      />
    )
  }

  if (error) {
    return <IncidentErrorState message={error} onRetry={retry} />
  }

  if (!incident || !resource) return null

  if (!incident.lockedFields.includes(resource)) {
    return (
      <InvalidRequestState
        incidentId={incidentId}
        message="This resource is not listed as protected for the selected incident."
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency access request</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Prepare a demonstration request for one protected incident resource.
        </p>
      </div>

      <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">Demonstration only</p>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            Preparing this form does not submit a request, contact approvers or grant access.
          </p>
        </div>
      </div>

      {preparedRequest ? (
        <PreparedRequestSummary
          incidentId={incident.id}
          resource={resource}
          request={preparedRequest}
        />
      ) : (
        <AccessRequestForm
          incident={incident}
          resource={resource}
          onPrepared={setPreparedRequest}
        />
      )}
    </div>
  )
}
