import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccessData } from '@/features/access-requests/hooks/useAccessData'
import { useAuth } from '@/hooks/useAuth'
import { accessApi } from '@/lib/api/access'
import type { AuthContextValue } from '@/types/auth'
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('@/lib/api/access', () => ({ accessApi: vi.fn(), AccessApiError: class extends Error {} }))
const getToken = vi.fn()
function auth(uid = 'a', authenticated = true): AuthContextValue {
  return {
    user: authenticated ? { uid, username: null, email: null, roles: ['soc-analyst'] } : null,
    authenticated,
    loading: false,
    getToken,
    login: vi.fn(),
    logout: vi.fn(),
  }
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(useAuth).mockReturnValue(auth())
})
describe('safe request metadata state — no Tide decryption', () => {
  it('ignores a late response from the previous incident context', async () => {
    let oldResolve: (value: unknown) => void = () => {}
    vi.mocked(accessApi)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            oldResolve = resolve
          })
      )
      .mockResolvedValueOnce({ id: 'new' })
    const { result, rerender } = renderHook(({ path }) => useAccessData<{ id: string }>(path), {
      initialProps: { path: '/old' },
    })
    rerender({ path: '/new' })
    await waitFor(() => expect(result.current.data?.id).toBe('new'))
    await act(async () => oldResolve({ id: 'old' }))
    expect(result.current.data?.id).toBe('new')
  })
  it('clears data immediately on logout and cannot restore it with a pending response', async () => {
    let resolveLate: (value: unknown) => void = () => {}
    vi.mocked(accessApi)
      .mockResolvedValueOnce({ id: 'current' })
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveLate = resolve
          })
      )
    const { result, rerender } = renderHook(() => useAccessData<{ id: string }>('/requests'))
    await waitFor(() => expect(result.current.data?.id).toBe('current'))
    act(() => result.current.refresh())
    expect(result.current.data).toBeNull()
    vi.mocked(useAuth).mockReturnValue(auth('a', false))
    rerender()
    await act(async () => resolveLate({ id: 'late' }))
    expect(result.current.data).toBeNull()
  })
  it('never presents another user’s stale metadata while a new session loads', async () => {
    vi.mocked(accessApi).mockResolvedValueOnce({ id: 'a' }).mockResolvedValueOnce({ id: 'b' })
    const { result, rerender } = renderHook(() => useAccessData<{ id: string }>('/requests'))
    await waitFor(() => expect(result.current.data?.id).toBe('a'))
    vi.mocked(useAuth).mockReturnValue(auth('b'))
    rerender()
    expect(result.current.data).toBeNull()
    await waitFor(() => expect(result.current.data?.id).toBe('b'))
  })
  it('rechecks after reconnection and visibility changes', async () => {
    vi.mocked(accessApi).mockResolvedValue({ id: 'fresh' })
    const { result } = renderHook(() => useAccessData<{ id: string }>('/requests'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => window.dispatchEvent(new Event('online')))
    await waitFor(() => expect(accessApi).toHaveBeenCalledTimes(2))
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    await waitFor(() => expect(accessApi).toHaveBeenCalledTimes(3))
  })
  it('fails closed on errors', async () => {
    vi.mocked(accessApi).mockRejectedValue(new Error('private provider internals'))
    const { result, unmount } = renderHook(() => useAccessData('/requests'))
    await waitFor(() => expect(result.current.error).toBe('Could not load history. Please retry.'))
    expect(result.current.data).toBeNull()
    unmount()
  })
})

describe('effect cancellation lifetime', () => {
  it('ignores the discarded Strict Mode effect response for the same context', async () => {
    let resolveDiscarded: (value: unknown) => void = () => {}
    vi.mocked(accessApi)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveDiscarded = resolve
          })
      )
      .mockResolvedValueOnce({ id: 'current' })
    const { result } = renderHook(() => useAccessData<{ id: string }>('/requests'), {
      reactStrictMode: true,
    })
    await waitFor(() => expect(result.current.data?.id).toBe('current'))
    expect(accessApi).toHaveBeenCalledTimes(2)
    await act(async () => resolveDiscarded({ id: 'discarded' }))
    expect(result.current.data?.id).toBe('current')
  })

  it('ignores a stale failure after a refresh succeeds', async () => {
    let rejectOld: (error: Error) => void = () => {}
    vi.mocked(accessApi)
      .mockImplementationOnce(
        () =>
          new Promise((_resolve, reject) => {
            rejectOld = reject
          })
      )
      .mockResolvedValueOnce({ id: 'fresh' })
    const { result } = renderHook(() => useAccessData<{ id: string }>('/requests'))
    act(() => result.current.refresh())
    await waitFor(() => expect(result.current.data?.id).toBe('fresh'))
    await act(async () => rejectOld(new Error('stale failure')))
    expect(result.current.data?.id).toBe('fresh')
    expect(result.current.error).toBeNull()
  })

  it('discards a pending response after unmount before another instance loads', async () => {
    let resolveUnmounted: (value: unknown) => void = () => {}
    vi.mocked(accessApi)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveUnmounted = resolve
          })
      )
      .mockResolvedValueOnce({ id: 'replacement' })
    const old = renderHook(() => useAccessData<{ id: string }>('/requests'))
    old.unmount()
    const { result } = renderHook(() => useAccessData<{ id: string }>('/requests'))
    await waitFor(() => expect(result.current.data?.id).toBe('replacement'))
    await act(async () => resolveUnmounted({ id: 'unmounted' }))
    expect(result.current.data?.id).toBe('replacement')
  })
})
