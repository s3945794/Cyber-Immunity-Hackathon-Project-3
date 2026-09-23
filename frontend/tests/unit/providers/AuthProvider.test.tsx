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
  hasRealmRole: vi.fn<(role: string) => boolean>(),
  hasClientRole: vi.fn<(role: string, resource?: string) => boolean>(),
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
      <span data-testid="roles">{user ? JSON.stringify(user.roles) : 'none'}</span>
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
    mockTc.hasRealmRole.mockReturnValue(false)
    mockTc.hasClientRole.mockReturnValue(false)
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

  describe('SOC role extraction', () => {
    beforeEach(() => {
      mockTc.authenticated = true
      mockTc.isInitializing = false
    })

    it('has no roles when the user has none of the four recognised SOC roles', () => {
      renderWithProvider()
      expect(screen.getByTestId('roles')).toHaveTextContent('[]')
    })

    it('ignores unrecognised token roles entirely', () => {
      // Simulates a token carrying an internal Tide/TideCloak role, or any
      // role outside the four SOC roles — hasRealmRole/hasClientRole return
      // false for all of them from this component's point of view, since
      // only SOC_ROLES are ever checked.
      mockTc.hasRealmRole.mockImplementation((role) => role === 'tide-internal-role')
      renderWithProvider()
      expect(screen.getByTestId('roles')).toHaveTextContent('[]')
    })

    it.each(['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager'] as const)(
      'recognises the %s realm role',
      (role) => {
        mockTc.hasRealmRole.mockImplementation((r) => r === role)
        renderWithProvider()
        expect(screen.getByTestId('roles')).toHaveTextContent(JSON.stringify([role]))
      }
    )

    it('recognises a role granted via hasClientRole as well as hasRealmRole', () => {
      mockTc.hasClientRole.mockImplementation((role) => role === 'soc-manager')
      renderWithProvider()
      expect(screen.getByTestId('roles')).toHaveTextContent(JSON.stringify(['soc-manager']))
    })

    it('combines multiple recognised roles from realm and client roles without duplicates', () => {
      mockTc.hasRealmRole.mockImplementation((role) => role === 'soc-analyst')
      mockTc.hasClientRole.mockImplementation(
        (role) => role === 'soc-analyst' || role === 'soc-supervisor'
      )
      renderWithProvider()
      expect(screen.getByTestId('roles')).toHaveTextContent(
        JSON.stringify(['soc-analyst', 'soc-supervisor'])
      )
    })

    it('has no roles while unauthenticated even if the SDK role checks would return true', () => {
      mockTc.authenticated = false
      mockTc.hasRealmRole.mockReturnValue(true)
      renderWithProvider()
      expect(screen.getByTestId('roles')).toHaveTextContent('none')
    })
  })
})
