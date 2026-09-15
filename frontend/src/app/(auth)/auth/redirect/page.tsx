'use client'

import { useEffect } from 'react'
import { useAuthCallback } from '@tidecloak/nextjs'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'

/**
 * TideCloak post-authentication redirect handler.
 *
 * TideCloak redirects the browser back here (`/auth/redirect`) with an
 * authorization `code`. `useAuthCallback` completes the PKCE token exchange,
 * then we send the user on to their original destination.
 *
 * The client's `Valid redirect URIs` in TideCloak must include this path
 * (e.g. `http://localhost:3000/auth/redirect`). `useAuthCallback` guards all
 * `window` access, so it is safe to render during prerender.
 */
export default function AuthRedirectPage() {
  const { error } = useAuthCallback({
    onSuccess: (returnUrl) => {
      window.location.assign(returnUrl || '/dashboard')
    },
    onError: () => {
      window.location.assign('/auth/signin')
    },
    onMissingVerifierRedirectTo: '/auth/signin',
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('code') && !params.has('error')) {
      window.location.assign('/auth/signin')
    }
  }, [])

  if (error) {
    return (
      <p className="text-center text-sm text-red-500" role="alert">
        Authentication failed: {error.message}
      </p>
    )
  }

  // Processing, or done and about to hand off via window.location.assign().
  return <FullPageSpinner />
}
