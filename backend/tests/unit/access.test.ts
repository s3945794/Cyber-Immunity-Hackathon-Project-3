import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { AccessService } from '../../src/access/service'
import { actorRef } from '../../src/access/types'
import { getDemoConfig } from '../../src/lib/demoConfig'
import { createApp } from '../../src/app'
import type { AuthUser } from '../../src/middleware/auth'
import { MemoryStore } from '../support/MemoryStore'

const user = (uid: string, role: AuthUser['roles'][number] = 'soc-analyst'): AuthUser => ({
  uid,
  email: undefined,
  roles: [role],
  claims: { iss: 'https://test.example/realms/soc', sub: uid },
})
const a = user('a'),
  b = user('b', 'soc-supervisor'),
  c = user('c', 'soc-manager')
const input = {
  incidentId: 'INC-1001',
  resource: 'victimHost',
  permission: 'read',
  reason: 'Temporary access for incident investigation.',
  durationSeconds: 900,
  acknowledged: true,
}
let db: MemoryStore, service: AccessService, time: number
const create = () => service.create(a, input, randomUUID())
beforeEach(() => {
  vi.unstubAllEnvs()
  time = 100000
  db = new MemoryStore()
  service = new AccessService(db, () => time)
})
describe('workflow unit fixture — no live Tide or Firestore', () => {
  it.each([19, 501])('rejects reason length %s', async (n) => {
    await expect(
      service.create(a, { ...input, reason: 'x'.repeat(n) }, randomUUID())
    ).rejects.toMatchObject({ status: 400 })
  })
  it.each([20, 500])('accepts trimmed reason length %s', async (n) => {
    expect(
      (await service.create(a, { ...input, reason: '  ' + 'x'.repeat(n) + '  ' }, randomUUID()))
        .reason
    ).toHaveLength(n)
  })
  it.each([
    { requesterRef: 'spoof' },
    { approverId: 'spoof' },
    { roles: ['soc-manager'] },
    { status: 'active' },
    { grant: {} },
    { permission: 'write' },
    { durationSeconds: 1 },
    { durationSeconds: 60 },
    { resource: 'all' },
    { acknowledged: false },
    { incidentId: 'INC-9999' },
  ])('rejects invalid/escalating input %j', async (extra) => {
    await expect(service.create(a, { ...input, ...extra }, randomUUID())).rejects.toBeDefined()
    expect(db.rows.size).toBe(0)
  })
  it('requires verified issuer/subject and SOC membership', async () => {
    expect(actorRef(a)).not.toBe(
      actorRef({ ...a, claims: { ...a.claims, iss: 'https://other.example' } })
    )
    await expect(
      service.create({ ...a, claims: { ...a.claims, sub: 'b' } }, input, randomUUID())
    ).rejects.toMatchObject({ status: 401 })
    await expect(service.create({ ...a, roles: [] }, input, randomUUID())).rejects.toMatchObject({
      status: 403,
    })
  })
  it('permits only one simultaneous duplicate scope', async () => {
    const results = await Promise.allSettled([create(), create(), create()])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
  })
  it('makes same-ID create retries idempotent and rejects different input', async () => {
    const op = randomUUID()
    const [r, s] = await Promise.all([service.create(a, input, op), service.create(a, input, op)])
    expect(r.id).toBe(s.id)
    await expect(
      service.create(a, { ...input, resource: 'exposureEvidence' }, op)
    ).rejects.toMatchObject({ status: 409 })
    expect((await service.audit(a)).events).toHaveLength(1)
  })
  it('denies self/duplicate approvals; two business approvals keep evidence locked', async () => {
    const r = await create()
    await expect(
      service.decide(a, r.id, { decision: 'approve' }, randomUUID())
    ).rejects.toMatchObject({ status: 403 })
    const op = randomUUID()
    expect((await service.decide(b, r.id, { decision: 'approve' }, op)).approvalCount).toBe(1)
    expect((await service.decide(b, r.id, { decision: 'approve' }, op)).approvalCount).toBe(1)
    await expect(
      service.decide(b, r.id, { decision: 'approve' }, randomUUID())
    ).rejects.toMatchObject({ status: 409 })
    expect(await service.decide(c, r.id, { decision: 'approve' }, randomUUID())).toMatchObject({
      status: 'authorising',
      authorityStatus: 'unavailable',
      evidenceAvailable: false,
      accessStartedAt: null,
      expiresAt: null,
    })
  })
  it('serializes concurrent approvals into one blocked authority job', async () => {
    const r = await create()
    await Promise.all([
      service.decide(b, r.id, { decision: 'approve' }, randomUUID()),
      service.decide(c, r.id, { decision: 'approve' }, randomUUID()),
    ])
    expect((await service.detail(a, r.id)).approvalCount).toBe(2)
    expect([...db.rows.keys()].filter((k) => k.startsWith('authorityJobs/'))).toHaveLength(1)
    expect(
      (await service.audit(a)).events.filter((e) => e.type === 'authority.failed')
    ).toHaveLength(1)
  })
  it('reject/approve race remains terminal and allows a new request', async () => {
    const r = await create()
    await Promise.allSettled([
      service.decide(b, r.id, { decision: 'reject', reason: 'Not needed' }, randomUUID()),
      service.decide(c, r.id, { decision: 'approve' }, randomUUID()),
    ])
    expect((await service.detail(a, r.id)).status).toBe('rejected')
    await expect(
      service.decide(c, r.id, { decision: 'approve' }, randomUUID())
    ).rejects.toMatchObject({ status: 409 })
    expect((await create()).status).toBe('pending')
  })
  it('requires rejection reason; requester alone cancels idempotently', async () => {
    const r = await create()
    await expect(
      service.decide(b, r.id, { decision: 'reject' }, randomUUID())
    ).rejects.toMatchObject({ status: 400 })
    await expect(service.cancel(b, r.id, {}, randomUUID())).rejects.toMatchObject({ status: 403 })
    const op = randomUUID()
    expect((await service.cancel(a, r.id, {}, op)).status).toBe('cancelled')
    expect((await service.cancel(a, r.id, {}, op)).status).toBe('cancelled')
    await expect(
      service.decide(b, r.id, { decision: 'approve' }, randomUUID())
    ).rejects.toMatchObject({ status: 409 })
    expect((await create()).id).not.toBe(r.id)
  })
  it('scopes history and excludes requester/previous approver from queue', async () => {
    const r = await create()
    expect((await service.list(a, true)).requests).toHaveLength(0)
    expect((await service.list(b, false)).requests).toHaveLength(0)
    expect((await service.list(b, true)).requests).toHaveLength(1)
    await service.decide(b, r.id, { decision: 'approve' }, randomUUID())
    expect((await service.list(b, true)).requests).toHaveLength(0)
  })
  it('database active flag cannot mint authority, and extra payload fields fail closed', async () => {
    const r = await create()
    await service.decide(b, r.id, { decision: 'approve' }, randomUUID())
    await service.decide(c, r.id, { decision: 'approve' }, randomUUID())
    const row = db.rows.get('accessRequests/' + r.id)!
    Object.assign(row, { status: 'active', accessStartedAt: time, expiresAt: time + 900000 })
    expect(await service.detail(a, r.id)).toMatchObject({
      status: 'authorising',
      evidenceAvailable: false,
    })
    await expect(
      service.evidence(a, r.id, input.incidentId, input.resource, randomUUID())
    ).rejects.toMatchObject({ status: 503 })
    row.plaintext = 'must never be returned'
    await expect(service.detail(a, r.id)).rejects.toMatchObject({ status: 503 })
  })
  it.each([
    [b, 'INC-1001', 'victimHost'],
    [a, 'INC-1002', 'victimHost'],
    [a, 'INC-1001', 'exposureEvidence'],
  ])('denies wrong requester/incident/resource', async (who, incident, resource) => {
    const r = await create()
    await expect(
      service.evidence(who as AuthUser, r.id, String(incident), String(resource), randomUUID())
    ).rejects.toMatchObject({ status: 403 })
  })
  it('denies now >= expiry and materializes exactly one expiry audit', async () => {
    const r = await create()
    await service.decide(b, r.id, { decision: 'approve' }, randomUUID())
    await service.decide(c, r.id, { decision: 'approve' }, randomUUID())
    Object.assign(db.rows.get('accessRequests/' + r.id)!, {
      status: 'active',
      accessStartedAt: time,
      expiresAt: time + 900000,
    })
    time += 900000
    await expect(
      service.evidence(a, r.id, input.incidentId, input.resource, randomUUID())
    ).rejects.toMatchObject({ status: 403 })
    time += 1000
    expect((await service.detail(a, r.id)).status).toBe('expired')
    expect((await service.audit(a)).events.filter((e) => e.type === 'access.expired')).toHaveLength(
      1
    )
    expect((await create()).status).toBe('pending')
  })
  it('retains one denied-access event across retry', async () => {
    const r = await create(),
      op = randomUUID()
    for (let n = 0; n < 2; n++)
      await expect(
        service.evidence(a, r.id, input.incidentId, input.resource, op)
      ).rejects.toMatchObject({ status: 403 })
    expect((await service.audit(a)).events.filter((e) => e.type === 'access.denied')).toHaveLength(
      1
    )
  })
})
describe('HTTP boundaries', () => {
  it('allow-listed preflight works before auth; GET and POST still require tokens', async () => {
    const verify = vi.fn().mockResolvedValue(a)
    const app = createApp({
      verifyToken: verify,
      accessService: service,
      corsOrigin: 'http://localhost:3000',
    })
    const r = await request(app)
      .options('/api/requests')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'authorization,content-type,idempotency-key')
    expect(r.status).toBe(204)
    expect(r.headers['access-control-allow-origin']).toBe('http://localhost:3000')
    expect(verify).not.toHaveBeenCalled()
    expect((await request(app).get('/api/requests')).status).toBe(401)
    expect((await request(app).post('/api/requests').send(input)).status).toBe(401)
    const bad = await request(app)
      .options('/api/requests')
      .set('Origin', 'https://untrusted.example')
      .set('Access-Control-Request-Method', 'POST')
    expect(bad.headers['access-control-allow-origin']).not.toBe('https://untrusted.example')
  })
  it('denies non-member before database and retains authentication-only /me', async () => {
    const app = createApp({
      verifyToken: async () => ({ ...a, roles: [] }),
      accessService: service,
    })
    expect(
      (await request(app).get('/api/requests').set('Authorization', 'Bearer test')).status
    ).toBe(403)
    expect(db.rows.size).toBe(0)
    expect((await request(app).get('/api/me').set('Authorization', 'Bearer test')).status).toBe(200)
  })
  it('sets no-store and rejects malformed/oversized requests', async () => {
    const app = createApp({ verifyToken: async () => a, accessService: service })
    const r = await request(app)
      .post('/api/requests')
      .set('Authorization', 'Bearer test')
      .set('Idempotency-Key', randomUUID())
      .send(input)
    expect(r.status).toBe(201)
    expect(r.headers['cache-control']).toContain('no-store')
    expect(r.body.request.evidenceAvailable).toBe(false)
    expect(
      (
        await request(app)
          .post('/api/requests')
          .set('Authorization', 'Bearer test')
          .set('Content-Type', 'application/json')
          .send('{')
      ).status
    ).toBe(400)
    expect(
      (
        await request(app)
          .post('/api/requests')
          .set('Authorization', 'Bearer test')
          .send({ ...input, reason: 'x'.repeat(1100000) })
      ).status
    ).toBe(413)
  })
})
describe('emulator safety', () => {
  it('rejects cloud projects, missing/public emulator and reserved Tide port', () => {
    for (const vars of [
      {
        SOC_LOCAL_DEMO: 'true',
        GCLOUD_PROJECT: 'real-project',
        FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085',
      },
      { SOC_LOCAL_DEMO: 'true', GCLOUD_PROJECT: 'demo-soc-incident-protection' },
      {
        SOC_LOCAL_DEMO: 'true',
        GCLOUD_PROJECT: 'demo-soc-incident-protection',
        FIRESTORE_EMULATOR_HOST: 'public.example:8085',
      },
      {
        SOC_LOCAL_DEMO: 'true',
        GCLOUD_PROJECT: 'demo-soc-incident-protection',
        FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
      },
      { FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085' },
    ])
      expect(() => getDemoConfig(vars)).toThrow()
  })
  it('only trusted demo configuration enables the optional 60 seconds', async () => {
    vi.stubEnv('SOC_LOCAL_DEMO', 'true')
    vi.stubEnv('GCLOUD_PROJECT', 'demo-soc-incident-protection')
    vi.stubEnv('FIRESTORE_EMULATOR_HOST', '127.0.0.1:8085')
    expect(service.configuration(a).durationSeconds).not.toContain(60)
    vi.stubEnv('SOC_DEMO_SHORT_DURATION', 'true')
    expect(
      (await service.create(a, { ...input, durationSeconds: 60 }, randomUUID())).durationSeconds
    ).toBe(60)
  })
})

describe('history API integrity', () => {
  it('rejects malformed and unknown history query parameters', async () => {
    const app = createApp({ verifyToken: async () => a, accessService: service })
    for (const query of [
      'before=',
      'before=100000:valid:extra',
      'before=not-a-cursor',
      'role=soc-manager',
    ]) {
      expect(
        (
          await request(app)
            .get('/api/requests?' + query)
            .set('Authorization', 'Bearer test')
        ).status
      ).toBe(400)
    }
  })
  it('exposes audit history without mutation APIs', async () => {
    await create()
    const before = await service.audit(a)
    const app = createApp({ verifyToken: async () => a, accessService: service })
    for (const method of ['post', 'put', 'delete'] as const) {
      expect(
        (await request(app)[method]('/api/audit').set('Authorization', 'Bearer test').send({}))
          .status
      ).toBe(404)
    }
    expect(await service.audit(a)).toEqual(before)
  })
})
