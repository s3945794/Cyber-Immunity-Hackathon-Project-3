'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { fetchIncidentById, IncidentApiError, IncidentNotFoundError } from '@/lib/api/incidents'
import { LockedField } from '@/components/incidents/LockedField'
import {
  lockedFieldLabel,
  severityBadgeClass,
  statusBadgeClass,
} from '@/components/incidents/constants'
import { IncidentErrorState } from '@/components/incidents/IncidentErrorState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDatetime, cn } from '@/lib/utils'
import type { IncidentDetail } from '@/types/incident'

/**
 * Incident detail page. Displays only the general fields the backend
 * returns (`GET /api/incidents/:id`) — victim host, exposure evidence, and
 * suspicious process are never fetched or held in any state here; only
 * their names (via `incident.lockedFields`) are used, to render
 * {@link LockedField} indicators.
 */
export default function IncidentDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { getToken } = useAuth()

  const [incident, setIncident] = useState<IncidentDetail | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Starts true so the first render already shows the spinner without a
  // synchronous setState call inside the effect (react-hooks/set-state-in-effect).
  const [loading, setLoading] = useState(true)
  // Tracks which incident id the current loading/loaded state belongs to,
  // so navigating directly between two /incidents/[id] pages (no unmount)
  // still shows a spinner for the new id instead of stale content — derived
  // during render rather than reset via a synchronous setState in the effect.
  const [loadedForId, setLoadedForId] = useState(id)
  const [reloadToken, setReloadToken] = useState(0)

  // User-triggered (not effect-body) state reset — safe under
  // react-hooks/set-state-in-effect, which only restricts synchronous
  // setState calls made directly inside an effect's body.
  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setReloadToken((n) => n + 1)
  }, [])

  const isLoading = loading || loadedForId !== id

  useEffect(() => {
    let ignore = false

    fetchIncidentById({ getToken }, id)
      .then((data) => {
        if (ignore) return
        setIncident(data)
      })
      .catch((err: unknown) => {
        if (ignore) return
        if (err instanceof IncidentNotFoundError) {
          setNotFound(true)
          return
        }
        const message = err instanceof IncidentApiError ? err.message : undefined
        setError(message ?? 'Could not load this incident. Please try again.')
      })
      .finally(() => {
        if (ignore) return
        setLoading(false)
        setLoadedForId(id)
      })

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reloadToken])

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && notFound && (
        <EmptyState title="Incident not found" description={`No incident matches '${id}'.`} />
      )}

      {!isLoading && !notFound && error && <IncidentErrorState message={error} onRetry={retry} />}

      {!isLoading && !notFound && !error && incident && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{incident.id}</h1>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                severityBadgeClass(incident.severity)
              )}
            >
              {incident.severity}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                statusBadgeClass(incident.status)
              )}
            >
              {incident.status}
            </span>
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-500">Threat</h2>
            <p className="mt-1 text-base">{incident.threat}</p>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-500">Indicators of compromise</h2>
            {incident.indicators.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {incident.indicators.map((indicator) => (
                  <li
                    key={indicator}
                    className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {indicator}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-zinc-500">No indicators recorded.</p>
            )}
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-500">Timeline</h2>
            {incident.timeline.length > 0 ? (
              <ol className="mt-3 space-y-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                {incident.timeline.map((entry, index) => (
                  <li key={`${entry.at}-${index}`}>
                    <p className="text-xs text-zinc-400">{formatDatetime(entry.at)}</p>
                    <p className="text-sm">{entry.event}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-1 text-sm text-zinc-500">No timeline events recorded.</p>
            )}
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-500">Protected evidence</h2>
            <p className="mt-1 text-sm text-zinc-500">
              The following fields are protected and require emergency access approval, which is not
              implemented in this view.
            </p>
            <div className="mt-3 space-y-2">
              {incident.lockedFields.map((field) => (
                <LockedField key={field} label={lockedFieldLabel(field)} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
