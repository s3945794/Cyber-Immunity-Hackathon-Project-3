import { Suspense } from 'react'
import { SignInPanel } from '@/components/auth/SignInPanel'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'

export default function SignInPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <SignInPanel />
    </Suspense>
  )
}
