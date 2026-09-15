import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthContextValue } from '@/types/auth'

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))

import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/layout/Navbar'

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

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a sign-in button when unauthenticated and calls login()', async () => {
    mockAuth({ authenticated: false })
    render(<Navbar />)

    const button = screen.getByRole('button', { name: /sign in/i })
    await userEvent.click(button)

    expect(login).toHaveBeenCalledOnce()
    expect(logout).not.toHaveBeenCalled()
    expect(screen.queryByLabelText(/sign out/i)).not.toBeInTheDocument()
  })

  it('shows the user and a sign-out control when authenticated and calls logout()', async () => {
    mockAuth({
      authenticated: true,
      user: { uid: 'u1', username: 'alice', email: 'alice@example.com' },
    })
    render(<Navbar />)

    expect(screen.getByText('alice')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/sign out/i))

    expect(logout).toHaveBeenCalledOnce()
    expect(login).not.toHaveBeenCalled()
  })

  it('falls back to the email when there is no username', () => {
    mockAuth({
      authenticated: true,
      user: { uid: 'u1', username: null, email: 'bob@example.com' },
    })
    render(<Navbar />)

    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })
})
