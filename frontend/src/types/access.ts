import type { LockedResourceKey } from '@/components/incidents/constants'
export type RequestStatus =
  'pending' | 'authorising' | 'active' | 'rejected' | 'cancelled' | 'expired'
export interface AccessRequest {
  id: string
  incidentId: string
  resource: LockedResourceKey
  permission: 'read'
  reason: string
  durationSeconds: number
  requesterRef: string
  status: RequestStatus
  approvalCount: number
  approvals: { actorRef: string; at: number }[]
  createdAt: number
  updatedAt: number
  accessStartedAt: number | null
  expiresAt: number | null
  rejectionReason: string | null
  authorityStatus: 'not_requested' | 'unavailable'
  evidenceAvailable: false
  canApprove: boolean
  canCancel: boolean
}
export interface AuditEvent {
  id: string
  type: string
  requestId: string
  actorRef: string | null
  incidentId: string
  resource: LockedResourceKey
  permission: 'read'
  reason: string | null
  durationSeconds: number
  observedAt: number
  effectiveAt: number
}
export interface RequestPage {
  requests: AccessRequest[]
  nextCursor: string | null
}
export interface AuditPage {
  events: AuditEvent[]
  nextCursor: string | null
}
export interface AccessConfig {
  durationSeconds: number[]
  authorityAvailable: false
}
