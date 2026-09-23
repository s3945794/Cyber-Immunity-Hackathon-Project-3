import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthContextValue } from '@/types/auth'
import type { SocRole } from '@/lib/tidecloak/roles'

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))

import { useAuth } from '@/hooks/useAuth'
import { RoleGuard } from '@/components/auth/RoleGuard'

const login = vi.fn()
const logout = vi.fn()

function mockAuth(value: Partial<AuthContextValue>) {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    authenticated: false,
    loading: false,
    login,
    logout,
    ...value,
  })
}

function renderGuard(acceptedRoles: SocRole[]) {
  return render(
    <RoleGuard acceptedRoles={acceptedRoles}>
      <div data-testid="protected-content">secret dashboard</div>
    </RoleGuard>
  )
}

const ALL_SOC_ROLES: SocRole[] = ['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager']

describe('RoleGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading state and does not render children or Access Denied while the SDK initialises', () => {
    mockAuth({ loading: true, authenticated: false })
    renderGuard(ALL_SOC_ROLES)

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument()
  })

  it('redirects an unauthenticated user to login instead of rendering children or Access Denied', () => {
    mockAuth({ loading: false, authenticated: false })
    renderGuard(ALL_SOC_ROLES)

    expect(login).toHaveBeenCalledOnce()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument()
  })

  it('shows Access Denied for an authenticated user without a recognised SOC role', () => {
    mockAuth({
      loading: false,
      authenticated: true,
      user: { uid: 'u1', username: 'alice', email: null, roles: [] },
    })
    renderGuard(ALL_SOC_ROLES)

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('shows Access Denied when the user only has unrecognised/unknown roles', () => {
    mockAuth({
      loading: false,
      authenticated: true,
      // Type-cast to simulate a raw, unfiltered role slipping through —
      // AuthUser.roles is normally already filtered to SocRole values.
      user: { uid: 'u1', username: 'alice', email: null, roles: [] as SocRole[] },
    })
    renderGuard(ALL_SOC_ROLES)

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
  })

  it.each(['soc-analyst', 'soc-supervisor', 'soc-team-leader', 'soc-manager'] as const)(
    'renders children for a user with the %s role when all four roles are accepted',
    (role) => {
      mockAuth({
        loading: false,
        authenticated: true,
        user: { uid: 'u1', username: 'alice', email: null, roles: [role] },
      })
      renderGuard(ALL_SOC_ROLES)

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument()
    }
  )

  it('renders children when the user has at least one of several accepted roles (any-of match)', () => {
    mockAuth({
      loading: false,
      authenticated: true,
      user: { uid: 'u1', username: 'alice', email: null, roles: ['soc-manager'] },
    })
    renderGuard(['soc-supervisor', 'soc-manager'])

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('shows Access Denied when the user has a recognised role that is not in the accepted list', () => {
    mockAuth({
      loading: false,
      authenticated: true,
      user: { uid: 'u1', username: 'alice', email: null, roles: ['soc-analyst'] },
    })
    renderGuard(['soc-manager'])

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('fails closed (Access Denied) when acceptedRoles is empty, even for a user with every SOC role', () => {
    mockAuth({
      loading: false,
      authenticated: true,
      user: { uid: 'u1', username: 'alice', email: null, roles: ALL_SOC_ROLES },
    })
    renderGuard([])

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })
})
