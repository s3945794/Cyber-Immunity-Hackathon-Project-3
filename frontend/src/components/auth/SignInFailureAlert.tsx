'use client'

import { useEffect, useRef } from 'react'
import { SIGN_IN_FAILURE_MESSAGE } from '@/lib/tidecloak/signin-feedback'

export function SignInFailureAlert() {
  const notice = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    notice.current?.focus()
  }, [])
  return (
    <p
      ref={notice}
      id="signin-failure"
      role="alert"
      tabIndex={-1}
      className="text-center text-sm text-red-700 focus:outline-2 focus:outline-offset-2 dark:text-red-300"
    >
      {SIGN_IN_FAILURE_MESSAGE}
    </p>
  )
}
