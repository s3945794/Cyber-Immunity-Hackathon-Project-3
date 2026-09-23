import { vi } from 'vitest'
import type { AuthUser, VerifyToken } from '../src/middleware/auth'

// Prevent Firebase Admin from initializing during unit tests.
// Firebase Authentication is not used anywhere in this backend (TideCloak
// is the sole auth provider — see middleware/auth.ts). This stub only
// covers Firestore access, which lib/firebase.ts now exclusively provides.
vi.mock('../src/lib/firebase', () => ({
  adminDb: { collection: vi.fn(), runTransaction: vi.fn() },
}))

/**
 * Reusable auth mocks for unit tests.
 * Inject via createApp({ verifyToken: mockVerifyToken }).
 *
 * Default behavior: rejects (unauthenticated).
 * Override per-test: vi.mocked(mockVerifyToken).mockResolvedValue(mockUser)
 */
export const mockUser: AuthUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  claims: {},
  roles: [],
}

export const mockVerifyToken: VerifyToken = vi
  .fn()
  .mockRejectedValue(new Error('No token configured for this test'))
