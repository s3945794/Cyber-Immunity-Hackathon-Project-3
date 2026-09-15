'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { isTideCloakConfigured } from '@/lib/tidecloak/config'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'

export default function SignUpPage() {
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
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-zinc-500">
          Accounts are created and secured by TideCloak. Continue to register or sign in there —
          this app never sees your password.
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
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="font-medium text-zinc-900 hover:underline dark:text-white"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
