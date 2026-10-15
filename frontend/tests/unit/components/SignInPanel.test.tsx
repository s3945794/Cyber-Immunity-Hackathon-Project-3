import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthContextValue } from '@/types/auth'
import { SignInPanel } from '@/components/auth/SignInPanel'
import { SIGN_IN_FAILURE_MESSAGE } from '@/lib/tidecloak/signin-feedback'
import { useAuth } from '@/hooks/useAuth'
import { isTideCloakConfigured } from '@/lib/tidecloak/config'

const navigation = vi.hoisted(() => ({ replace: vi.fn(), search: '' }))
vi.mock('next/navigation', () => ({
  useRouter: () => navigation,
  useSearchParams: () => new URLSearchParams(navigation.search),
}))
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('@/lib/tidecloak/config', () => ({ isTideCloakConfigured: vi.fn() }))
const login = vi.fn()
const secret = 'SYNTHETIC_AUTH_SECRET_NEVER_DISCLOSE'

function mockAuth(extra: Partial<AuthContextValue> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    authenticated: false,
    loading: false,
    login,
    logout: vi.fn(),
    getToken: vi.fn(),
    ...extra,
  })
}
const primary = () => screen.getByRole('button', { name: 'Continue with TideCloak' })
const secondary = () => screen.getByRole('button', { name: 'Continue' })

beforeEach(() => {
  vi.clearAllMocks()
  login.mockReset()
  navigation.search = ''
  vi.mocked(isTideCloakConfigured).mockReturnValue(true)
  mockAuth()
})
afterEach(() => vi.restoreAllMocks())

describe('safe sign-in feedback', () => {
  it('announces only the fixed message, focuses once and supports keyboard retry', async () => {
    navigation.search = '?signin=failed'
    login.mockReturnValue(new Promise<void>(() => {}))
    const user = userEvent.setup()
    const view = render(<SignInPanel />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
    expect(alert).toHaveFocus()
    expect(primary()).toHaveAccessibleDescription(SIGN_IN_FAILURE_MESSAGE)
    expect(login).not.toHaveBeenCalled()
    await user.tab()
    expect(primary()).toHaveFocus()
    view.rerender(<SignInPanel />)
    expect(primary()).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(login).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(primary()).toBeDisabled()
    expect(secondary()).toBeDisabled()
  })

  for (const search of [
    '',
    '?signin=other',
    '?signin=FAILED',
    '?signin=failed&signin=other',
    `?signin=${secret}&error_description=${secret}`,
  ]) {
    it(`ignores absent, unknown or ambiguous presentation markers: ${search ? 'nonempty' : 'empty'}`, () => {
      navigation.search = search
      const { container } = render(<SignInPanel />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(container.innerHTML).not.toContain(secret)
      expect(login).not.toHaveBeenCalled()
    })
  }

  for (const button of ['primary', 'secondary'] as const) {
    for (const mode of ['throw', 'reject'] as const) {
      it(`handles ${mode} from ${button}, without reading or disclosing the failure`, async () => {
        const read = vi.fn(() => {
          throw new Error('must not inspect rejection')
        })
        const failure = Object.create(null, { message: { get: read }, toString: { get: read } })
        const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
        const warnLog = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const infoLog = vi.spyOn(console, 'info').mockImplementation(() => {})
        const log = vi.spyOn(console, 'log').mockImplementation(() => {})
        const storage = vi.spyOn(Storage.prototype, 'setItem')
        login.mockImplementation(() => {
          if (mode === 'throw') throw failure
          return Promise.reject(failure)
        })
        const { container } = render(<SignInPanel />)
        await userEvent.click(button === 'primary' ? primary() : secondary())
        expect(await screen.findByRole('alert')).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
        expect(screen.getByRole('alert')).toHaveFocus()
        expect(read).not.toHaveBeenCalled()
        expect(container.innerHTML).not.toContain(secret)
        expect(errorLog).not.toHaveBeenCalled()
        expect(warnLog).not.toHaveBeenCalled()
        expect(infoLog).not.toHaveBeenCalled()
        expect(log).not.toHaveBeenCalled()
        expect(storage).not.toHaveBeenCalled()
        expect(navigation.replace).not.toHaveBeenCalled()
        expect(primary()).toBeEnabled()
        expect(login).toHaveBeenCalledOnce()
      })
    }
  }

  it('never discloses synthetic secrets in actual Error rejections or arbitrary query fields', async () => {
    navigation.search = `?signin=failed&code=${secret}&error_description=${secret}`
    login.mockRejectedValue(new Error(secret))
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    const storage = vi.spyOn(Storage.prototype, 'setItem')
    const { container } = render(<SignInPanel />)
    await userEvent.click(primary())
    expect(await screen.findByRole('alert')).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
    expect(container.innerHTML).not.toContain(secret)
    expect(errorLog).not.toHaveBeenCalled()
    expect(storage).not.toHaveBeenCalled()
  })

  it('requires an explicit retry, clears feedback, and guards both buttons until navigation', async () => {
    let rejectAttempt!: (reason: unknown) => void
    login
      .mockReturnValueOnce(
        new Promise<void>((_, reject) => {
          rejectAttempt = reject
        })
      )
      .mockResolvedValueOnce(undefined)
    render(<SignInPanel />)
    fireEvent.click(primary())
    fireEvent.click(primary())
    fireEvent.click(secondary())
    expect(login).toHaveBeenCalledOnce()
    await act(async () => {
      rejectAttempt(new Error(secret))
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(login).toHaveBeenCalledOnce()
    await userEvent.click(secondary())
    expect(login).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(primary()).toBeDisabled()
    expect(primary()).toHaveAttribute('aria-busy', 'true')
    fireEvent.click(primary())
    expect(login).toHaveBeenCalledTimes(2)
    expect(navigation.replace).not.toHaveBeenCalled()
  })

  it('retains disabled configuration handling and never creates two alerts', () => {
    vi.mocked(isTideCloakConfigured).mockReturnValue(false)
    navigation.search = '?signin=failed'
    render(<SignInPanel />)
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(primary()).toBeDisabled()
    expect(secondary()).toBeDisabled()
    fireEvent.click(primary())
    expect(login).not.toHaveBeenCalled()
  })

  it('keeps loading fail-closed and preserves the authenticated dashboard redirect', async () => {
    mockAuth({ loading: true })
    const view = render(<SignInPanel />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(navigation.replace).not.toHaveBeenCalled()
    expect(login).not.toHaveBeenCalled()
    mockAuth({ authenticated: true })
    view.rerender(<SignInPanel />)
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/dashboard'))
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })
})
