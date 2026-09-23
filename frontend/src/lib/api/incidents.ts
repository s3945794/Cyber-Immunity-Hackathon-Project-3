'use client'

/**
 * Client-side API access for the incident dashboard.
 *
 * Calls the backend Express API (`backend/src/routes/incidents.ts`) directly
 * — there is no Next.js proxy/rewrite for this. The base URL comes from
 * `NEXT_PUBLIC_API_URL` (see `.env.example`, `docs/ENV-VARS.md`).
 *
 * Auth: obtains the current TideCloak access token via the SDK's own
 * `getToken()` accessor (the smallest supported method — see
 * `useTideCloak()` / `TideCloakContextValue` in `@tidecloak/react`) and
 * sends it only as an `Authorization: Bearer <token>` header. The token is
 * never logged, rendered, put in a URL, returned from a function other than
 * this one receiving it directly from the SDK, stored in component state,
 * or written to localStorage — it lives only in the fetch call's headers
 * for the lifetime of this request.
 */
import type { IncidentSummary, IncidentDetail } from '@/types/incident'

/** Thrown for any non-2xx response other than a 404 on a single incident. */
export class IncidentApiError extends Error {
  constructor(message = 'Failed to load incident data') {
    super(message)
    this.name = 'IncidentApiError'
  }
}

/** Thrown specifically when a requested incident id does not exist (404). */
export class IncidentNotFoundError extends Error {
  constructor(id: string) {
    super(`Incident '${id}' not found`)
    this.name = 'IncidentNotFoundError'
  }
}

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001'
}

/**
 * A minimal shape of the TideCloak SDK context this module needs —
 * decoupled from the full `TideCloakContextValue` so this file doesn't
 * import `@tidecloak/react` types directly.
 */
interface TokenSource {
  getToken: () => Promise<string | null>
}

async function authorizedFetch(tokenSource: TokenSource, path: string): Promise<Response> {
  const token = await tokenSource.getToken()
  if (!token) {
    throw new IncidentApiError('No active session')
  }

  return fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

/** Fetches the incident list (general fields only). Throws IncidentApiError on failure. */
export async function fetchIncidents(tokenSource: TokenSource): Promise<IncidentSummary[]> {
  const res = await authorizedFetch(tokenSource, '/api/incidents')
  if (!res.ok) {
    throw new IncidentApiError()
  }
  const body = (await res.json()) as { incidents: IncidentSummary[] }
  return body.incidents
}

/**
 * Fetches a single incident's detail (general fields only).
 * Throws IncidentNotFoundError for a 404, IncidentApiError for anything else.
 */
export async function fetchIncidentById(
  tokenSource: TokenSource,
  id: string
): Promise<IncidentDetail> {
  const res = await authorizedFetch(tokenSource, `/api/incidents/${encodeURIComponent(id)}`)
  if (res.status === 404) {
    throw new IncidentNotFoundError(id)
  }
  if (!res.ok) {
    throw new IncidentApiError()
  }
  const body = (await res.json()) as { incident: IncidentDetail }
  return body.incident
}
