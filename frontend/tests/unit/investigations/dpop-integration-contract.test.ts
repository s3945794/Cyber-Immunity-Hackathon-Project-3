import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { afterEach, describe, expect, it, vi } from 'vitest'

// Executes exact installed SDK functions with isolated, synthetic collaborators.
// No real issuer, browser storage, network, credentials or authentication data.
const sdkRoot = resolve(
  process.cwd(),
  '../node_modules/.pnpm/@tidecloak+js@0.14.20/node_modules/@tidecloak/js/dist/esm'
)
function sdkFunction(file: string, name: string, globals: Record<string, unknown> = {}) {
  const source = ts.createSourceFile(
    file,
    readFileSync(resolve(sdkRoot, file), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  )
  let declaration: ts.FunctionDeclaration | ts.FunctionExpression | undefined
  function visit(node: ts.Node) {
    if (
      (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) &&
      node.name?.text === name
    ) {
      declaration = node
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (!declaration) throw new Error('Expected pinned SDK function was not found')
  const code = declaration.getText(source).replace(/^export\s+/, '')
  return runInNewContext(`(${code})`, globals) as (...args: unknown[]) => unknown
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('F8 installed SDK contract (synthetic collaborators, not live Tide)', () => {
  const build = sdkFunction('src/utils/initOptions.js', 'buildInitOptions')

  it('keeps current application configuration outside DPoP opt-in while retaining S256', async () => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL', 'https://issuer.invalid')
    vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_REALM', 'synthetic-realm')
    vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_CLIENT_ID', 'synthetic-client')
    vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED', 'external')
    vi.stubEnv('NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI', '')
    const { getTideCloakConfig } = await import('@/lib/tidecloak/config')
    const config = getTideCloakConfig()
    const options = build({ config, setupRequestEnclave: false }) as Record<string, unknown>
    expect(config['public-client']).toBe(true)
    expect(options.pkceMethod).toBe('S256')
    expect(Object.hasOwn(options, 'useDPoP')).toBe(false)
  })

  it('forwards an explicit strict opt-in in the SDK without weakening PKCE', () => {
    // A synthetic SDK capability check, not a change to application configuration.
    const useDPoP = { mode: 'strict' }
    const options = build({
      config: { useDPoP, pkceMethod: false },
      setupRequestEnclave: false,
    }) as Record<string, unknown>
    expect(options.useDPoP).toBe(useDPoP)
    expect(options.pkceMethod).toBe('S256')
  })

  for (const enabled of [false, true]) {
    it(`token exchange ${enabled ? 'generates' : 'omits'} a proof with ${enabled ? 'a' : 'no'} provider`, async () => {
      const provider = {
        getAuthServerNonce: vi.fn().mockResolvedValue(undefined),
        generateDPoPProof: vi.fn().mockResolvedValue('SYNTHETIC_PROOF'),
      }
      let checked = false
      const exchange = sdkFunction('lib/tidecloak.js', '_TideCloak_fetchAccessToken', {
        URLSearchParams,
        __classPrivateFieldGet: () => (enabled ? provider : null),
        _TideCloak_dpopProvider: null,
        fetchJSON: async (
          _url: string,
          options: { headers: Record<string, string>; body: URLSearchParams }
        ) => {
          expect(Object.hasOwn(options.headers, 'DPoP')).toBe(enabled)
          expect(options.body.get('code_verifier')).toBe('SYNTHETIC_VERIFIER')
          checked = true
          return { syntheticSuccess: true }
        },
      })
      await expect(
        exchange(
          'https://issuer.invalid/token',
          'SYNTHETIC_CODE',
          'synthetic-client',
          'https://app.invalid',
          'SYNTHETIC_VERIFIER'
        )
      ).resolves.toEqual({ syntheticSuccess: true })
      expect(checked).toBe(true)
      expect(provider.generateDPoPProof).toHaveBeenCalledTimes(enabled ? 1 : 0)
    })
  }

  it('propagates an exchange rejection without fabricating success or automatic retry when no provider exists', async () => {
    const rejection = new Error('SYNTHETIC_REJECTION')
    const fetchJSON = vi.fn().mockRejectedValue(rejection)
    const exchange = sdkFunction('lib/tidecloak.js', '_TideCloak_fetchAccessToken', {
      URLSearchParams,
      __classPrivateFieldGet: () => null,
      _TideCloak_dpopProvider: null,
      fetchJSON,
    })
    await expect(
      exchange(
        'https://issuer.invalid/token',
        'SYNTHETIC_CODE',
        'synthetic-client',
        'https://app.invalid',
        'SYNTHETIC_VERIFIER'
      )
    ).rejects.toBe(rejection)
    expect(fetchJSON).toHaveBeenCalledOnce()
  })
})
