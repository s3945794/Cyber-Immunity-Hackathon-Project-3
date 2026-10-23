import { createElement, type ReactNode } from 'react'
import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Application boundary tests only: the SDK context and network are synthetic.
// No SDK source files, package-manager directories, real issuer or private data.
const sdk = vi.hoisted(() => ({
  config: vi.fn<(config: unknown) => void>(),
  context: {
    authenticated: false,
    isInitializing: false,
    initError: null,
    idToken: null,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn<() => Promise<string | null>>(),
  },
}))
vi.mock('@tidecloak/nextjs', () => ({
  TideCloakProvider: ({ config, children }: { config: unknown; children: ReactNode }) => {
    sdk.config(config)
    return children
  },
  useTideCloak: () => sdk.context,
}))

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL', 'https://issuer.invalid/')
  vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_REALM', 'synthetic-realm')
  vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_CLIENT_ID', 'synthetic-client')
  vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED', 'external')
  vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI', '')
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.invalid')
  fetchMock.mockReset()
  fetchMock.mockImplementation(
    async () => new Response(JSON.stringify({ incidents: [], ok: true }))
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('F8 application integration boundary (mocked SDK/network, not live Tide)', () => {
  it('configures a public client without DPoP opt-in or replacement PKCE handling', async () => {
    const { getTideCloakConfig } = await import('@/lib/tidecloak/config')
    const config = getTideCloakConfig()
    expect(config).toMatchObject({
      'auth-server-url': 'https://issuer.invalid',
      realm: 'synthetic-realm',
      resource: 'synthetic-client',
      'public-client': true,
      setupRequestEnclave: false,
    })
    expect(config).not.toHaveProperty('useDPoP')
    // PKCE validation/defaults remain SDK-owned; this does not test SDK internals.
    expect(config).not.toHaveProperty('pkceMethod')
  })

  it('passes the actual application config to the SDK and retains its token accessor', async () => {
    const { getTideCloakConfig } = await import('@/lib/tidecloak/config')
    const { AuthProvider, useAuthContext } = await import('@/providers/AuthProvider')
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: ({ children }) => createElement(AuthProvider, null, children),
    })
    expect(sdk.config).toHaveBeenCalledWith(getTideCloakConfig())
    expect(sdk.config.mock.calls[0]?.[0]).not.toHaveProperty('useDPoP')
    expect(result.current.getToken).toBe(sdk.context.getToken)
    expect(result.current.authenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('incident requests use the current SDK token as Bearer without inventing a proof', async () => {
    const { fetchIncidents } = await import('@/lib/api/incidents')
    const auth = {
      getToken: vi
        .fn<() => Promise<string | null>>()
        .mockResolvedValueOnce('SYNTHETIC_TOKEN_1')
        .mockResolvedValueOnce('SYNTHETIC_TOKEN_2'),
    }
    await expect(fetchIncidents(auth)).resolves.toEqual([])
    await expect(fetchIncidents(auth)).resolves.toEqual([])
    expect(auth.getToken).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    for (const [index, token] of ['SYNTHETIC_TOKEN_1', 'SYNTHETIC_TOKEN_2'].entries()) {
      const call = fetchMock.mock.calls[index]
      expect(call?.[0]).toBe('https://api.invalid/api/incidents')
      expect(call?.[1]?.cache).toBe('no-store')
      const headers = new Headers(call?.[1]?.headers)
      expect(headers.get('Authorization')).toBe(`Bearer ${token}`)
      expect(headers.has('DPoP')).toBe(false)
    }
  })

  it.each(['GET', 'POST'] as const)(
    'access %s requests retain Bearer transport and existing request safeguards',
    async (method) => {
      const { accessApi } = await import('@/lib/api/access')
      const body = method === 'POST' ? { reason: 'synthetic test metadata' } : undefined
      const auth = { getToken: vi.fn().mockResolvedValue('SYNTHETIC_ACCESS_TOKEN') }
      await expect(accessApi(auth, '/requests', body, 'synthetic-operation')).resolves.toEqual({
        incidents: [],
        ok: true,
      })
      expect(auth.getToken).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledOnce()
      const call = fetchMock.mock.calls[0]
      expect(call?.[0]).toBe('https://api.invalid/api/requests')
      expect(call?.[1]).toMatchObject({ method, cache: 'no-store', credentials: 'omit' })
      expect(call?.[1]?.signal).toBeInstanceOf(AbortSignal)
      expect(call?.[1]?.body).toBe(body === undefined ? undefined : JSON.stringify(body))
      const headers = new Headers(call?.[1]?.headers)
      expect(headers.get('Authorization')).toBe('Bearer SYNTHETIC_ACCESS_TOKEN')
      expect(headers.has('DPoP')).toBe(false)
      expect(headers.get('Idempotency-Key')).toBe('synthetic-operation')
      expect(headers.get('Content-Type')).toBe(method === 'POST' ? 'application/json' : null)
    }
  )

  it.each(['incidents', 'access'] as const)(
    '%s requests fail closed before network access without a session',
    async (client) => {
      const auth = { getToken: vi.fn().mockResolvedValue(null) }
      if (client === 'incidents') {
        const { fetchIncidents, IncidentApiError } = await import('@/lib/api/incidents')
        await expect(fetchIncidents(auth)).rejects.toBeInstanceOf(IncidentApiError)
      } else {
        const { accessApi } = await import('@/lib/api/access')
        await expect(accessApi(auth, '/requests')).rejects.toMatchObject({ status: 401 })
      }
      expect(auth.getToken).toHaveBeenCalledOnce()
      expect(fetchMock).not.toHaveBeenCalled()
    }
  )
})
