import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { findIncidentById, PROTECTED_FIELD_NAMES } from '../data/incidents'
import { getDemoConfig } from '../lib/demoConfig'
import { HttpError } from '../lib/errors'
import type { AuthUser } from '../middleware/auth'
import type { DocumentStore, StoreTransaction, Row } from './store'
import {
  actorRef,
  createRequestSchema,
  decisionSchema,
  hash,
  readRequest,
  requestView,
} from './types'
import type { StoredRequest } from './types'

const idSchema = z.string().uuid()
const collections = {
  requests: 'accessRequests',
  scopes: 'requestScopes',
  operations: 'requestOperations',
  decisions: 'approvalRecords',
  audit: 'auditEvents',
  jobs: 'authorityJobs',
}
const blockers = new Set(['pending', 'authorising', 'active'])

export class AccessService {
  constructor(
    private readonly store: DocumentStore,
    private readonly now = Date.now
  ) {}

  configuration(user: AuthUser) {
    actorRef(user)
    return {
      durationSeconds: getDemoConfig()?.shortDuration ? [900, 1800, 3600, 60] : [900, 1800, 3600],
      authorityAvailable: false,
    }
  }

  private operation(actor: string, operationId: unknown, action: string, input: unknown) {
    if (!idSchema.safeParse(operationId).success)
      throw HttpError.badRequest('A UUID Idempotency-Key is required')
    return {
      id: hash(JSON.stringify([actor, operationId])),
      fingerprint: hash(JSON.stringify([action, input])),
    }
  }

  private event(
    tx: StoreTransaction,
    id: string,
    type: string,
    r: StoredRequest,
    actor: string | null,
    observedAt: number,
    reason: string | null = null,
    effectiveAt = observedAt
  ) {
    tx.create(collections.audit, id, {
      id,
      type,
      requestId: r.id,
      requestVersion: r.version,
      actorRef: actor,
      incidentId: r.incidentId,
      resource: r.resource,
      permission: 'read',
      durationSeconds: r.durationSeconds,
      reason,
      createdAt: observedAt,
      effectiveAt,
      _schemaVersion: 1,
      deletedAt: null,
    })
  }

  private expire(tx: StoreTransaction, r: StoredRequest, now: number): StoredRequest {
    if (r.status !== 'active' || r.expiresAt === null || now < r.expiresAt) return r
    const expired: StoredRequest = { ...r, status: 'expired', updatedAt: now }
    tx.set(collections.requests, r.id, expired)
    this.event(tx, r.id + '_expiry', 'access.expired', r, null, now, null, r.expiresAt)
    return expired
  }

  async create(user: AuthUser, input: unknown, operationId: unknown) {
    const actor = actorRef(user)
    const parsed = createRequestSchema.safeParse(input)
    if (!parsed.success)
      throw HttpError.badRequest(
        'Invalid request: one protected resource, read-only permission, 20–500 character reason and acknowledgement are required.'
      )
    const body = parsed.data
    if (body.durationSeconds === 60 && !getDemoConfig()?.shortDuration)
      throw HttpError.badRequest('60-second duration is disabled')
    if (!findIncidentById(body.incidentId) || !PROTECTED_FIELD_NAMES.includes(body.resource)) {
      throw HttpError.notFound('Incident resource')
    }
    const op = this.operation(actor, operationId, 'create', body)
    const scopeId = hash(JSON.stringify([actor, body.incidentId, body.resource]))
    const id = randomUUID()
    const result = await this.store.transaction(async (tx) => {
      const previous = await tx.get(collections.operations, op.id)
      if (previous) {
        if (previous.fingerprint !== op.fingerprint)
          throw HttpError.conflict('Operation ID was used for different input')
        const old = await tx.get(collections.requests, String(previous.requestId))
        if (!old) throw HttpError.unavailable()
        return this.expire(tx, readRequest(old), this.now())
      }
      const scope = await tx.get(collections.scopes, scopeId)
      const prior = scope ? await tx.get(collections.requests, String(scope.requestId)) : null
      const now = this.now()
      if (prior) {
        const existing = this.expire(tx, readRequest(prior), now)
        if (blockers.has(existing.status))
          throw HttpError.conflict('An open request already exists for this resource')
      }
      const request: StoredRequest = {
        ...body,
        id,
        scopeId,
        requesterRef: actor,
        version: 1,
        status: 'pending',
        approvals: [],
        createdAt: now,
        updatedAt: now,
        accessStartedAt: null,
        expiresAt: null,
        rejectionReason: null,
        authorityStatus: 'not_requested',
        _schemaVersion: 1,
        deletedAt: null,
      }
      tx.create(collections.requests, id, request)
      tx.set(collections.scopes, scopeId, { requestId: id, _schemaVersion: 1, deletedAt: null })
      tx.create(collections.operations, op.id, {
        fingerprint: op.fingerprint,
        requestId: id,
        _schemaVersion: 1,
        deletedAt: null,
      })
      this.event(tx, op.id, 'request.created', request, actor, now, body.reason)
      return request
    })
    return requestView(result, actor, this.now())
  }

