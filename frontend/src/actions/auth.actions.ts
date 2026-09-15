'use server'

import { redirect } from 'next/navigation'

/**
 * Server-side session access.
 *
 * TideCloak issues front-channel (browser-held) tokens. Verifying them on the
 * server — reading the `Authorization` header, checking the signature against
 * the realm JWKS, enforcing roles — is deliberately **deferred to
 * `feature/tidecloak-protect`** (this branch does the client-side auth flow
 * only).
 *
 * Until then this returns `null`: server code must treat every request as
 * unauthenticated and fail closed.
 */
export async function getServerSession(): Promise<null> {
  return null
}

/**
 * Guard a Server Action or Server Component.
 *
 * Fails closed by redirecting to sign-in until server-side TideCloak
 * verification lands in `feature/tidecloak-protect`. The return type describes
 * the future session shape; this implementation never actually returns
 * (`redirect()` throws).
 */
export async function requireAuth(): Promise<{ uid: string; email: string | null }> {
  redirect('/auth/signin')
}
