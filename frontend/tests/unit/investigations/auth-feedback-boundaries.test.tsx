import { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { useAuthCallback } from '@tidecloak/nextjs'
import { AuthProvider } from '@/providers/AuthProvider'
import { useAuth } from '@/hooks/useAuth'
import { SignInPanel } from '@/components/auth/SignInPanel'
import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { SIGN_IN_FAILURE_MESSAGE, SIGN_IN_FAILURE_URL } from '@/lib/tidecloak/signin-feedback'

// Application gap characterizations converted to approved regression assertions.
// Installed SDK method characterizations below remain unchanged.
const sdk = vi.hoisted(() => ({
  authenticated: false,
  isInitializing: false,
  initError: null as Error | null,
  idToken: null,
  token: null,
  login: vi.fn(),
  logout: vi.fn(),
  getToken: vi.fn(),
  getValueFromIdToken: vi.fn(),
  getValueFromToken: vi.fn(),
  hasRealmRole: vi.fn(),
  hasClientRole: vi.fn(),
}))
const navigation = vi.hoisted(() => ({ replace: vi.fn() }))
vi.mock('@tidecloak/nextjs', () => ({
  TideCloakProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTideCloak: () => sdk,
  useAuthCallback: vi.fn(),
}))
vi.mock('@/lib/tidecloak/config', () => ({
  getTideCloakConfig: () => ({}),
  isTideCloakConfigured: () => true,
}))
vi.mock('next/navigation', () => ({
  useRouter: () => navigation,
  useSearchParams: () => new URLSearchParams(),
}))

const sentinel = 'SYNTHETIC_INVESTIGATION_SECRET'
const originalWindow = window
let query = ''
const assign = vi.fn()
let bridgeValue: ReturnType<typeof useAuth>
function BridgeProbe() {
  bridgeValue = useAuth()
  return null
}

beforeEach(() => {
  vi.clearAllMocks()
  sdk.authenticated = false
  sdk.isInitializing = false
  sdk.initError = null
  sdk.login.mockReset()
  query = ''
  vi.stubGlobal(
    'window',
    new Proxy(originalWindow, {
      get(target, key) {
        if (key === 'location') return { search: query, origin: 'http://localhost', assign }
        return Reflect.get(target, key, target)
      },
    })
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('approved application feedback correction', () => {
  it('presents a settled SDK init failure through a boolean without exposing the raw error', () => {
    sdk.initError = new Error(sentinel)
    const storage = vi.spyOn(Storage.prototype, 'setItem')
    const { container } = render(
      <AuthProvider>
        <BridgeProbe />
        <SignInPanel />
      </AuthProvider>
    )
    expect(bridgeValue.authenticated).toBe(false)
    expect(bridgeValue.loading).toBe(false)
    expect(bridgeValue.user).toBeNull()
    expect(Object.hasOwn(bridgeValue, 'initError')).toBe(false)
    expect(bridgeValue.initializationFailed).toBe(true)
    expect(Object.values(bridgeValue)).not.toContain(sdk.initError)
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('alert')).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
    expect(screen.getByRole('alert')).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Continue with TideCloak' })).toBeEnabled()
    expect(container.innerHTML).not.toContain(sentinel)
    expect(storage).not.toHaveBeenCalled()
    expect(sdk.login).not.toHaveBeenCalled()
  })

  it('keeps ordinary SDK-ready unauthenticated state distinct from an initialization failure', () => {
    render(
      <AuthProvider>
        <BridgeProbe />
        <SignInPanel />
      </AuthProvider>
    )
    expect(bridgeValue.authenticated).toBe(false)
    expect(bridgeValue.loading).toBe(false)
    expect(bridgeValue.initializationFailed).toBe(false)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(sdk.login).not.toHaveBeenCalled()
    expect(navigation.replace).not.toHaveBeenCalled()
  })

  for (const outcome of ['processing', 'error', 'success'] as const) {
    it(`does not divert a recognized callback after SDK query cleanup during ${outcome}`, () => {
      query = '?code=synthetic&state=synthetic'
      vi.mocked(useAuthCallback).mockImplementation(() => {
        // Model the SDK consuming the URL before the application's later effect.
        useEffect(() => {
          query = ''
        }, [])
        return {
          isCallback: true,
          isProcessing: outcome === 'processing',
          isSuccess: outcome === 'success',
          error: outcome === 'error' ? new Error(sentinel) : null,
          returnUrl: null,
          code: null,
          idpError: null,
          idpErrorDescription: null,
          processCallback: vi.fn(),
        }
      })
      const { container } = render(<AuthRedirect />)
      expect(assign).not.toHaveBeenCalled()
      expect(container.innerHTML).not.toContain(sentinel)
    })
  }

  it('keeps a fixed failure redirect from being overwritten by plain recovery after cleanup', () => {
    query = '?code=synthetic&state=synthetic'
    vi.mocked(useAuthCallback).mockImplementation((options) => {
      useEffect(() => {
        query = ''
        options?.onError?.(new Error(sentinel))
      }, [options])
      return {
        isCallback: true,
        isProcessing: false,
        isSuccess: false,
        error: new Error(sentinel),
        returnUrl: null,
        code: null,
        idpError: null,
        idpErrorDescription: null,
        processCallback: vi.fn(),
      }
    })
    render(<AuthRedirect />)
    expect(assign.mock.calls).toEqual([[SIGN_IN_FAILURE_URL]])
    // Controlled effect ordering is not a diagnosis of the owner's browser run.
  })

  it('updates the boolean after readiness and clears the notice when SDK initialization recovers', () => {
    const children = (
      <>
        <BridgeProbe />
        <SignInPanel />
      </>
    )
    const view = render(<AuthProvider>{children}</AuthProvider>)
    expect(bridgeValue.initializationFailed).toBe(false)
    sdk.initError = new Error(sentinel)
    view.rerender(<AuthProvider>{children}</AuthProvider>)
    expect(bridgeValue.initializationFailed).toBe(true)
    expect(screen.getByRole('alert')).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
    sdk.initError = null
    view.rerender(<AuthProvider>{children}</AuthProvider>)
    expect(bridgeValue.initializationFailed).toBe(false)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(sdk.login).not.toHaveBeenCalled()
  })

  it('does not inspect SDK error properties, log them or persist them while deriving the boolean', () => {
    const read = vi.fn(() => {
      throw new Error('must not read the SDK error')
    })
    sdk.initError = Object.create(null, {
      message: { get: read },
      toString: { get: read },
    }) as Error
    const logs = ['error', 'warn', 'info', 'log', 'debug'] as const
    const spies = logs.map((method) => vi.spyOn(console, method).mockImplementation(() => {}))
    const storage = vi.spyOn(Storage.prototype, 'setItem')
    render(
      <AuthProvider>
        <BridgeProbe />
        <SignInPanel />
      </AuthProvider>
    )
    expect(bridgeValue.initializationFailed).toBe(true)
    expect(screen.getByRole('alert')).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
    expect(read).not.toHaveBeenCalled()
    for (const spy of spies) expect(spy).not.toHaveBeenCalled()
    expect(storage).not.toHaveBeenCalled()
  })

  it('requires explicit keyboard retry after init failure and guards both controls while pending', async () => {
    sdk.initError = new Error(sentinel)
    sdk.login.mockReturnValue(new Promise<void>(() => {}))
    render(
      <AuthProvider>
        <SignInPanel />
      </AuthProvider>
    )
    const user = userEvent.setup()
    expect(screen.getByRole('alert')).toHaveFocus()
    expect(sdk.login).not.toHaveBeenCalled()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Continue with TideCloak' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(sdk.login).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
  })

  it('keeps an authenticated SDK session and dashboard navigation authoritative despite a stale init error', () => {
    sdk.authenticated = true
    sdk.initError = new Error(sentinel)
    render(
      <AuthProvider>
        <SignInPanel />
      </AuthProvider>
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(navigation.replace).toHaveBeenCalledWith('/dashboard')
    expect(sdk.login).not.toHaveBeenCalled()
  })

  for (const outcome of ['processing', 'error', 'success', 'direct'] as const) {
    it(`gates direct-visit recovery on SDK ${outcome} state without reading the live query`, () => {
      vi.mocked(useAuthCallback).mockReturnValue({
        isCallback: false,
        isProcessing: outcome === 'processing',
        isSuccess: outcome === 'success',
        error: outcome === 'error' ? new Error(sentinel) : null,
        returnUrl: null,
        code: null,
        idpError: null,
        idpErrorDescription: null,
        processCallback: vi.fn(),
      })
      render(<AuthRedirect />)
      if (outcome === 'direct') expect(assign).toHaveBeenCalledExactlyOnceWith('/auth/signin')
      else expect(assign).not.toHaveBeenCalled()
    })
  }
})

// Execute exact, unchanged method text from the installed public SDK in an
// isolated VM. Private collaborators, network/client initialization and DOM are
// doubles. No SDK file is patched; this is not complete SDK/OIDC validation.
const localRequire = createRequire(import.meta.url)
const reactEntry = createRequire(localRequire.resolve('@tidecloak/nextjs')).resolve(
  '@tidecloak/react'
)
const jsEntry = createRequire(reactEntry).resolve('@tidecloak/js')
const sdkRoot = resolve(dirname(jsEntry), '../../..')
type InstalledMethod = (this: Record<string, unknown>, ...args: unknown[]) => Promise<unknown>
function installedMethod(
  file: string,
  name: string,
  scope: Record<string, unknown>
): InstalledMethod {
  const source = readFileSync(file, 'utf8')
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  let found: ts.FunctionDeclaration | ts.FunctionExpression | ts.MethodDeclaration | undefined
  function visit(node: ts.Node) {
    if (
      (ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isMethodDeclaration(node)) &&
      node.name &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    )
      found = node
    ts.forEachChild(node, visit)
  }
  visit(ast)
  if (!found) throw new Error('Installed SDK method was not found')
  const method = found as ts.FunctionDeclaration | ts.FunctionExpression | ts.MethodDeclaration
  const exactText = method.getText(ast)
  const expression = ts.isMethodDeclaration(method) ? `({${exactText}}).${name}` : `(${exactText})`
  return runInNewContext(expression, scope, {
    filename: 'installed-sdk-characterization.js',
  }) as InstalledMethod
}

it('executes installed SDK initialization failure: initError then ready(false), with no token persistence', async () => {
  const emit = vi.fn()
  const storeToken = vi.fn()
  const rejected = new Error(sentinel)
  const client = {
    _tc: { init: vi.fn().mockRejectedValue(rejected) },
    _config: {},
    _emit: emit,
    _setTokenCookie: storeToken,
  }
  const method = installedMethod(join(sdkRoot, 'dist/esm/src/IAMService.js'), '_initFrontchannel', {
    window: { location: { origin: 'http://localhost' } },
    document: { querySelector: () => null },
    resolveSilentCheckSsoRedirectUri: () => ({
      uri: 'http://localhost/silent-check-sso.html',
      source: 'config',
    }),
    buildInitOptions: () => ({ onLoad: 'check-sso' }),
    console: { error: vi.fn(), debug: vi.fn() },
  })
  await expect(method.call(client, {})).resolves.toBe(false)
  expect(emit.mock.calls).toEqual([
    ['initError', rejected],
    ['ready', false],
  ])
  expect(storeToken).not.toHaveBeenCalled()
})

function silentHarness(failExchange: boolean) {
  const callbacks = new Map<string, (event: unknown) => Promise<void>>()
  const frameEvents = new Map<string, () => void>()
  const body: { appendChild: () => void; removeChild: () => void } = {
    appendChild: vi.fn(() => {
      frame.parentNode = body
    }),
    removeChild: vi.fn(() => {
      frame.parentNode = null
    }),
  }
  const frame = {
    contentWindow: {},
    parentNode: null as typeof body | null,
    style: {},
    setAttribute: vi.fn(),
    addEventListener: (name: string, callback: () => void) => frameEvents.set(name, callback),
    removeEventListener: vi.fn(),
  }
  const client = {
    authenticated: false,
    silentCheckSsoTimeout: 10000,
    silentCheckSsoRedirectUri: 'http://localhost/silent-check-sso.html',
    createLoginUrl: vi.fn().mockResolvedValue('about:blank'),
  }
  const warn = vi.fn()
  const info = vi.fn()
  const exchange = failExchange
    ? vi.fn().mockRejectedValue(new Error(sentinel))
    : vi.fn().mockResolvedValue(undefined)
  const scope = {
    document: { createElement: () => frame, body },
    window: {
      location: { origin: 'http://localhost' },
      addEventListener: (name: string, callback: (event: unknown) => Promise<void>) =>
        callbacks.set(name, callback),
      removeEventListener: vi.fn(),
    },
    setTimeout: vi.fn(() => 1),
    clearTimeout: vi.fn(),
    _TideCloak_instances: Symbol('instances'),
    _TideCloak_logWarn: warn,
    _TideCloak_logInfo: info,
    _TideCloak_parseCallback: () => ({}),
    _TideCloak_processCallback: exchange,
    __classPrivateFieldGet: (_receiver: unknown, field: unknown, kind: string, method?: unknown) =>
      kind === 'm' ? method : field,
  }
  const method = installedMethod(
    join(sdkRoot, 'dist/esm/lib/tidecloak.js'),
    '_TideCloak_checkSsoSilently',
    scope
  )
  return { method, client, callbacks, frameEvents, frame, body, exchange }
}

it('executes installed silent-SSO exchange failure: resolves unauthenticated rather than rejecting', async () => {
  const h = silentHarness(true)
  const done = h.method.call(h.client)
  await Promise.resolve()
  await h.callbacks.get('message')!({
    origin: 'http://localhost',
    source: h.frame.contentWindow,
    data: 'synthetic',
  })
  await expect(done).resolves.toBeUndefined()
  expect(h.exchange).toHaveBeenCalledOnce()
  expect(h.client.authenticated).toBe(false)
  expect(h.body.removeChild).toHaveBeenCalledOnce()
})

it('retains installed silent-SSO message origin/source guards before processing', async () => {
  const h = silentHarness(true)
  const done = h.method.call(h.client)
  await Promise.resolve()
  await h.callbacks.get('message')!({
    origin: 'https://untrusted.invalid',
    source: h.frame.contentWindow,
  })
  await h.callbacks.get('message')!({ origin: 'http://localhost', source: {} })
  expect(h.exchange).not.toHaveBeenCalled()
  await h.callbacks.get('message')!({
    origin: 'http://localhost',
    source: h.frame.contentWindow,
    data: 'synthetic',
  })
  await expect(done).resolves.toBeUndefined()
})

it('executes a silent iframe error without inventing an application callback failure', async () => {
  const h = silentHarness(false)
  const done = h.method.call(h.client)
  await Promise.resolve()
  h.frameEvents.get('error')!()
  await expect(done).resolves.toBeUndefined()
  expect(h.exchange).not.toHaveBeenCalled()
  expect(h.client.authenticated).toBe(false)
})
