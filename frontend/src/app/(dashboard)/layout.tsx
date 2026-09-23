'use client'

import { RoleGuard } from '@/components/auth/RoleGuard'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SOC_ROLES } from '@/lib/tidecloak/roles'

/**
 * Client-side auth + role gate for the dashboard.
 *
 * TideCloak front-channel tokens live in the browser, so gating happens here
 * rather than in a Server Component. This is UX gating only — authoritative
 * server-side verification / route protection lands in
 * `feature/tidecloak-protect`.
 *
 * All four SOC roles may access the dashboard area (see the RBAC design
 * notes in docs/tide-mcp-learning.txt) — this is a membership check only,
 * not a role-specific permission split. `RoleGuard` handles the loading
 * state, the unauthenticated login redirect, and the Access Denied fallback
 * for an authenticated user with no recognised SOC role.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard acceptedRoles={[...SOC_ROLES]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  )
}
