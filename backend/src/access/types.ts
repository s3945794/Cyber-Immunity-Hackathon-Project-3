import { z } from 'zod'
import { createHash } from 'node:crypto'
import type { AuthUser } from '../middleware/auth'
import { SOC_ROLES } from '../lib/tideJWT'
import { HttpError } from '../lib/errors'

export const resourceSchema = z.enum(['victimHost', 'exposureEvidence', 'suspiciousProcess'])
export const createRequestSchema = z
  .object({
    incidentId: z.string().regex(/^INC-[0-9]{4}$/),
    resource: resourceSchema,
    permission: z.literal('read'),
    reason: z.string().trim().min(20).max(500),
    durationSeconds: z.union([z.literal(900), z.literal(1800), z.literal(3600), z.literal(60)]),
    acknowledged: z.literal(true),
  })
  .strict()
export const decisionSchema = z.discriminatedUnion('decision', [
  z.object({ decision: z.literal('approve') }).strict(),
  z.object({ decision: z.literal('reject'), reason: z.string().trim().min(1).max(500) }).strict(),
])
export const approvalSchema = z
  .object({
    actorRef: z.string().regex(/^[a-f0-9]{64}$/),
    at: z.number().int().nonnegative(),
  })
  .strict()
export const storedRequestSchema = createRequestSchema
  .extend({
    id: z.string().uuid(),
    requesterRef: z.string().regex(/^[a-f0-9]{64}$/),
    scopeId: z.string().regex(/^[a-f0-9]{64}$/),
    version: z.literal(1),
    status: z.enum(['pending', 'authorising', 'active', 'rejected', 'cancelled', 'expired']),
    approvals: z.array(approvalSchema).max(2),
    createdAt: z.number().int().nonnegative(),
    updatedAt: z.number().int().nonnegative(),
    accessStartedAt: z.number().int().nonnegative().nullable(),
    expiresAt: z.number().int().nonnegative().nullable(),
    rejectionReason: z.string().max(500).nullable(),
    authorityStatus: z.enum(['not_requested', 'unavailable']),
    _schemaVersion: z.literal(1),
    deletedAt: z.null(),
  })
  .strict()

export type CreateRequest = z.infer<typeof createRequestSchema>
export type Decision = z.infer<typeof decisionSchema>
export type StoredRequest = z.infer<typeof storedRequestSchema>
export type Resource = z.infer<typeof resourceSchema>

export const hash = (value: string): string => createHash('sha256').update(value).digest('hex')

/** Identity derives only from the verified issuer/subject, never a display name. */
export function actorRef(user: AuthUser): string {
  if (!user.roles.some((role) => SOC_ROLES.includes(role))) throw HttpError.forbidden()
  const issuer = user.claims.iss
  const subject = user.claims.sub
  if (typeof issuer !== 'string' || !issuer || subject !== user.uid || !user.uid) {
    throw HttpError.unauthorized('Verified issuer and subject required')
  }
  return hash(JSON.stringify([issuer, subject]))
}

export function readRequest(value: unknown): StoredRequest {
  const parsed = storedRequestSchema.safeParse(value)
  if (!parsed.success)
    throw HttpError.unavailable('Stored request is invalid; evidence remains locked.')
  const r = parsed.data
  const distinct = new Set(r.approvals.map((a) => a.actorRef))
  if (distinct.size !== r.approvals.length || distinct.has(r.requesterRef)) {
    throw HttpError.unavailable('Stored approvals are invalid; evidence remains locked.')
  }
  if (
    ((r.status === 'authorising' || r.status === 'active') && r.approvals.length !== 2) ||
    (r.status === 'pending' && r.approvals.length >= 2) ||
    (r.status === 'active' &&
      (r.accessStartedAt === null ||
        r.expiresAt === null ||
        r.expiresAt !== r.accessStartedAt + r.durationSeconds * 1000))
  )
    throw HttpError.unavailable('Stored lifecycle is invalid; evidence remains locked.')
  return r
}

/** Safe application view. An 'active' database flag alone can NEVER advertise access. */
export function requestView(r: StoredRequest, actor: string, now: number) {
  const expired = r.expiresAt !== null && now >= r.expiresAt
  const status =
    expired && r.status === 'active' ? 'expired' : r.status === 'active' ? 'authorising' : r.status
  return {
    id: r.id,
    incidentId: r.incidentId,
    resource: r.resource,
    permission: r.permission,
    reason: r.reason,
    durationSeconds: r.durationSeconds,
    requesterRef: r.requesterRef,
    status,
    approvalCount: r.approvals.length,
    approvals: r.approvals,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    accessStartedAt: null,
    expiresAt: null,
    rejectionReason: r.rejectionReason,
    authorityStatus: status === 'authorising' ? 'unavailable' : r.authorityStatus,
    evidenceAvailable: false,
    canApprove:
      status === 'pending' &&
      actor !== r.requesterRef &&
      !r.approvals.some((a) => a.actorRef === actor),
    canCancel: status === 'pending' && actor === r.requesterRef,
  }
}
