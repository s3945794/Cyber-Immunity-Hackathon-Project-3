/**
 * The four SOC application roles this frontend recognises.
 *
 * Kept in sync with `backend/src/lib/tideJWT.ts` (`SOC_ROLES`) and the realm
 * design in `tidecloak/roles.json` — role IDs are the authoritative token
 * values; display names elsewhere in the UI are cosmetic only.
 *
 * These four roles all identify recognised SOC staff members with the same
 * set of general capabilities (dashboard access, viewing incidents, creating
 * emergency-access requests, reviewing/approving other staff members'
 * requests). They are membership roles, not a permission hierarchy — no role
 * grants broader access than another within this list, and role alone never
 * unlocks protected evidence (see docs/tide-mcp-learning.txt and the RBAC
 * design notes for the two-approval workflow, which is implemented
 * separately from this membership check).
 */
export const SOC_ROLES = [
  'soc-analyst',
  'soc-supervisor',
  'soc-team-leader',
  'soc-manager',
] as const

export type SocRole = (typeof SOC_ROLES)[number]
