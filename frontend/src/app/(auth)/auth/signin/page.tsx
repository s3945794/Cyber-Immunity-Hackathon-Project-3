'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { isTideCloakConfigured } from '@/lib/tidecloak/config'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'

export default function SignInPage() {
  const router = useRouter()
  const { authenticated, loading, login } = useAuth()
  const configured = isTideCloakConfigured()

  useEffect(() => {
    if (!loading && authenticated) {
      router.replace('/dashboard')
    }
  }, [loading, authenticated, router])

  if (loading || authenticated) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="text-sm text-zinc-500">
          You&apos;ll be redirected to TideCloak to authenticate.
        </p>
      </div>

      <button
        type="button"
        onClick={() => login()}
        disabled={!configured}
        className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Continue with TideCloak
      </button>

      {!configured && (
        <p className="text-center text-xs text-red-500" role="alert">
          TideCloak is not configured. Set <code>NEXT_PUBLIC_TIDECLOAK_*</code> in your{' '}
          <code>.env</code> (see <code>docs/ENV-VARS.md</code>).
        </p>
      )}

      <p className="text-center text-sm text-zinc-500">
        New here? Creating an account also happens on TideCloak.{' '}
        <button
          type="button"
          onClick={() => login()}
          disabled={!configured}
          className="font-medium text-zinc-900 hover:underline disabled:no-underline disabled:opacity-50 dark:text-white"
        >
          Continue
        </button>
      </p>
    </div>
  )
}
