/**
 * TideCloak adapter configuration for the browser login flow.
 *
 * The Tide playbook normally imports a committed `data/tidecloak.json` adapter
 * export. This repo keeps `data/` out of git (see `.gitignore`) and sources all
 * public configuration from the root `.env` (`docs/ENV-VARS.md`), so the
 * connection details are provided as `NEXT_PUBLIC_TIDECLOAK_*` env vars instead.
 *
 * Only the OIDC/PKCE fields needed for front-channel login are read here. The
 * Tide-specific adapter fields (`jwk`, `vendorId`, `homeOrkUrl`,
 * `client-origin-auth-*`) are used for DPoP, end-to-end encryption and
 * server-side JWKS verification — none of which is wired in this branch. They
 * are deferred to `feature/tidecloak-protect`.
 */

/** Keys consumed by `IAMService.initIAM` for front-channel mode. */
export interface TideCloakConfig {
  'auth-server-url': string
  realm: string
  resource: string
  'ssl-required': string
  'public-client': true
  'confidential-port': 0
  /** Optional explicit redirect URI. The SDK defaults to `${origin}/auth/redirect`. */
  redirectUri?: string
  /**
   * The Tide request enclave handles E2EE / approval flows, which are out of
   * scope for this branch and need adapter fields we do not load yet.
   */
  setupRequestEnclave: false
}

// Next.js only inlines `NEXT_PUBLIC_*` vars when the FULL name is referenced
// statically (`process.env.NEXT_PUBLIC_X`) — a dynamic `process.env[key]` is
// not bundled for the browser. So every var below is read by its literal name.
const clean = (value: string | undefined): string => (value ?? '').trim()

const AUTH_SERVER_URL = clean(process.env.NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL)
const REALM = clean(process.env.NEXT_PUBLIC_TIDECLOAK_REALM)
const CLIENT_ID = clean(process.env.NEXT_PUBLIC_TIDECLOAK_CLIENT_ID)
const SSL_REQUIRED = clean(process.env.NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED)
const REDIRECT_URI = clean(process.env.NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI)

/**
 * True when the three required TideCloak env vars are present. Used to render a
 * helpful message instead of firing a login that cannot complete.
 */
export function isTideCloakConfigured(): boolean {
  return Boolean(AUTH_SERVER_URL && REALM && CLIENT_ID)
}

/**
 * Assemble the config object passed to `<TideCloakProvider config={...}>`.
 * Always returns an object; missing env vars yield empty strings so the provider
 * mounts without throwing (a real login only fails once attempted).
 */
export function getTideCloakConfig(): TideCloakConfig {
  const config: TideCloakConfig = {
    'auth-server-url': AUTH_SERVER_URL.replace(/\/$/, ''),
    realm: REALM,
    resource: CLIENT_ID,
    'ssl-required': SSL_REQUIRED || 'external',
    'public-client': true,
    'confidential-port': 0,
    setupRequestEnclave: false,
  }

  if (REDIRECT_URI) config.redirectUri = REDIRECT_URI

  return config
}
