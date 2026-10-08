import { afterEach, describe, expect, it, vi } from 'vitest'
import { accessApi, AccessApiError } from '@/lib/api/access'
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})
describe('access API metadata requests', () => {
  it('requires a session before network access', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    await expect(accessApi({ getToken: async () => null }, '/requests')).rejects.toMatchObject({
      status: 401,
    })
    expect(fetch).not.toHaveBeenCalled()
  })
  it('uses a header, no-store and identical operation ID; no token or reason in the URL', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ request: { status: 'pending' } })))
    vi.stubGlobal('fetch', fetch)
    await accessApi(
      { getToken: async () => 'synthetic-unit-value' },
      '/requests',
      { reason: 'test metadata' },
      'unit-operation'
    )
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/requests$/),
      expect.objectContaining({
        cache: 'no-store',
        credentials: 'omit',
        method: 'POST',
        headers: expect.objectContaining({
          'Idempotency-Key': 'unit-operation',
          'Content-Type': 'application/json',
        }),
      })
    )
    expect(fetch.mock.calls[0]?.[0]).not.toContain('synthetic-unit-value')
    expect(fetch.mock.calls[0]?.[0]).not.toContain('test metadata')
  })
  it.each([400, 401, 403, 404, 409, 503])(
    'handles status %s without exposing provider bodies',
    async (status) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response('provider-private-error', { status }))
      )
      try {
        await accessApi({ getToken: async () => 'synthetic-unit-value' }, '/requests')
        throw Error('unexpected success')
      } catch (error) {
        expect(error).toBeInstanceOf(AccessApiError)
        expect((error as Error).message).not.toContain('provider-private-error')
      }
    }
  )
  it('returns a safe recoverable network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('private adapter data')))
    await expect(
      accessApi({ getToken: async () => 'synthetic-unit-value' }, '/requests')
    ).rejects.toMatchObject({ status: 0 })
  })
})

it('aborts a stalled service request with a safe retryable error', async () => {
  vi.useFakeTimers()
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (_url, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () =>
            reject(new Error('private transport error'))
          )
        })
    )
  )
  const result = expect(
    accessApi({ getToken: async () => 'synthetic-unit-value' }, '/requests')
  ).rejects.toMatchObject({ status: 0 })
  await vi.advanceTimersByTimeAsync(15000)
  await result
})
