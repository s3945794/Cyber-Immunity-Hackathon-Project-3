'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'

/**
 * Client-side auth gate for the dashboard.
 *
 * TideCloak front-channel tokens live in the browser, so gating happens here
 * rather than in a Server Component. This is UX gating only — authoritative
 * server-side verification / route protection lands in
 * `feature/tidecloak-protect`.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { authenticated, loading, login } = useAuth()

  useEffect(() => {
    if (!loading && !authenticated) {
      void login()
    }
  }, [loading, authenticated, login])

  if (loading || !authenticated) return <FullPageSpinner />

  return <DashboardShell>{children}</DashboardShell>
}
