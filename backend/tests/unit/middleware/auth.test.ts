import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { SignJWT, exportJWK, generateKeyPair } from 'jose'
import {
  createAuthMiddleware,
  requireRole,
  requireAnyRole,
  type AuthenticatedRequest,
  type VerifyToken,
} from '../../../src/middleware/auth'
import { errorHandler } from '../../../src/middleware/errorHandler'
import { createApp } from '../../../src/app'
import { mockVerifyToken, mockUser } from '../../setup'

const REALM = 'soc-incident-report-protection'
const AUTH_SERVER_URL = 'http://localhost:8080'
const RESOURCE = 'soc-incident-report-protection-app'
const ISSUER = `${AUTH_SERVER_URL}/realms/${REALM}`

async function buildRealAuthFixture() {
  const { publicKey, privateKey } = await generateKeyPair('ES256', { extractable: true })
  const publicJwk = (await exportJWK(publicKey)) as Record<string, unknown>
  publicJwk.kid = 'test-key-1'
  publicJwk.alg = 'ES256'
  publicJwk.use = 'sig'

  process.env.CLIENT_ADAPTER = JSON.stringify({
    realm: REALM,
    'auth-server-url': AUTH_SERVER_URL,
    resource: RESOURCE,
    jwk: { keys: [publicJwk] },
  })

  const configModule = await import('../../../src/lib/tidecloakConfig')
  configModule.__resetTideCloakConfigCache()
  const jwtModule = await import('../../../src/lib/tideJWT')
  jwtModule.__resetTideJWKSCache()

  const authModule = await import('../../../src/middleware/auth')

  async function sign(
    overrides: {
      realmRoles?: string[]
      azp?: string
      issuer?: string
    } = {}
  ) {
    const now = Math.floor(Date.now() / 1000)
    return new SignJWT({
      azp: overrides.azp ?? RESOURCE,
      realm_access: { roles: overrides.realmRoles ?? [] },
      resource_access: { [RESOURCE]: { roles: [] } },
    })
      .setProtectedHeader({ alg: 'ES256', kid: 'test-key-1' })
      .setIssuer(overrides.issuer ?? ISSUER)
      .setSubject('user-123')
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(privateKey)
  }

  return { sign, authModule }
}

/** Builds a tiny Express app around just the auth + role middleware, for isolated testing. */
function buildTestApp(verifyToken: VerifyToken) {
  const app = express()
  const auth = createAuthMiddleware(verifyToken)

  app.get('/protected', auth, (req, res) => {
    const { user } = req as AuthenticatedRequest
    res.json({ uid: user.uid })
  })

  app.get('/protected/analyst-only', auth, requireRole('soc-analyst'), (req, res) => {
    const { user } = req as AuthenticatedRequest
    res.json({ uid: user.uid })
  })

  app.get(
    '/protected/soc-staff',
    auth,
    requireAnyRole('soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager'),
    (req, res) => {
      const { user } = req as AuthenticatedRequest
      res.json({ uid: user.uid, roles: user.roles })
    }
  )

  app.get('/protected/no-accepted-roles', auth, requireAnyRole(), (req, res) => {
    const { user } = req as AuthenticatedRequest
    res.json({ uid: user.uid })
  })

  // No auth middleware ahead of this one — used to prove requireAnyRole
  // itself returns 401 when no authenticated user is attached.
  app.get('/unauthenticated/soc-staff', requireAnyRole('soc-analyst'), (req, res) => {
    const { user } = req as AuthenticatedRequest
    res.json({ uid: user.uid })
  })

  app.use(errorHandler)
  return app
}

describe('createAuthMiddleware', () => {
  it('returns 401 when the Authorization header is missing', async () => {
    const app = buildTestApp(mockVerifyToken)
    const res = await request(app).get('/protected')
    expect(res.status).toBe(401)
  })

  it('returns 401 for an incorrect authorization scheme', async () => {
    const app = buildTestApp(mockVerifyToken)
    const res = await request(app).get('/protected').set('Authorization', 'Basic abc123')
    expect(res.status).toBe(401)
  })

  it('returns 401 when verifyToken rejects (invalid/malformed/expired token, wrong issuer, wrong azp, etc.)', async () => {
    const failing: VerifyToken = vi.fn().mockRejectedValue(new Error('invalid'))
    const app = buildTestApp(failing)
    const res = await request(app).get('/protected').set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })

  it('allows the request through for a valid token', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce(mockUser)
    const res = await request(app).get('/protected').set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(200)
    expect(res.body.uid).toBe(mockUser.uid)
  })

  it('returns 403 when an authenticated user lacks the required role', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [] })
    const res = await request(app)
      .get('/protected/analyst-only')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(403)
  })

  it('allows the request through when the authenticated user has the required role', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-analyst'] })
    const res = await request(app)
      .get('/protected/analyst-only')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(200)
  })
})

