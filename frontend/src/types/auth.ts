import type { SocRole } from '@/lib/tidecloak/roles'

/**
 * Authenticated user, normalised from the TideCloak ID-token claims.
 *
 * `uid` is the token `sub`. TideCloak always asserts a username
 * (`preferred_username`); depending on the upstream identity provider it may or
 * may not assert an email.
 *
 * `roles` contains only the recognised SOC application roles (see
 * `@/lib/tidecloak/roles`) — any other token role is filtered out.
 */
export interface AuthUser {
  uid: string
  username: string | null
  email: string | null
  roles: SocRole[]
}

/**
 * Value provided by {@link AuthProvider} and read via `useAuth()`.
 *
 * This is a thin, app-shaped wrapper over the TideCloak SDK's `useTideCloak()`
 * context — it exposes only what the UI needs.
 */
export interface AuthContextValue {
  /** Current user, or `null` while initialising or unauthenticated. */
  user: AuthUser | null
  /** `true` once TideCloak confirms an active session. */
  authenticated: boolean
  /** `true` while the TideCloak SDK restores/initialises the session. */
  loading: boolean
  /** Send the browser to TideCloak to authenticate. */
  login: () => Promise<void>
  /** End the TideCloak session and return to the app. */
  logout: () => Promise<void>
  /**
   * Returns the current TideCloak access token (or `null` if unauthenticated),
   * refreshing it via the SDK first if needed. Callers must use the result
   * only in an `Authorization: Bearer` header — never render, log, store in
   * component state, persist to localStorage, or return it from an API.
   */
  getToken: () => Promise<string | null>
}
