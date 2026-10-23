'use client'

import { useEffect } from 'react'
import { useAuthCallback } from '@tidecloak/nextjs'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'
import { SignInFailureAlert } from '@/components/auth/SignInFailureAlert'
import { SIGN_IN_FAILURE_URL } from '@/lib/tidecloak/signin-feedback'

/** The SDK owns token exchange and state/nonce/PKCE validation. */
export function AuthRedirect() {
  const { error, isCallback, isProcessing, isSuccess } = useAuthCallback({
    onSuccess: (returnUrl) => {
      window.location.assign(returnUrl || '/dashboard')
    },
    onError: () => {
      window.location.assign(SIGN_IN_FAILURE_URL)
    },
    // This SDK branch redirects directly, without calling onError.
    onMissingVerifierRedirectTo: SIGN_IN_FAILURE_URL,
  })
  const failed = Boolean(error)
  useEffect(() => {
    if (!isCallback && !isProcessing && !isSuccess && !failed) {
      window.location.assign('/auth/signin')
    }
  }, [isCallback, isProcessing, isSuccess, failed])
  // Safe even while navigation is delayed; never render the SDK error payload.
  if (failed) return <SignInFailureAlert />
  return <FullPageSpinner />
}
