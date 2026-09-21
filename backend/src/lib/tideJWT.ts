import { jwtVerify, createLocalJWKSet, type JWTPayload } from 'jose'
import { loadTideCloakConfig, type TideCloakConfig } from './tidecloakConfig'

/**
 * The four SOC application roles this backend recognises. Any other realm or
 * client role present in the token (e.g. Tide/TideCloak internal roles) is
 * ignored when building the application user object.
 */
export const SOC_ROLES = [
  'soc-analyst',
  'soc-supervisor',
  'soc-team-leader',
  'soc-manager',
] as const
export type SocRole = (typeof SOC_ROLES)[number]

/** How many seconds of clock skew to tolerate for future-dated `iat`. */
const IAT_FUTURE_TOLERANCE_SECONDS = 60

let cachedJWKS: ReturnType<typeof createLocalJWKSet> | null = null
let cachedForConfig: TideCloakConfig | null = null

function getJWKS(config: TideCloakConfig): ReturnType<typeof createLocalJWKSet> {
  if (cachedJWKS && cachedForConfig === config) return cachedJWKS
  // jose expects a JSONWebKeySet-shaped object.
  cachedJWKS = createLocalJWKSet(config.jwk as Parameters<typeof createLocalJWKSet>[0])
  cachedForConfig = config
  return cachedJWKS
}

/**
 * Verifies a TideCloak-issued access token.
 *
 * - Signature, standard `exp`, and `nbf` (when present) are verified by jose.
 * - No signing algorithm is hardcoded: Tide MCP guidance did not confirm one,
 *   so jose selects verification based on the embedded JWKS key material.
 * - Issuer is derived from the adapter config: `${auth-server-url}/realms/${realm}`.
 * - `azp` (not `aud`) must match the adapter's client id (`resource`).
 * - `iat` more than IAT_FUTURE_TOLERANCE_SECONDS in the future is rejected.
 * - No remote JWKS endpoint is ever used — verification is local/offline only.
 *
 * Throws on any failure. Never logs the token, payload, or key material.
 */
export async function verifyTideCloakJWT(token: string): Promise<JWTPayload> {
  const config = loadTideCloakConfig()
  const JWKS = getJWKS(config)

  const issuer = `${config['auth-server-url'].replace(/\/+$/, '')}/realms/${config.realm}`

  const { payload } = await jwtVerify(token, JWKS, { issuer })

  if (payload.azp !== config.resource) {
    throw new Error('Token azp does not match the configured TideCloak client')
  }

  const now = Math.floor(Date.now() / 1000)
  if (typeof payload.iat === 'number' && payload.iat > now + IAT_FUTURE_TOLERANCE_SECONDS) {
    throw new Error('Token was issued too far in the future')
  }

  return payload
}

/**
 * Extracts the recognised SOC application roles from a verified token
 * payload, combining realm roles (`realm_access.roles`) and this client's
 * roles (`resource_access[<resource>].roles`). Any role outside SOC_ROLES
 * (including unrelated Tide/TideCloak roles) is ignored.
 */
export function extractSocRoles(payload: JWTPayload): SocRole[] {
  const config = loadTideCloakConfig()

  const realmRoles = (payload.realm_access as { roles?: unknown })?.roles
  const realmRoleList = Array.isArray(realmRoles)
    ? realmRoles.filter((r): r is string => typeof r === 'string')
    : []

  const resourceAccess = payload.resource_access as Record<string, { roles?: unknown }> | undefined
  const clientRoles = resourceAccess?.[config.resource]?.roles
  const clientRoleList = Array.isArray(clientRoles)
    ? clientRoles.filter((r): r is string => typeof r === 'string')
    : []

  const combined = new Set<string>([...realmRoleList, ...clientRoleList])
  return SOC_ROLES.filter((role) => combined.has(role))
}

/** Test-only: resets the cached JWKS so tests can load different keys. */
export function __resetTideJWKSCache(): void {
  cachedJWKS = null
  cachedForConfig = null
}
