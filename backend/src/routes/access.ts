import { Router, type Router as ExpressRouter, type Request } from 'express'
import { z } from 'zod'
import { requireAnyRole, type AuthenticatedRequest } from '../middleware/auth'
import { SOC_ROLES } from '../lib/tideJWT'
import { HttpError } from '../lib/errors'
import type { AccessService } from '../access/service'

function userOf(req: Request) {
  return (req as AuthenticatedRequest).user
}
function cursor(req: Request): string | undefined {
  const parsed = z
    .object({
      before: z
        .string()
        .regex(/^[0-9]{1,16}:[a-zA-Z0-9_-]{1,150}$/)
        .optional(),
    })
    .strict()
    .safeParse(req.query)
  if (!parsed.success) throw HttpError.badRequest('Invalid history query')
  return parsed.data.before
}
function param(req: Request, name: string): string {
  const value = req.params[name]
  if (typeof value !== 'string') throw HttpError.badRequest('Invalid path')
  return value
}
export function createAccessRouter(service: AccessService): ExpressRouter {
  const router: ExpressRouter = Router()
  router.use(['/requests', '/approvals', '/audit', '/access'], requireAnyRole(...SOC_ROLES))
  router.get('/access/incidents/:incidentId/requests', async (req, res, next) => {
    try {
      res.json(await service.incidentRequests(userOf(req), param(req, 'incidentId')))
    } catch (err) {
      next(err)
    }
  })
  router.get('/access/config', (req, res, next) => {
    try {
      res.json(service.configuration(userOf(req)))
    } catch (err) {
      next(err)
    }
  })
  router.post('/requests', async (req, res, next) => {
    try {
      res.status(201).json({
        request: await service.create(userOf(req), req.body, req.headers['idempotency-key']),
      })
    } catch (err) {
      next(err)
    }
  })
  router.get('/requests', async (req, res, next) => {
    try {
      res.json(await service.list(userOf(req), false, cursor(req)))
    } catch (err) {
      next(err)
    }
  })
  router.get('/approvals', async (req, res, next) => {
    try {
      res.json(await service.list(userOf(req), true, cursor(req)))
    } catch (err) {
      next(err)
    }
  })
  router.get('/audit', async (req, res, next) => {
    try {
      res.json(await service.audit(userOf(req), cursor(req)))
    } catch (err) {
      next(err)
    }
  })
  router.get('/requests/:id', async (req, res, next) => {
    try {
      res.json({ request: await service.detail(userOf(req), param(req, 'id')) })
    } catch (err) {
      next(err)
    }
  })
  router.post('/requests/:id/decisions', async (req, res, next) => {
    try {
      res.json({
        request: await service.decide(
          userOf(req),
          param(req, 'id'),
          req.body,
          req.headers['idempotency-key']
        ),
      })
    } catch (err) {
      next(err)
    }
  })
  router.post('/requests/:id/cancel', async (req, res, next) => {
    try {
      res.json({
        request: await service.cancel(
          userOf(req),
          param(req, 'id'),
          req.body,
          req.headers['idempotency-key']
        ),
      })
    } catch (err) {
      next(err)
    }
  })
  router.post('/requests/:id/evidence', async (req, _res, next) => {
    try {
      const body = z
        .object({
          incidentId: z.string(),
          resource: z.enum(['victimHost', 'exposureEvidence', 'suspiciousProcess']),
          permission: z.literal('read'),
        })
        .strict()
        .safeParse(req.body)
      if (!body.success) throw HttpError.badRequest('Invalid protected operation')
      await service.evidence(
        userOf(req),
        param(req, 'id'),
        body.data.incidentId,
        body.data.resource,
        req.headers['idempotency-key']
      )
    } catch (err) {
      next(err)
    }
  })
  return router
}
