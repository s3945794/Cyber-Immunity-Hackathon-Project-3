import { adminAuth } from '../lib/firebase'
import type { AuthUser, VerifyToken } from './auth'

/**
 * Legacy Firebase ID token verification.
 *
 * Kept for reference only — not wired into `createApp()`'s default TideCloak
 * auth path (`src/middleware/auth.ts`, `src/lib/tideJWT.ts`). This module
 * exists so the normal TideCloak authentication path never imports Firebase
 * Authentication: `auth.ts` no longer imports `adminAuth` at all, and this is
 * the only file that does.
 *
 * Firebase Admin itself remains available and initialised for Firestore via
 * `lib/firebase.ts` (`adminDb`) — this module only isolates the *legacy
 * authentication* use of `adminAuth`, not Firebase Admin as a whole.
 */
export const verifyFirebaseToken: VerifyToken = async (token) => {
  const decoded = await adminAuth.verifyIdToken(token)
  return {
    uid: decoded.uid,
    email: decoded.email,
    claims: decoded as Record<string, unknown>,
    roles: [],
  }
}

export type { AuthUser, VerifyToken }
