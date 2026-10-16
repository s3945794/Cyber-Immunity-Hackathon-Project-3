import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthCallback, type UseAuthCallbackOptions } from '@tidecloak/nextjs'
import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { SIGN_IN_FAILURE_MESSAGE, SIGN_IN_FAILURE_URL } from '@/lib/tidecloak/signin-feedback'

vi.mock('@tidecloak/nextjs', () => ({ useAuthCallback: vi.fn() }))
let options: UseAuthCallbackOptions
const assign = vi.fn()
const secret = 'SYNTHETIC_CALLBACK_SECRET_NEVER_DISCLOSE'
let query = ''

beforeEach(() => {
  vi.clearAllMocks()
  query = `?code=${secret}&state=${secret}`
  const original = window
  vi.stubGlobal(
    'window',
    new Proxy(original, {
      get(target, key) {
        if (key === 'location') return { search: query, assign }
        return Reflect.get(target, key, target)
      },
    })
  )
  vi.mocked(useAuthCallback).mockImplementation((input) => {
    options = input!
    return {
      isCallback: Boolean(query),
      isProcessing: Boolean(query),
      isSuccess: false,
      error: null,
      returnUrl: null,
      code: null,
      idpError: null,
      idpErrorDescription: null,
      processCallback: vi.fn(),
    }
  })
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('SDK callback feedback', () => {
  it('routes an SDK failure only to the fixed presentation marker without leaking payloads', () => {
    const logs = ['error', 'warn', 'info', 'log'] as const
    const spies = logs.map((method) => vi.spyOn(console, method).mockImplementation(() => {}))
    const storage = vi.spyOn(Storage.prototype, 'setItem')
    render(<AuthRedirect />)
    act(() => options.onError?.(new Error(secret)))
    expect(assign).toHaveBeenCalledExactlyOnceWith(SIGN_IN_FAILURE_URL)
    expect(assign.mock.calls.flat().join('')).not.toContain(secret)
    for (const spy of spies) expect(spy).not.toHaveBeenCalled()
    expect(storage).not.toHaveBeenCalled()
  })

  it('supplies the same safe destination for the SDK direct missing-verifier branch', () => {
    render(<AuthRedirect />)
    expect(options.onMissingVerifierRedirectTo).toBe(SIGN_IN_FAILURE_URL)
    // The SDK navigates using this option without invoking application onError.
    assign(options.onMissingVerifierRedirectTo)
    expect(assign).toHaveBeenCalledExactlyOnceWith('/auth/signin?signin=failed')
  })

  it('renders only a safe accessible fallback when SDK error navigation is delayed', () => {
    vi.mocked(useAuthCallback).mockReturnValue({ error: new Error(secret) } as ReturnType<
      typeof useAuthCallback
    >)
    const { container } = render(<AuthRedirect />)
    expect(screen.getByRole('alert')).toHaveTextContent(SIGN_IN_FAILURE_MESSAGE)
    expect(screen.getByRole('alert')).toHaveFocus()
    expect(container.innerHTML).not.toContain(secret)
    expect(assign).not.toHaveBeenCalled()
  })

  for (const destination of ['/incidents', null, '']) {
    it(`preserves SDK success navigation ${destination || 'dashboard fallback'}`, () => {
      render(<AuthRedirect />)
      act(() => options.onSuccess?.(destination))
      expect(assign).toHaveBeenCalledExactlyOnceWith(destination || '/dashboard')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  }

  it('retains direct callback recovery without starting login or automatic retry', () => {
    query = ''
    const view = render(<AuthRedirect />)
    expect(assign).toHaveBeenCalledExactlyOnceWith('/auth/signin')
    view.rerender(<AuthRedirect />)
    expect(assign).toHaveBeenCalledOnce()
  })

  it('does not forward provider error descriptions or retry while the SDK is processing', () => {
    query = `?error=access_denied&error_description=${secret}`
    const { container } = render(<AuthRedirect />)
    expect(assign).not.toHaveBeenCalled()
    expect(container.innerHTML).not.toContain(secret)
    act(() => options.onError?.(new Error(secret)))
    expect(assign).toHaveBeenCalledExactlyOnceWith(SIGN_IN_FAILURE_URL)
  })
})
