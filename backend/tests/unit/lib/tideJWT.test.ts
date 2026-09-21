import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SignJWT, exportJWK, generateKeyPair } from 'jose'

const REALM = 'soc-incident-report-protection'
const AUTH_SERVER_URL = 'http://localhost:8080'
const RESOURCE = 'soc-incident-report-protection-app'
const ISSUER = `${AUTH_SERVER_URL}/realms/${REALM}`

/** Generates a local EC key pair + adapter-shaped JWKS for tests. No real keys, no network. */
async function generateTestKeys() {
  const { publicKey, privateKey } = await generateKeyPair('ES256', { extractable: true })
  const publicJwk = await exportJWK(publicKey)
  publicJwk.kid = 'test-key-1'
  publicJwk.alg = 'ES256'
  publicJwk.use = 'sig'
  return { privateKey, publicJwk }
}

function buildConfig(publicJwk: Record<string, unknown>) {
  return {
    realm: REALM,
    'auth-server-url': AUTH_SERVER_URL,
    resource: RESOURCE,
    jwk: { keys: [publicJwk] },
  }
}

interface SignOptions {
  privateKey: CryptoKey
  kid?: string
  alg?: string
  issuer?: string
  azp?: string
  aud?: string | string[]
  sub?: string
  email?: string
  realmRoles?: string[]
  clientRoles?: string[]
  expiresInSeconds?: number
  issuedAtOffsetSeconds?: number
  notBeforeOffsetSeconds?: number
}

async function signTestToken(opts: SignOptions): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const iat = now + (opts.issuedAtOffsetSeconds ?? 0)

  let builder = new SignJWT({
    azp: opts.azp ?? RESOURCE,
    ...(opts.aud !== undefined ? { aud: opts.aud } : {}),
    ...(opts.email ? { email: opts.email } : {}),
    realm_access: { roles: opts.realmRoles ?? [] },
    resource_access: {
      [RESOURCE]: { roles: opts.clientRoles ?? [] },
    },
  })
    .setProtectedHeader({ alg: opts.alg ?? 'ES256', kid: opts.kid ?? 'test-key-1' })
    .setIssuer(opts.issuer ?? ISSUER)
    .setSubject(opts.sub ?? 'user-123')
    .setIssuedAt(iat)
    .setExpirationTime(iat + (opts.expiresInSeconds ?? 3600))

  if (opts.notBeforeOffsetSeconds !== undefined) {
    builder = builder.setNotBefore(iat + opts.notBeforeOffsetSeconds)
  }

  return builder.sign(opts.privateKey)
}

