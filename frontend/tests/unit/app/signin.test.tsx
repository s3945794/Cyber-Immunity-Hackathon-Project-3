import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthContextValue } from '@/types/auth'

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('@/lib/tidecloak/config', () => ({ isTideCloakConfigured: vi.fn(() => true) }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }))

import { useAuth } from '@/hooks/useAuth'
import { isTideCloakConfigured } from '@/lib/tidecloak/config'
import SignInPage from '@/app/(auth)/auth/signin/page'

const login = vi.fn()

function mockAuth(value: Partial<AuthContextValue> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    authenticated: false,
    loading: false,
    login,
    logout: vi.fn(),
    ...value,
  })
}

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isTideCloakConfigured).mockReturnValue(true)
  })

  it('sends the user to TideCloak when the CTA is clicked', async () => {
    mockAuth()
    render(<SignInPage />)

    await userEvent.click(screen.getByRole('button', { name: /continue with tidecloak/i }))

    expect(login).toHaveBeenCalledOnce()
  })

  it('does not collect a password', () => {
    mockAuth()
    const { container } = render(<SignInPage />)
    expect(container.querySelector('input[type="password"]')).toBeNull()
  })

  it('disables the CTA and warns when TideCloak is not configured', async () => {
    vi.mocked(isTideCloakConfigured).mockReturnValue(false)
    mockAuth()
    render(<SignInPage />)

    const cta = screen.getByRole('button', { name: /continue with tidecloak/i })
    expect(cta).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent(/not configured/i)

    await userEvent.click(cta)
    expect(login).not.toHaveBeenCalled()
  })
})
