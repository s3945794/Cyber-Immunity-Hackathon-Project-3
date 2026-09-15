import { test, expect, type Page } from '@playwright/test'

/**
 * Local TideCloak only — requires a running local TideCloak container
 * (`pnpm run tidecloak:start`, see `docs/TIDECLOAK-LOCAL.md`).
 *
 * IMPORTANT — corrected after a real manual run (see docs/TESTING.md):
 * `(dashboard)/layout.tsx` calls TideCloak's `login()` for an unauthenticated
 * user, which navigates the browser to the LOCAL TideCloak authorize
 * endpoint (`{authServerUrl}/realms/{realm}/protocol/openid-connect/auth`).
 * This realm's identity provider is Tide itself, so TideCloak's server then
 * redirects onward to an **externally-hosted, HTTPS Tide sign-in page** on a
 * `*.tideprotocol.com` origin — the browser does NOT stay on, or return to,
 * `localhost:8080`. An earlier version of this test incorrectly asserted the
 * final origin stayed local; it does not, and that is expected/correct
 * behaviour, not a bug in the app.
 *
 * These tests never read, log, or hardcode the full URL of that final page:
 * it carries single-use session material (session id, signed vouchers,
 * state) that must never end up in source control or console output. Only
 * `origin` / `pathname` / `hostname` / `protocol` are inspected — never the
 * query string.
 *
 * Run this file with a single worker to avoid opening multiple concurrent
 * real Tide authentication sessions:
 *   playwright test --project=local-tidecloak --workers=1
 * (the `test:e2e:local-tidecloak` package script already does this).
 */

/** One entry per observed main-frame navigation request, query string stripped. */
interface NavEntry {
  origin: string
  pathname: string
}

const localAuthServerUrl = (
  process.env.NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL ?? 'http://localhost:8080'
).replace(/\/$/, '')
const localAuthServerOrigin = new URL(localAuthServerUrl).origin

// Matches the standard OIDC authorize endpoint TideCloak (Keycloak-family)
// exposes for any realm: /realms/{realm}/protocol/openid-connect/auth.
// Deliberately realm-agnostic (no hardcoded realm name) so this doesn't
// silently stop matching if the realm is renamed.
const LOCAL_AUTHORIZE_PATH_RE = /^\/realms\/[^/]+\/protocol\/openid-connect\/auth$/

/**
 * Records every main-frame navigation request (including server-side
 * redirect hops) as {origin, pathname} pairs — never the full URL, never the
 * query string. Must be attached BEFORE navigating.
 */
function recordMainFrameNavigations(page: Page): NavEntry[] {
  const chain: NavEntry[] = []
  page.on('request', (request) => {
    if (!request.isNavigationRequest()) return
    if (request.frame() !== page.mainFrame()) return
    try {
      const url = new URL(request.url())
      chain.push({ origin: url.origin, pathname: url.pathname })
    } catch {
      // Ignore anything that isn't a parseable absolute URL.
    }
  })
  return chain
}

/**
 * Best-effort check that the protected dashboard shell (Sidebar's
 * "Dashboard" link) is not rendered on the current page. Tolerates the page
 * having already navigated away underneath us (a fast client-side redirect
 * can destroy the execution context between statements) — that outcome
 * means the shell had no chance to render, which is the desired result, not
 * a failure of this check.
 */
async function assertDashboardShellNotRendered(page: Page) {
  try {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveCount(0, {
      timeout: 2_000,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!/context was destroyed|Target closed|Execution context/i.test(message)) {
      throw error
    }
  }
}

async function expectRouteIsProtected(page: Page, path: string) {
  const chain = recordMainFrameNavigations(page)

  // Initial load of the protected route on our own origin. `goto` resolves
  // once THIS document's `load` event fires — before the client-side
  // `login()` redirect (fired from a `useEffect`) has a chance to run, so
  // this is a safe moment to confirm the shell hasn't rendered yet.
  await page.goto(path)
  await assertDashboardShellNotRendered(page)

  // Wait for the browser to land on the final, externally-hosted Tide
  // sign-in page. We only assert on protocol + hostname suffix — never the
  // full URL — and never hardcode a specific temporary URL.
  await page.waitForURL(
    (url) => url.protocol === 'https:' && url.hostname.endsWith('.tideprotocol.com'),
    { timeout: 20_000 }
  )

  // The recorded chain must show the browser actually passing through the
  // LOCAL TideCloak authorization endpoint on its way out — proving this
  // went through our own realm's protection, not straight to a third party.
  expect(
    chain.some(
      (entry) =>
        entry.origin === localAuthServerOrigin && LOCAL_AUTHORIZE_PATH_RE.test(entry.pathname)
    )
  ).toBe(true)

  // The final resting page must be HTTPS on a *.tideprotocol.com host.
  const finalUrl = new URL(page.url())
  expect(finalUrl.protocol).toBe('https:')
  expect(finalUrl.hostname.endsWith('.tideprotocol.com')).toBe(true)

  // The protected dashboard shell must still not be rendered.
  await assertDashboardShellNotRendered(page)
}

test.describe('unauthenticated route protection', () => {
  test('cannot access /dashboard', async ({ page }) => {
    await expectRouteIsProtected(page, '/dashboard')
  })

  test('cannot access /profile', async ({ page }) => {
    await expectRouteIsProtected(page, '/profile')
  })

  test('cannot access /settings', async ({ page }) => {
    await expectRouteIsProtected(page, '/settings')
  })
})