  async decide(user: AuthUser, requestId: string, input: unknown, operationId: unknown) {
    const actor = actorRef(user)
    if (!idSchema.safeParse(requestId).success) throw HttpError.notFound('Request')
    const parsed = decisionSchema.safeParse(input)
    if (!parsed.success)
      throw HttpError.badRequest(
        'Invalid decision; rejection requires a reason of 1–500 characters'
      )
    const decision = parsed.data
    const op = this.operation(actor, operationId, 'decision', { requestId, ...decision })
    const result = await this.store.transaction(async (tx) => {
      const prior = await tx.get(collections.operations, op.id)
      const data = await tx.get(collections.requests, requestId)
      if (!data) throw HttpError.notFound('Request')
      let request = readRequest(data)
      if (request.requesterRef === actor)
        throw HttpError.forbidden('You cannot review your own request')
      if (prior) {
        if (prior.fingerprint !== op.fingerprint)
          throw HttpError.conflict('Operation ID was used for different input')
        return request
      }
      if (request.status !== 'pending')
        throw HttpError.conflict('This request is no longer pending')
      if (request.approvals.some((a) => a.actorRef === actor))
        throw HttpError.conflict('You have already approved this request')
      const now = this.now()
      request = { ...request, updatedAt: now }
      if (decision.decision === 'reject') {
        request.status = 'rejected'
        request.rejectionReason = decision.reason
      } else {
        request.approvals = [...request.approvals, { actorRef: actor, at: now }]
        if (request.approvals.length === 2) {
          request.status = 'authorising'
          request.authorityStatus = 'unavailable'
          // Durable, stable reconciliation record. No Tide side effects in retrying transactions.
          // No completion endpoint/config flag exists until an official verifier is implemented.
          tx.create(collections.jobs, requestId, {
            id: requestId,
            requestId,
            requestVersion: 1,
            requesterRef: request.requesterRef,
            incidentId: request.incidentId,
            resource: request.resource,
            permission: 'read',
            durationSeconds: request.durationSeconds,
            status: 'blocked',
            failureCode: 'tide_authority_unavailable',
            createdAt: now,
            _schemaVersion: 1,
            deletedAt: null,
          })
          this.event(
            tx,
            requestId + '_authority_unavailable',
            'authority.failed',
            request,
            null,
            now,
            'Tide scoped authority is not configured or verified.'
          )
        }
      }
      tx.set(collections.requests, requestId, request)
      tx.create(collections.decisions, op.id, {
        id: op.id,
        requestId,
        actorRef: actor,
        decision: decision.decision,
        reason: decision.decision === 'reject' ? decision.reason : null,
        createdAt: now,
        _schemaVersion: 1,
        deletedAt: null,
      })
      tx.create(collections.operations, op.id, {
        fingerprint: op.fingerprint,
        requestId,
        _schemaVersion: 1,
        deletedAt: null,
      })
      this.event(
        tx,
        op.id,
        decision.decision === 'approve' ? 'request.approved' : 'request.rejected',
        request,
        actor,
        now,
        decision.decision === 'reject' ? decision.reason : null
      )
      return request
    })
    return requestView(result, actor, this.now())
  }

  async cancel(user: AuthUser, requestId: string, input: unknown, operationId: unknown) {
    const actor = actorRef(user)
    if (!idSchema.safeParse(requestId).success) throw HttpError.notFound('Request')
    if (!z.object({}).strict().safeParse(input).success)
      throw HttpError.badRequest('Cancellation body must be empty')
    const op = this.operation(actor, operationId, 'cancel', { requestId })
    const result = await this.store.transaction(async (tx) => {
      const prior = await tx.get(collections.operations, op.id)
      const data = await tx.get(collections.requests, requestId)
      if (!data) throw HttpError.notFound('Request')
      const request = readRequest(data)
      if (request.requesterRef !== actor) throw HttpError.forbidden('Only the requester may cancel')
      if (prior) {
        if (prior.fingerprint !== op.fingerprint)
          throw HttpError.conflict('Operation ID was used for different input')
        return request
      }
      if (request.status !== 'pending')
        throw HttpError.conflict('Only pending requests may be cancelled')
      const now = this.now()
      const cancelled: StoredRequest = { ...request, status: 'cancelled', updatedAt: now }
      tx.set(collections.requests, requestId, cancelled)
      tx.create(collections.operations, op.id, {
        fingerprint: op.fingerprint,
        requestId,
        _schemaVersion: 1,
        deletedAt: null,
      })
      this.event(tx, op.id, 'request.cancelled', request, actor, now)
      return cancelled
    })
    return requestView(result, actor, this.now())
  }

