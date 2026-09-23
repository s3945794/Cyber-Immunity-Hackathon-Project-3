'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FullPageSpinner } from '@/components/shared/LoadingSpinner'
import { AccessDenied } from './AccessDenied'
import type { SocRole } from '@/lib/tidecloak/roles'

interface RoleGuardProps {
  /**
   * The caller must accept at least one of these roles to see `children`.
   * This is a plain any-of-these-roles membership check — not a hierarchy.
   * An empty array fails closed (nobody is granted access), matching the
   * backend's `requireAnyRole()` behaviour in `backend/src/middleware/auth.ts`.
   */
  acceptedRoles: SocRole[]
  children: ReactNode
}

/**
 * Client-side role gate.
 *
 * - While the TideCloak SDK is initialising, renders a full-page spinner —
 *   never flashes Access Denied before the session is known.
 * - If unauthenticated, redirects to TideCloak login (same behaviour the
 *   `(dashboard)` layout already used before role checks existed).
 * - If authenticated but the user has none of `acceptedRoles` (including
 *   when `acceptedRoles` is empty), renders the Access Denied page. This is
 *   a membership check only: it does not implement the two-approval
 *   emergency-access workflow, and role membership alone never grants
 *   access to protected evidence.
 * - If authenticated and the user has at least one accepted role, renders
 *   `children`.
 */
export function RoleGuard({ acceptedRoles, children }: RoleGuardProps) {
  const { authenticated, loading, user, login } = useAuth()

  useEffect(() => {
    if (!loading && !authenticated) {
      void login()
    }
  }, [loading, authenticated, login])

  if (loading || !authenticated) return <FullPageSpinner />

  const hasAcceptedRole =
    acceptedRoles.length > 0 && (user?.roles.some((role) => acceptedRoles.includes(role)) ?? false)

  if (!hasAcceptedRole) return <AccessDenied />

  return <>{children}</>
}
