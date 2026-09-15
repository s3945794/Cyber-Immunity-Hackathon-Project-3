import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

/** Controllable stand-in for the TideCloak SDK context. */
const mockTc = {
  authenticated: false,
  isInitializing: true,
  idToken: null as string | null,
  token: null as string | null,
  login: vi.fn(),
  logout: vi.fn(),
  getValueFromIdToken: vi.fn<(key: string) => unknown>(),
  getValueFromToken: vi.fn<(key: string) => unknown>(),
}

vi.mock('@tidecloak/nextjs', () => ({
  TideCloakProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTideCloak: () => mockTc,
}))

import { AuthProvider } from '@/providers/AuthProvider'
import { useAuth } from '@/hooks/useAuth'

function Probe() {
  const { user, authenticated, loading } = useAuth()
  return (
    <div>
      <span data-testid="authenticated">{String(authenticated)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="uid">{user?.uid ?? 'none'}</span>
      <span data-testid="username">{user?.username ?? 'none'}</span>
      <span data-testid="email">{user?.email ?? 'none'}</span>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  )
}

describe('AuthProvider / useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTc.authenticated = false
    mockTc.isInitializing = true
    mockTc.idToken = null
    mockTc.token = null
    mockTc.getValueFromIdToken.mockReturnValue(undefined)
    mockTc.getValueFromToken.mockReturnValue(undefined)
  })

  it('reports loading with no user while the SDK initialises', () => {
    renderWithProvider()
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('uid')).toHaveTextContent('none')
  })

  it('maps ID-token claims onto the user once authenticated', () => {
    mockTc.authenticated = true
    mockTc.isInitializing = false
    mockTc.idToken = 'id.jwt'
    const claims: Record<string, string> = {
      sub: 'user-123',
      preferred_username: 'alice',
      email: 'alice@example.com',
    }
    mockTc.getValueFromIdToken.mockImplementation((key) => claims[key])

    renderWithProvider()

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('uid')).toHaveTextContent('user-123')
    expect(screen.getByTestId('username')).toHaveTextContent('alice')
    expect(screen.getByTestId('email')).toHaveTextContent('alice@example.com')
  })

  it('falls back to the access-token sub when the ID token lacks one', () => {
    mockTc.authenticated = true
    mockTc.isInitializing = false
    mockTc.getValueFromIdToken.mockReturnValue(undefined)
    mockTc.getValueFromToken.mockImplementation((key) =>
      key === 'sub' ? 'sub-from-access' : undefined
    )

    renderWithProvider()

    expect(screen.getByTestId('uid')).toHaveTextContent('sub-from-access')
    expect(screen.getByTestId('username')).toHaveTextContent('none')
  })

  it('throws if useAuth is used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/AuthProvider/)
    spy.mockRestore()
  })
})
