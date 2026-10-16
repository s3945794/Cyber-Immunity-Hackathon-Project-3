'use client'
import type { AccessRequest } from '@/types/access'

export interface TokenSource {
  getToken: () => Promise<string | null>
}
export class AccessApiError extends Error {
  constructor(readonly status: number) {
    super(
      status === 401
        ? 'Your session has ended. Sign in again.'
        : status === 403
          ? 'You do not have permission for this operation.'
          : status === 404
            ? 'This request or incident was not found.'
            : status === 409
              ? 'The request changed or an open request already exists. Refresh My Requests before retrying.'
              : status === 400
                ? 'Check the request details and acknowledgement.'
                : status === 503
                  ? 'The service is unavailable. Evidence remains locked. Please retry later.'
                  : 'Could not reach the service. Please retry; your entered reason is retained.'
    )
    this.name = 'AccessApiError'
  }
}

/** JSON responses contain safe metadata only. Tokens live only in request headers. */
export async function accessApi<T>(
  auth: TokenSource,
  path: string,
  body?: unknown,
  operationId?: string
): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const token = await auth.getToken()
    if (!token) throw new AccessApiError(401)
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001') + '/api' + path,
      {
        method: body === undefined ? 'GET' : 'POST',
        cache: 'no-store',
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          Authorization: 'Bearer ' + token,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(operationId ? { 'Idempotency-Key': operationId } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }
    )
    if (!response.ok) throw new AccessApiError(response.status)
    return (await response.json()) as T
  } catch (err) {
    if (err instanceof AccessApiError) throw err
    throw new AccessApiError(0)
  } finally {
    clearTimeout(timeout)
  }
}

export async function submitAccessRequest(auth: TokenSource, body: unknown, operationId: string) {
  const response = await accessApi<{ request: AccessRequest }>(auth, '/requests', body, operationId)
  return response.request
}
