import { Router, type Router as ExpressRouter } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { requireAnyRole } from '../middleware/auth'
import { SOC_ROLES } from '../lib/tideJWT'
import { HttpError } from '../lib/errors'
import {
  listIncidents,
  findIncidentById,
  PROTECTED_FIELD_NAMES,
  type Incident,
  type IncidentSeverity,
  type IncidentStatus,
  type IncidentTimelineEntry,
} from '../data/incidents'

const router: ExpressRouter = Router()

// All four recognised SOC roles may view the dashboard and general incident
// information — this is a membership check only (see backend/CLAUDE.md /
// middleware/auth.ts), not a role-specific permission split.
const requireSocMembership = requireAnyRole(...SOC_ROLES)

interface IncidentSummaryResponse {
  id: string
  threat: string
  severity: IncidentSeverity
  status: IncidentStatus
  indicators: string[]
  lockedFields: string[]
}

interface IncidentDetailResponse {
  id: string
  threat: string
  severity: IncidentSeverity
  status: IncidentStatus
  timeline: IncidentTimelineEntry[]
  indicators: string[]
  lockedFields: string[]
}

/**
 * Builds a list-view response from an internal incident record using an
 * explicit allow-list. Never spread the internal `Incident` object — the
 * data model holds no protected-field values at all; only the protected
 * field *names* are surfaced, via `lockedFields`.
 */
function toSummaryResponse(incident: Incident): IncidentSummaryResponse {
  return {
    id: incident.id,
    threat: incident.threat,
    severity: incident.severity,
    status: incident.status,
    indicators: [...incident.indicators],
    lockedFields: [...PROTECTED_FIELD_NAMES],
  }
}

/**
 * Builds a detail-view response from an internal incident record using an
 * explicit allow-list. Never spread the internal `Incident` object — the
 * data model holds no protected-field values at all; only the protected
 * field *names* are surfaced, via `lockedFields`.
 */
function toDetailResponse(incident: Incident): IncidentDetailResponse {
  return {
    id: incident.id,
    threat: incident.threat,
    severity: incident.severity,
    status: incident.status,
    timeline: incident.timeline.map((entry) => ({ at: entry.at, event: entry.event })),
    indicators: [...incident.indicators],
    lockedFields: [...PROTECTED_FIELD_NAMES],
  }
}

// GET /api/incidents — list all incidents (general fields only).
// Requires a recognised SOC role (any of the four — membership, not hierarchy).
router.get('/', requireSocMembership, (_req: Request, res: Response, _next: NextFunction) => {
  const incidents = listIncidents().map(toSummaryResponse)
  res.json({ incidents })
})

// GET /api/incidents/:id — single incident detail (general fields only).
// Requires a recognised SOC role (any of the four — membership, not hierarchy).
router.get('/:id', requireSocMembership, (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const incidentId = typeof id === 'string' ? id : ''
  const incident = findIncidentById(incidentId)
  if (!incident) {
    return next(HttpError.notFound('Incident', incidentId))
  }

  res.json({ incident: toDetailResponse(incident) })
})

export { router as incidentsRouter }
