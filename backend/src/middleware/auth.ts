import type { Request, Response, NextFunction } from 'express'
import { HttpError } from '../lib/errors'
import { verifyTideCloakJWT, extractSocRoles, type SocRole } from '../lib/tideJWT'

/** The authenticated user attached to every request that passes the auth middleware. */
export interface AuthUser {
  uid: string
  email: string | undefined
  claims: Record<string, unknown>
  /** Recognised SOC application roles only — unrelated TideCloak roles are ignored. */
  roles: SocRole[]
}

/**
 * Verifies a bearer token and returns the authenticated user.
 * Injected into createApp() so tests can swap in a mock without touching Firebase or TideCloak.
 */
export type VerifyToken = (token: string) => Promise<AuthUser>

/**
 * TideCloak access token verification — the default for this backend.
 *
 * Verifies signature (via the adapter's embedded JWKS), issuer, `azp`, and
 * time claims (see lib/tideJWT.ts for the exact checks). Builds the
 * application user from the token subject and the recognised SOC roles only.
 */
export const verifyTideCloakToken: VerifyToken = async (token) => {
  const payload = await verifyTideCloakJWT(token)
  const email = typeof payload.email === 'string' ? payload.email : undefined

  return {
    uid: typeof payload.sub === 'string' ? payload.sub : '',
    email,
    claims: payload as Record<string, unknown>,
    roles: extractSocRoles(payload),
  }
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser
}

/**
 * Auth middleware — expects `Authorization: Bearer <access token>`.
 * On success attaches the user: `const { user } = req as AuthenticatedRequest`.
 */
export function createAuthMiddleware(verifyToken: VerifyToken) {
  return async function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      next(HttpError.unauthorized('Missing or invalid Authorization header'))
      return
    }

    try {
      ;(req as AuthenticatedRequest).user = await verifyToken(authHeader.slice(7))
      next()
    } catch {
      next(HttpError.unauthorized('Invalid or expired token'))
    }
  }
}

/**
 * Role-checking middleware — must run after createAuthMiddleware().
 * Returns 403 if the authenticated user does not have the required role.
 *
 * Usage: router.get('/reports', requireRole('soc-analyst'), handler)
 */
export function requireRole(role: SocRole) {
  return function roleMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { user } = req as AuthenticatedRequest
    if (!user?.roles.includes(role)) {
      next(HttpError.forbidden())
      return
    }
    next()
  }
}

/**
 * Role-membership middleware — must run after createAuthMiddleware().
 * Allows the request through if the authenticated user has at least one of
 * the given roles (an OR match, not a hierarchy or ranking of roles).
 *
 * - 401 if no authenticated user is attached to the request (auth middleware
 *   did not run, or failed to attach one).
 * - 403 if the user is authenticated but has none of the accepted roles.
 * - 403 if `acceptedRoles` is empty — fails closed rather than granting
 *   access to everyone. An empty list is treated as "no one is authorized",
 *   never as "no restriction".
 *
 * Usage: router.get('/dashboard', requireAnyRole('soc-analyst', 'soc-manager'), handler)
 */
export function requireAnyRole(...acceptedRoles: SocRole[]) {
  return function anyRoleMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { user } = req as Partial<AuthenticatedRequest>
    if (!user) {
      next(HttpError.unauthorized())
      return
    }

    if (acceptedRoles.length === 0) {
      next(HttpError.forbidden())
      return
    }

    const hasAcceptedRole = acceptedRoles.some((role) => user.roles.includes(role))
    if (!hasAcceptedRole) {
      next(HttpError.forbidden())
      return
    }

    next()
  }
}
