'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { isTideCloakConfigured } from '@/lib/tidecloak/config'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'
import { SignInFailureAlert } from '@/components/auth/SignInFailureAlert'

export function SignInPanel() {
  const router = useRouter()
  const params = useSearchParams()
  const { authenticated, loading, login, initializationFailed = false } = useAuth()
  const configured = isTideCloakConfigured()
  const [localFailure, setLocalFailure] = useState(false)
  const [markerDismissed, setMarkerDismissed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)
  const markers = params.getAll('signin')
  const failed =
    localFailure ||
    (!markerDismissed && markers.length === 1 && markers[0] === 'failed') ||
    (!submitting && initializationFailed)

  useEffect(() => {
    if (!loading && authenticated) router.replace('/dashboard')
  }, [loading, authenticated, router])

  async function signIn() {
    if (!configured || loading || authenticated || inFlight.current) return
    inFlight.current = true
    setSubmitting(true)
    setMarkerDismissed(true)
    setLocalFailure(false)
    try {
      await login()
      // Resolution requests navigation; it does not establish authentication.
      // Keep both controls guarded until navigation or SDK state changes.
    } catch {
      // Never inspect, stringify, log or store the rejected value.
      inFlight.current = false
      setSubmitting(false)
      setLocalFailure(true)
    }
  }

  if (loading || authenticated) return <FullPageSpinner />
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="text-sm text-zinc-500">
          You&apos;ll be redirected to TideCloak to authenticate.
        </p>
      </div>
      {failed && <SignInFailureAlert />}
      <button
        type="button"
        onClick={signIn}
        disabled={!configured || submitting}
        aria-describedby={failed ? 'signin-failure' : undefined}
        aria-busy={submitting}
        className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Continue with TideCloak
      </button>
      {!configured && !failed && (
        <p className="text-center text-xs text-red-500" role="alert">
          TideCloak is not configured. Set <code>NEXT_PUBLIC_TIDECLOAK_*</code> in your{' '}
          <code>.env</code> (see <code>docs/ENV-VARS.md</code>).
        </p>
      )}
      <p className="text-center text-sm text-zinc-500">
        New here? Creating an account also happens on TideCloak.{' '}
        <button
          type="button"
          onClick={signIn}
          disabled={!configured || submitting}
          aria-describedby={failed ? 'signin-failure' : undefined}
          aria-busy={submitting}
          className="font-medium text-zinc-900 hover:underline disabled:no-underline disabled:opacity-50 dark:text-white"
        >
          Continue
        </button>
      </p>
    </div>
  )
}