  async detail(user: AuthUser, id: string) {
    const actor = actorRef(user)
    if (!idSchema.safeParse(id).success) throw HttpError.notFound('Request')
    const r = await this.store.transaction(async (tx) => {
      const data = await tx.get(collections.requests, id)
      if (!data) throw HttpError.notFound('Request')
      // Recognised SOC members may see safe lifecycle details for review/audit.
      return this.expire(tx, readRequest(data), this.now())
    })
    return requestView(r, actor, this.now())
  }

  async list(user: AuthUser, review: boolean, before?: string) {
    const actor = actorRef(user)
    const rows = await this.store.list(
      collections.requests,
      review ? { status: 'pending' } : { requesterRef: actor },
      before
    )
    const page = rows.slice(0, 50)
    const requests = []
    for (const row of page) {
      const r = await this.detail(user, String(row.id))
      if (!review || r.canApprove) requests.push(r)
    }
    const last = page.at(-1)
    return {
      requests,
      nextCursor: rows.length > 50 && last ? last.createdAt + ':' + last.id : null,
    }
  }

  async incidentRequests(user: AuthUser, incidentId: string) {
    const actor = actorRef(user)
    if (!findIncidentById(incidentId)) throw HttpError.notFound('Incident')
    const rows = await this.store.transaction(async (tx) => {
      const found: StoredRequest[] = []
      for (const resource of PROTECTED_FIELD_NAMES) {
        const scope = await tx.get(
          collections.scopes,
          hash(JSON.stringify([actor, incidentId, resource]))
        )
        if (!scope) continue
        const data = await tx.get(collections.requests, String(scope.requestId))
        if (data) found.push(this.expire(tx, readRequest(data), this.now()))
      }
      return found
    })
    return { requests: rows.map((r) => requestView(r, actor, this.now())) }
  }

  async audit(user: AuthUser, before?: string) {
    actorRef(user)
    const rows = await this.store.list(collections.audit, {}, before)
    // Explicit safe projection; never spread raw database records into API responses.
    const events = rows.slice(0, 50).map((r: Row) => ({
      id: r.id,
      type: r.type,
      requestId: r.requestId,
      actorRef: r.actorRef,
      incidentId: r.incidentId,
      resource: r.resource,
      permission: r.permission,
      reason: r.reason,
      durationSeconds: r.durationSeconds,
      observedAt: r.createdAt,
      effectiveAt: r.effectiveAt,
    }))
    const last = rows.slice(0, 50).at(-1)
    return { events, nextCursor: rows.length > 50 && last ? last.createdAt + ':' + last.id : null }
  }

  /** Production deliberately fails closed, even for a tampered active database record. */
  async evidence(
    user: AuthUser,
    id: string,
    incidentId: string,
    resource: string,
    operationId: unknown
  ): Promise<never> {
    const actor = actorRef(user)
    if (!idSchema.safeParse(id).success) throw HttpError.notFound('Request')
    const op = this.operation(actor, operationId, 'evidence', { id, incidentId, resource })
    const denial = await this.store.transaction(async (tx) => {
      const prior = await tx.get(collections.operations, op.id)
      const data = await tx.get(collections.requests, id)
      if (!data) throw HttpError.notFound('Request')
      const request = this.expire(tx, readRequest(data), this.now())
      let code = 'tide_authority_unavailable'
      if (
        request.requesterRef !== actor ||
        request.incidentId !== incidentId ||
        request.resource !== resource ||
        request.permission !== 'read'
      )
        code = 'scope_denied'
      else if (
        request.status !== 'active' ||
        request.expiresAt === null ||
        this.now() >= request.expiresAt
      )
        code = 'access_not_active'
      if (prior && prior.fingerprint !== op.fingerprint)
        throw HttpError.conflict('Operation ID was used for different input')
      if (!prior) {
        tx.create(collections.operations, op.id, {
          fingerprint: op.fingerprint,
          requestId: id,
          _schemaVersion: 1,
          deletedAt: null,
        })
        this.event(tx, op.id, 'access.denied', request, actor, this.now(), code)
      }
      return code
    })
    if (denial === 'tide_authority_unavailable')
      throw HttpError.unavailable('Tide authority unavailable. Evidence remains locked.')
    throw HttpError.forbidden('No active access to this incident resource')
  }
}