describe('requireAnyRole', () => {
  it('returns 401 when no authenticated user is attached to the request', async () => {
    const app = buildTestApp(mockVerifyToken)
    const res = await request(app).get('/unauthenticated/soc-staff')
    expect(res.status).toBe(401)
  })

  it('returns 403 when the authenticated user has none of the accepted roles', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [] })
    const res = await request(app)
      .get('/protected/soc-staff')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(403)
  })

  it('returns 403 for a recognised-but-unaccepted role (role alone is not membership in every set)', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-manager'] })
    const res = await request(app)
      .get('/protected/analyst-only') // only accepts 'soc-analyst' via requireRole
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(403)
  })

  it.each(['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager'] as const)(
    'allows the request through when the authenticated user has the %s role',
    async (role) => {
      const app = buildTestApp(mockVerifyToken)
      vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: [role] })
      const res = await request(app)
        .get('/protected/soc-staff')
        .set('Authorization', 'Bearer valid-token')
      expect(res.status).toBe(200)
      expect(res.body.roles).toEqual([role])
    }
  )

  it('allows the request through when the user has at least one of several accepted roles', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({
      ...mockUser,
      roles: ['soc-supervisor', 'soc-manager'],
    })
    const res = await request(app)
      .get('/protected/soc-staff')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(200)
  })

  it('fails closed (403) when the accepted-role list is empty, even for an authenticated user with roles', async () => {
    const app = buildTestApp(mockVerifyToken)
    vi.mocked(mockVerifyToken).mockResolvedValueOnce({ ...mockUser, roles: ['soc-manager'] })
    const res = await request(app)
      .get('/protected/no-accepted-roles')
      .set('Authorization', 'Bearer valid-token')
    expect(res.status).toBe(403)
  })

  it('returns 401 before evaluating roles when the token itself is invalid', async () => {
    const failing: VerifyToken = vi.fn().mockRejectedValue(new Error('invalid'))
    const app = buildTestApp(failing)
    const res = await request(app)
      .get('/protected/soc-staff')
      .set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })
})

describe('createAuthMiddleware — real TideCloak verification end to end', () => {
  it('accepts a real, validly signed TideCloak-shaped token and extracts roles', async () => {
    const { sign, authModule } = await buildRealAuthFixture()
    const app = express()
    app.get(
      '/protected',
      authModule.createAuthMiddleware(authModule.verifyTideCloakToken),
      (req, res) => {
        const { user } = req as AuthenticatedRequest
        res.json({ uid: user.uid, roles: user.roles })
      }
    )
    app.use(errorHandler)

    const token = await sign({ realmRoles: ['soc-manager'] })
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.uid).toBe('user-123')
    expect(res.body.roles).toEqual(['soc-manager'])

    delete process.env.CLIENT_ADAPTER
  })

  it('returns 401 for a real token with the wrong issuer', async () => {
    const { sign, authModule } = await buildRealAuthFixture()
    const app = express()
    app.get(
      '/protected',
      authModule.createAuthMiddleware(authModule.verifyTideCloakToken),
      (_req, res) => {
        res.json({ ok: true })
      }
    )
    app.use(errorHandler)

    const token = await sign({ issuer: 'http://evil.example.com/realms/other' })
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    delete process.env.CLIENT_ADAPTER
  })

  it('returns 401 for a real token with the wrong azp', async () => {
    const { sign, authModule } = await buildRealAuthFixture()
    const app = express()
    app.get(
      '/protected',
      authModule.createAuthMiddleware(authModule.verifyTideCloakToken),
      (_req, res) => {
        res.json({ ok: true })
      }
    )
    app.use(errorHandler)

    const token = await sign({ azp: 'some-other-client' })
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    delete process.env.CLIENT_ADAPTER
  })
})

describe('TideCloak auth path does not require Firebase Authentication config', () => {
  const ORIGINAL_FIREBASE_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64

  beforeEach(() => {
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
  })

  afterEach(() => {
    if (ORIGINAL_FIREBASE_KEY !== undefined) {
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 = ORIGINAL_FIREBASE_KEY
    }
    vi.doUnmock('firebase-admin/app')
    vi.resetModules()
  })

  it('imports middleware/auth.ts and app.ts without initialising Firebase Admin', async () => {
    // Unmock the global tests/setup.ts stub for lib/firebase and instead mock
    // the underlying firebase-admin/app module to throw if it is ever
    // touched. If middleware/auth.ts (or app.ts, via auth.ts) still imports
    // lib/firebase.ts transitively, this import would throw — proving the
    // isolation instead of merely asserting it.
    vi.resetModules()
    vi.doMock('firebase-admin/app', () => ({
      initializeApp: vi.fn(() => {
        throw new Error('firebase-admin/app should not be touched by the TideCloak auth path')
      }),
      getApps: vi.fn(() => []),
      cert: vi.fn(),
    }))

    // No FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is set (see beforeEach) — if
    // anything on this import path required Firebase Admin, it would throw
    // here, either from the mock above or from the real SDK's own config
    // check in lib/firebase.ts.
    const authModule = await import('../../../src/middleware/auth')
    const appModule = await import('../../../src/app')

    expect(authModule.createAuthMiddleware).toBeTypeOf('function')
    expect(authModule.verifyTideCloakToken).toBeTypeOf('function')
    expect(appModule.createApp).toBeTypeOf('function')

    // Confirms the app is actually usable end to end without Firebase config.
    const app = appModule.createApp({ verifyToken: mockVerifyToken })
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
  })
})

describe('createApp — /api/health stays public', () => {
  it('does not require auth for /api/health even with the default (TideCloak) verifyToken', async () => {
    const app = createApp()
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('rejects protected routes with 401 when no adapter config is present', async () => {
    delete process.env.CLIENT_ADAPTER
    const app = createApp()
    const res = await request(app).get('/api/anything').set('Authorization', 'Bearer whatever')
    expect(res.status).toBe(401)
  })
})
