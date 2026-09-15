import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E configuration — Phase 1 foundation.
 *
 * Two test groups, kept structurally separate under `tests/e2e/`:
 *
 * - `ci-safe/`         — no external dependencies. Safe to run in GitHub Actions.
 * - `local-tidecloak/` — require a running local TideCloak container (see
 *   `docs/TIDECLOAK-LOCAL.md`) and a real test account. Never run in CI as
 *   part of this pass — there is no TideCloak service in `ci.yml` yet.
 *
 * Chromium only, matching the minimal-foundation scope of this phase.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'ci-safe',
      testMatch: 'ci-safe/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'local-tidecloak',
      testMatch: 'local-tidecloak/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // `local-tidecloak` drives a REAL local TideCloak instance and a real
  // externally-hosted Tide authentication session per test. Always run it
  // with a single worker (`--workers=1`, see the `test:e2e:local-tidecloak`
  // package script) so concurrent test runs never open multiple simultaneous
  // authentication sessions against the same realm.

  // Starts the Next.js dev server via the repo's own launcher (works around
  // `next` not being reliably on PATH under pnpm on Windows — see
  // `frontend/scripts/run-next.cjs`). Locally, an already-running dev server
  // on the same port is reused; CI always starts a clean one.
  webServer: {
    command: 'node scripts/run-next.cjs dev',
    url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
