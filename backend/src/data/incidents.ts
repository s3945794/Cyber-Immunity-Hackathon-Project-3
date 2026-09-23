/**
 * Synthetic SOC incident data — backend-only, in-memory.
 *
 * This module exists purely to exercise the incident-dashboard slice with
 * realistic-shaped data. There is no Firestore collection or other
 * persistence for incidents in this branch (see CLAUDE.md — "Do not use
 * Firestore in this branch").
 *
 * All values are synthetic:
 *   - IP addresses use the RFC 5737 documentation ranges
 *     (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24).
 *   - Domains use the IANA reserved "example" TLD family.
 *
 * Victim host, exposure evidence, and suspicious process are protected
 * fields. This branch never creates, stores, or returns a value for any of
 * them — there is no field, property, or placeholder anywhere in this
 * module that holds one. Only the field *names* exist, in
 * `PROTECTED_FIELD_NAMES`, so routes/incidents.ts can surface them as
 * `lockedFields` metadata.
 *
 * routes/incidents.ts must always build responses via an explicit
 * allow-list of fields from this module.
 */

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'new' | 'investigating' | 'contained' | 'resolved'

export interface IncidentTimelineEntry {
  at: string
  event: string
}

/** Names the protected fields that exist for an incident — no values, ever. */
export type ProtectedFieldName = 'victimHost' | 'exposureEvidence' | 'suspiciousProcess'

export interface Incident {
  id: string
  threat: string
  severity: IncidentSeverity
  status: IncidentStatus
  timeline: IncidentTimelineEntry[]
  indicators: string[]
}

export const PROTECTED_FIELD_NAMES: ProtectedFieldName[] = [
  'victimHost',
  'exposureEvidence',
  'suspiciousProcess',
]

/**
 * Synthetic incident records. IPs are RFC 5737 test-net addresses; domains
 * use the example.{com,net,org} reserved TLD family (RFC 2606). Every
 * incident is protected by the same three fields (`PROTECTED_FIELD_NAMES`)
 * — this module holds no value for any of them.
 */
const incidents: Incident[] = [
  {
    id: 'INC-1001',
    threat: 'Credential stuffing',
    severity: 'high',
    status: 'investigating',
    timeline: [
      { at: '2026-09-20T09:58:00Z', event: 'Anomalous login volume detected' },
      { at: '2026-09-20T10:00:00Z', event: 'Alert triggered and assigned to SOC queue' },
      { at: '2026-09-20T10:12:00Z', event: 'Analyst began triage' },
    ],
    indicators: ['198.51.100.23', 'login-anomaly', 'suspicious-useragent'],
  },
  {
    id: 'INC-1002',
    threat: 'Malicious attachment — dropper',
    severity: 'critical',
    status: 'contained',
    timeline: [
      { at: '2026-09-19T14:03:00Z', event: 'Email gateway flagged attachment' },
      { at: '2026-09-19T14:05:00Z', event: 'Endpoint detection blocked execution' },
      { at: '2026-09-19T14:40:00Z', event: 'Host isolated from network' },
      { at: '2026-09-19T16:10:00Z', event: 'Incident marked contained' },
    ],
    indicators: ['203.0.113.77', 'malicious-attachment.example.com', 'dropper-signature-7a2f'],
  },
  {
    id: 'INC-1003',
    threat: 'Suspicious outbound C2 beaconing',
    severity: 'medium',
    status: 'new',
    timeline: [{ at: '2026-09-22T08:15:00Z', event: 'Periodic beacon pattern flagged by NDR' }],
    indicators: ['192.0.2.44', 'beacon-interval-60s', 'c2.example.net'],
  },
  {
    id: 'INC-1004',
    threat: 'Insider data exfiltration attempt',
    severity: 'high',
    status: 'resolved',
    timeline: [
      { at: '2026-09-15T11:00:00Z', event: 'DLP policy triggered on large upload' },
      { at: '2026-09-15T11:20:00Z', event: 'Upload blocked, user session suspended' },
      { at: '2026-09-16T09:00:00Z', event: 'Investigation closed — false positive' },
    ],
    indicators: ['203.0.113.201', 'large-upload-anomaly'],
  },
]

/** Returns all synthetic incidents. Callers must map through an allow-list before responding. */
export function listIncidents(): Incident[] {
  return incidents
}

/** Returns a single synthetic incident by id, or undefined if not found. */
export function findIncidentById(id: string): Incident | undefined {
  return incidents.find((incident) => incident.id === id)
}
