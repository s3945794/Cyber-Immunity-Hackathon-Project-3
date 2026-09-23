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
        <IncidentTable incidents={incidents} />
      )}
    </div>
  )
}
