import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../../src/app'
import { mockVerifyToken, mockUser } from '../../setup'
import { PROTECTED_FIELD_NAMES } from '../../../src/data/incidents'

const ALL_SOC_ROLES = ['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager'] as const

describe('GET /api/incidents', () => {
  it('returns 401 with no token', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    const res = await request(app).get('/api/incidents')
    expect(res.status).toBe(401)
  })

  it('returns 403 for an authenticated user with no recognised SOC role', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [] })
    const res = await request(app).get('/api/incidents').set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(403)
  })

  it.each(ALL_SOC_ROLES)('returns 200 for a user with the %s role', async (role) => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [role] })
    const res = await request(app).get('/api/incidents').set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(200)
  })

  it('returns a list of incident summaries with only allow-listed general fields', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-analyst'] })

    const res = await request(app).get('/api/incidents').set('Authorization', 'Bearer valid-token')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.incidents)).toBe(true)
    expect(res.body.incidents.length).toBeGreaterThan(0)

    for (const incident of res.body.incidents) {
      expect(Object.keys(incident).sort()).toEqual(
        ['id', 'indicators', 'lockedFields', 'severity', 'status', 'threat'].sort()
      )
      expect(typeof incident.id).toBe('string')
      expect(Array.isArray(incident.indicators)).toBe(true)
      expect(incident.lockedFields).toEqual(PROTECTED_FIELD_NAMES)
    }
  })

  it('returns exactly the three expected locked field names for every incident', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-analyst'] })

    const res = await request(app).get('/api/incidents').set('Authorization', 'Bearer valid-token')

    for (const incident of res.body.incidents) {
      expect(incident.lockedFields).toEqual(['victimHost', 'exposureEvidence', 'suspiciousProcess'])
    }
  })

  it('never includes protected field names as object keys with values in the list response', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-manager'] })

    const res = await request(app).get('/api/incidents').set('Authorization', 'Bearer valid-token')

    const serialized = JSON.stringify(res.body)

    // Field names are expected to appear as string values inside
    // lockedFields (e.g. "victimHost") — but never as an object key
    // (e.g. "victimHost":), which would prove a value was attached
    // alongside the name.
    for (const field of PROTECTED_FIELD_NAMES) {
      expect(serialized.includes(`"${field}":`)).toBe(false)
    }
    // The internal key "protectedFields" must never appear — this backend
    // has no such property anywhere in the incident data model.
    expect(serialized.includes('protectedFields')).toBe(false)
    expect(serialized.includes('protectedValue')).toBe(false)
    expect(serialized.includes('REDACTED-SYNTHETIC')).toBe(false)
  })
})

describe('GET /api/incidents/:id', () => {
  it('returns 401 with no token', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    const res = await request(app).get('/api/incidents/INC-1001')
    expect(res.status).toBe(401)
  })

  it('returns 403 for an authenticated user with no recognised SOC role', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [] })
    const res = await request(app)
      .get('/api/incidents/INC-1001')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(403)
  })

  it.each(ALL_SOC_ROLES)('returns 200 for a user with the %s role', async (role) => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [role] })
    const res = await request(app)
      .get('/api/incidents/INC-1001')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(200)
  })

  it('returns 404 for an unknown incident id', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-analyst'] })
    const res = await request(app)
      .get('/api/incidents/INC-9999')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(404)
  })

  it('returns a detail response with only allow-listed general fields plus lockedFields metadata', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-supervisor'] })

    const res = await request(app)
      .get('/api/incidents/INC-1001')
      .set('Authorization', 'Bearer valid-token')

    expect(res.status).toBe(200)
    const { incident } = res.body
    expect(Object.keys(incident).sort()).toEqual(
      ['id', 'indicators', 'lockedFields', 'severity', 'status', 'threat', 'timeline'].sort()
    )
    expect(incident.id).toBe('INC-1001')
    expect(Array.isArray(incident.timeline)).toBe(true)
    expect(incident.timeline.length).toBeGreaterThan(0)
    for (const entry of incident.timeline) {
      expect(Object.keys(entry).sort()).toEqual(['at', 'event'].sort())
    }
    expect(incident.lockedFields).toEqual(PROTECTED_FIELD_NAMES)
  })

  it('returns exactly the three expected locked field names', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-team-leader'] })

    const res = await request(app)
      .get('/api/incidents/INC-1002')
      .set('Authorization', 'Bearer valid-token')

    expect(res.body.incident.lockedFields).toEqual([
      'victimHost',
      'exposureEvidence',
      'suspiciousProcess',
    ])
  })

  it('never includes protected field names as object keys with values, and never any placeholder value', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-team-leader'] })

    const res = await request(app)
      .get('/api/incidents/INC-1002')
      .set('Authorization', 'Bearer valid-token')

    const serialized = JSON.stringify(res.body)

    for (const field of PROTECTED_FIELD_NAMES) {
      expect(serialized.includes(`"${field}":`)).toBe(false)
    }
    expect(serialized.includes('protectedFields')).toBe(false)
    expect(serialized.includes('protectedValue')).toBe(false)
    expect(serialized.includes('REDACTED-SYNTHETIC')).toBe(false)
  })
})