describe('tideJWT', () => {
  let privateKey: CryptoKey
  let publicJwk: Record<string, unknown>

  beforeEach(async () => {
    vi.resetModules()
    const keys = await generateTestKeys()
    privateKey = keys.privateKey
    publicJwk = keys.publicJwk as unknown as Record<string, unknown>
  })

  async function loadModulesWithConfig(config: unknown) {
    process.env.CLIENT_ADAPTER = JSON.stringify(config)
    const configModule = await import('../../../src/lib/tidecloakConfig')
    configModule.__resetTideCloakConfigCache()
    const jwtModule = await import('../../../src/lib/tideJWT')
    jwtModule.__resetTideJWKSCache()
    return jwtModule
  }

  afterEach(() => {
    delete process.env.CLIENT_ADAPTER
  })

  it('accepts a valid token and returns the payload', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({ privateKey })
    const payload = await verifyTideCloakJWT(token)
    expect(payload.sub).toBe('user-123')
    expect(payload.azp).toBe(RESOURCE)
  })

  it('rejects a malformed token', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    await expect(verifyTideCloakJWT('not-a-jwt')).rejects.toThrow()
  })

  it('rejects a token with an invalid signature', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    // Sign with a different, unrelated key — same claims, wrong signature.
    const other = await generateTestKeys()
    const token = await signTestToken({ privateKey: other.privateKey })
    await expect(verifyTideCloakJWT(token)).rejects.toThrow()
  })

  it('rejects an expired token', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({
      privateKey,
      issuedAtOffsetSeconds: -7200,
      expiresInSeconds: 3600,
    })
    await expect(verifyTideCloakJWT(token)).rejects.toThrow()
  })

  it('rejects a token with the wrong issuer', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({
      privateKey,
      issuer: 'http://evil.example.com/realms/other',
    })
    await expect(verifyTideCloakJWT(token)).rejects.toThrow()
  })

  it('rejects a token with the wrong azp', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({ privateKey, azp: 'some-other-client' })
    await expect(verifyTideCloakJWT(token)).rejects.toThrow()
  })

  it('does not treat aud as the client id — a mismatched aud with correct azp still passes', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({ privateKey, aud: 'account', azp: RESOURCE })
    const payload = await verifyTideCloakJWT(token)
    expect(payload.azp).toBe(RESOURCE)
  })

  it('rejects a token issued too far in the future', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({ privateKey, issuedAtOffsetSeconds: 3600 })
    await expect(verifyTideCloakJWT(token)).rejects.toThrow(/future/i)
  })

  it('accepts a token issued slightly in the future within tolerance', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({ privateKey, issuedAtOffsetSeconds: 30 })
    const payload = await verifyTideCloakJWT(token)
    expect(payload.sub).toBe('user-123')
  })

  it('rejects a token with a future not-before time', async () => {
    const { verifyTideCloakJWT } = await loadModulesWithConfig(buildConfig(publicJwk))
    const token = await signTestToken({ privateKey, notBeforeOffsetSeconds: 3600 })
    await expect(verifyTideCloakJWT(token)).rejects.toThrow()
  })

  describe('extractSocRoles', () => {
    it('returns an empty array when there is no role claim', async () => {
      const { verifyTideCloakJWT, extractSocRoles } = await loadModulesWithConfig(
        buildConfig(publicJwk)
      )
      const token = await signTestToken({ privateKey, realmRoles: [], clientRoles: [] })
      const payload = await verifyTideCloakJWT(token)
      expect(extractSocRoles(payload)).toEqual([])
    })

    it('ignores unrelated TideCloak roles', async () => {
      const { verifyTideCloakJWT, extractSocRoles } = await loadModulesWithConfig(
        buildConfig(publicJwk)
      )
      const token = await signTestToken({
        privateKey,
        realmRoles: ['default-roles-soc', 'offline_access', 'uma_authorization'],
        clientRoles: ['some-other-client-role'],
      })
      const payload = await verifyTideCloakJWT(token)
      expect(extractSocRoles(payload)).toEqual([])
    })

    it.each(['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager'] as const)(
      'extracts the %s realm role',
      async (role) => {
        const { verifyTideCloakJWT, extractSocRoles } = await loadModulesWithConfig(
          buildConfig(publicJwk)
        )
        const token = await signTestToken({ privateKey, realmRoles: [role] })
        const payload = await verifyTideCloakJWT(token)
        expect(extractSocRoles(payload)).toEqual([role])
      }
    )

    it('extracts SOC roles from client (resource_access) roles too', async () => {
      const { verifyTideCloakJWT, extractSocRoles } = await loadModulesWithConfig(
        buildConfig(publicJwk)
      )
      const token = await signTestToken({ privateKey, clientRoles: ['soc-manager'] })
      const payload = await verifyTideCloakJWT(token)
      expect(extractSocRoles(payload)).toEqual(['soc-manager'])
    })

    it('combines realm and client roles without duplicates', async () => {
      const { verifyTideCloakJWT, extractSocRoles } = await loadModulesWithConfig(
        buildConfig(publicJwk)
      )
      const token = await signTestToken({
        privateKey,
        realmRoles: ['soc-analyst', 'soc-supervisor'],
        clientRoles: ['soc-supervisor'],
      })
      const payload = await verifyTideCloakJWT(token)
      expect(extractSocRoles(payload).sort()).toEqual(['soc-analyst', 'soc-supervisor'])
    })
  })
})
