import { Router, type Router as ExpressRouter } from 'express'
import type { Request, Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth'

const router: ExpressRouter = Router()

/**
 * GET /api/me
 *
 * Minimal demonstration endpoint for the TideCloak auth middleware. Requires
 * a valid TideCloak access token (enforced by the auth middleware mounted
 * ahead of this router in app.ts — no route-level auth check needed here).
 *
 * Returns exactly what the verified token proves: the subject (uid), the
 * email claim if present, and the recognised SOC roles only. Does not read
 * or write Firestore — this route exists to prove the auth middleware works
 * end to end, not as an application feature.
 */
router.get('/', (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest
  res.json({
    uid: user.uid,
    email: user.email ?? null,
    roles: user.roles,
  })
})

export { router as meRouter }
