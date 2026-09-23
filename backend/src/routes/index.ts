import { Router, type Router as ExpressRouter } from 'express'
import { meRouter } from './me'
import { incidentsRouter } from './incidents'

const router: ExpressRouter = Router()

// GET /api/me — returns the authenticated user's uid, email and SOC roles.
// Demonstrates the TideCloak auth middleware end to end (see src/routes/me.ts).
router.use('/me', meRouter)

// GET /api/incidents, GET /api/incidents/:id — synthetic incident data for
// the SOC dashboard. Requires a recognised SOC role (see src/routes/incidents.ts).
router.use('/incidents', incidentsRouter)

// Mount additional routes here. Use the /add-route skill to scaffold new routes.
// Example:
//   import { usersRouter } from './users'
//   router.use('/users', usersRouter)

export { router as apiRouter }
