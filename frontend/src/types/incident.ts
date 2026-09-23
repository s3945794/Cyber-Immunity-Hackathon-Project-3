/**
 * Incident types for the SOC dashboard.
 *
 * These mirror the backend's allow-listed API response shapes exactly
 * (`backend/src/routes/incidents.ts`) — there is deliberately no field for
 * victim host, exposure evidence, or suspicious process here. The API never
 * returns those values, so there is nothing for the frontend to type,
 * store, or render beyond the field *names* in `lockedFields`.
 */

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'new' | 'investigating' | 'contained' | 'resolved'

export interface IncidentTimelineEntry {
  at: string
  event: string
}

/** GET /api/incidents — one row of the list response. */
export interface IncidentSummary {
  id: string
  threat: string
  severity: IncidentSeverity
  status: IncidentStatus
  indicators: string[]
  lockedFields: string[]
}

/** GET /api/incidents/:id — the detail response. */
export interface IncidentDetail {
  id: string
  threat: string
  severity: IncidentSeverity
  status: IncidentStatus
  timeline: IncidentTimelineEntry[]
  indicators: string[]
  lockedFields: string[]
}
