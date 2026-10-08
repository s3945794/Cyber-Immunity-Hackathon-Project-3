'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { fetchIncidents, IncidentApiError } from '@/lib/api/incidents'
import { IncidentTable } from '@/components/incidents/IncidentTable'
import { IncidentErrorState } from '@/components/incidents/IncidentErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { IncidentSummary } from '@/types/incident'

/**
 * SOC incident dashboard. All four recognised SOC roles can view this page
 * (see `(dashboard)/layout.tsx` — RoleGuard is unchanged). Incident data
 * comes from the backend's synthetic dataset (`GET /api/incidents`) —
 * general fields only; protected fields never leave the backend, so there
 * is nothing here to redact beyond what the API already omits.
 */
export default function DashboardPage() {
  const { getToken } = useAuth()
  const [incidents, setIncidents] = useState<IncidentSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Starts true so the first render already shows the spinner without a
  // synchronous setState call inside the effect (react-hooks/set-state-in-effect).
  const [loading, setLoading] = useState(true)
  const [reloadToken, setReloadToken] = useState(0)
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('')
  const [status, setStatus] = useState('')
  const visible =
    incidents?.filter(
      (i) =>
        (!severity || i.severity === severity) &&
        (!status || i.status === status) &&
        [i.id, i.threat, ...i.indicators]
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    ) ?? []

  // User-triggered (not effect-body) state reset — safe under
  // react-hooks/set-state-in-effect, which only restricts synchronous
  // setState calls made directly inside an effect's body.
  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadToken((n) => n + 1)
  }, [])

  useEffect(() => {
    let ignore = false

    fetchIncidents({ getToken })
      .then((data) => {
        if (ignore) return
        setIncidents(data)
      })
      .catch((err: unknown) => {
        if (ignore) return
        const message = err instanceof IncidentApiError ? err.message : undefined
        setError(message ?? 'Could not load incident data. Please try again.')
      })
      .finally(() => {
        if (ignore) return
        setLoading(false)
      })

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incident Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Synthetic SOC incidents. Victim host, exposure evidence, and suspicious process details
          are protected and shown as locked on the incident detail page.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!loading && error && <IncidentErrorState message={error} onRetry={retry} />}

      {!loading && !error && incidents && incidents.length === 0 && (
        <EmptyState
          title="No incidents"
          description="There are currently no incidents to display."
        />
      )}

      {!loading && !error && incidents && incidents.length > 0 && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Total incidents', incidents.length],
              ['Open incidents', incidents.filter((i) => i.status !== 'resolved').length],
              [
                'High or critical',
                incidents.filter((i) => i.severity === 'high' || i.severity === 'critical').length,
              ],
            ].map(([label, count]) => (
              <div
                key={String(label)}
                className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-blue-800 dark:text-blue-200">
                  {count}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium">
              Search incidents
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 focus:outline-2 focus:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="text-sm font-medium">
              Severity
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 focus:outline-2 focus:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">All severities</option>
                {['low', 'medium', 'high', 'critical'].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 focus:outline-2 focus:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">All statuses</option>
                {['new', 'investigating', 'contained', 'resolved'].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {visible.length ? (
            <IncidentTable incidents={visible} />
          ) : (
            <p className="rounded-lg border border-zinc-200 p-6 text-sm dark:border-zinc-800">
              No incidents match these filters.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
