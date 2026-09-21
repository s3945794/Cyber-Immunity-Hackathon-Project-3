import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Repo-root-relative path to the adapter export, independent of the process's
 * current working directory.
 *
 * `data/tidecloak.json` is documented everywhere (tidecloak/README.md,
 * docs/TIDECLOAK-LOCAL.md, .gitignore's `/data/` rule) as living at the repo
 * root, next to docker-compose.tidecloak.yml — not inside backend/. Resolving
 * it via `process.cwd()` breaks depending on where the process is launched
 * from: `pnpm run test` / `pnpm --filter backend ...` (every documented way to
 * run this package) sets cwd to `backend/`, not the repo root, which would
 * silently look in `backend/data/tidecloak.json` instead.
 *
 * `__dirname` is always two directories below `backend/` in both the source
 * tree (`backend/src/lib/`) and the compiled output (`backend/lib/lib/`, see
 * tsconfig.json: outDir "lib", rootDir "src" — so src/lib/x.ts compiles to
 * lib/lib/x.js). Three levels up from either location reaches the repo root.
 */
export const REPO_ROOT_ADAPTER_PATH = join(__dirname, '..', '..', '..', 'data', 'tidecloak.json')

/**
 * TideCloak adapter configuration — the shape exported from the TideCloak
 * admin console (Tide-specific "keycloak-oidc-keycloak-json" installation
 * provider), not a generic Keycloak adapter export.
 *
 * `jwk` is required: it is the embedded JWKS used for local, offline JWT
 * signature verification (see lib/tideJWT.ts). This project never fetches a
 * remote JWKS endpoint for verification.
 */
export interface TideCloakConfig {
  realm: string
  'auth-server-url': string
  resource: string
  jwk: { keys: unknown[] }
  [key: string]: unknown
}

const REQUIRED_STRING_FIELDS = ['realm', 'auth-server-url', 'resource'] as const

/**
 * Validates the shape of a parsed adapter config without ever logging its
 * contents (the config may carry key material).
 */
function assertValidConfig(value: unknown): TideCloakConfig {
  if (typeof value !== 'object' || value === null) {
    throw new Error('TideCloak adapter config must be a JSON object')
  }

  const candidate = value as Record<string, unknown>

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof candidate[field] !== 'string' || candidate[field] === '') {
      throw new Error(`TideCloak adapter config is missing required field "${field}"`)
    }
  }

  const jwk = candidate.jwk
  if (
    typeof jwk !== 'object' ||
    jwk === null ||
    !Array.isArray((jwk as { keys?: unknown }).keys) ||
    (jwk as { keys: unknown[] }).keys.length === 0
  ) {
    throw new Error(
      'TideCloak adapter config is missing required field "jwk" (embedded JWKS). ' +
        'Export via the Tide-specific installation provider, not a generic Keycloak adapter.'
    )
  }

  return candidate as TideCloakConfig
}

let cachedConfig: TideCloakConfig | null = null

/**
 * Loads the TideCloak adapter configuration.
 *
 * Priority order:
 *   1. CLIENT_ADAPTER environment variable (adapter JSON as a string)
 *   2. data/tidecloak.json (local file, gitignored)
 *
 * Fails closed: throws if neither source is present, or if the parsed
 * config is missing a required field. Never logs the config or key material.
 * Result is cached after the first successful load (lazy — not evaluated at
 * module load time, so builds don't fail before the adapter file exists).
 */
export function loadTideCloakConfig(): TideCloakConfig {
  if (cachedConfig) return cachedConfig

  const fromEnv = process.env.CLIENT_ADAPTER
  if (fromEnv) {
    let parsed: unknown
    try {
      parsed = JSON.parse(fromEnv)
    } catch {
      throw new Error('CLIENT_ADAPTER environment variable is not valid JSON')
    }
    cachedConfig = assertValidConfig(parsed)
    return cachedConfig
  }

  let raw: string
  try {
    raw = readFileSync(REPO_ROOT_ADAPTER_PATH, 'utf-8')
  } catch {
    throw new Error(
      'No TideCloak adapter configuration found. Set the CLIENT_ADAPTER environment variable ' +
        'or provide data/tidecloak.json at the repository root (gitignored, local-only).'
    )
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('data/tidecloak.json is not valid JSON')
  }

  cachedConfig = assertValidConfig(parsed)
  return cachedConfig
}

/** Test-only: clears the cached config so tests can load different fixtures. */
export function __resetTideCloakConfigCache(): void {
  cachedConfig = null
}
