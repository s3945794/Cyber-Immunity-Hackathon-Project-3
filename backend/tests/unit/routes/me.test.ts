import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../../src/app'
import { mockVerifyToken, mockUser } from '../../setup'

describe('GET /api/me', () => {
  it('returns 401 with no token', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    const res = await request(app).get('/api/me')
    expect(res.status).toBe(401)
  })

  it('returns the authenticated user uid, email and roles for a valid token', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({
      ...mockUser,
      roles: ['soc-analyst', 'soc-manager'],
    })

    const res = await request(app).get('/api/me').set('Authorization', 'Bearer valid-token')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      uid: mockUser.uid,
      email: mockUser.email,
      roles: ['soc-analyst', 'soc-manager'],
    })
  })

  it('returns null for email when the token has no email claim', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({
      uid: 'user-no-email',
      email: undefined,
      claims: {},
      roles: [],
    })

    const res = await request(app).get('/api/me').set('Authorization', 'Bearer valid-token')

    expect(res.status).toBe(200)
    expect(res.body.email).toBeNull()
  })

  it('returns an empty roles array when the token carries no recognised SOC role', async () => {
    const app = createApp({ verifyToken: mockVerifyToken })
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [] })

    const res = await request(app).get('/api/me').set('Authorization', 'Bearer valid-token')

    expect(res.status).toBe(200)
    expect(res.body.roles).toEqual([])
  })
})
