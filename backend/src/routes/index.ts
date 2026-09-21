import { Router, type Router as ExpressRouter } from 'express'
import { meRouter } from './me'

const router: ExpressRouter = Router()

// GET /api/me — returns the authenticated user's uid, email and SOC roles.
// Demonstrates the TideCloak auth middleware end to end (see src/routes/me.ts).
router.use('/me', meRouter)

// Mount additional routes here. Use the /add-route skill to scaffold new routes.
// Example:
//   import { usersRouter } from './users'
//   router.use('/users', usersRouter)

export { router as apiRouter }
