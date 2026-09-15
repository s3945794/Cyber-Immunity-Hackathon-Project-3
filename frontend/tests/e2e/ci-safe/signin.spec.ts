import { test, expect } from '@playwright/test'

/**
 * CI-safe: /auth/signin only. This page renders regardless of whether a
 * TideCloak server is reachable — it just shows a "Continue with TideCloak"
 * button that has not been clicked yet, so no external dependency is needed.
 *
 * Route protection for /dashboard, /profile and /settings is NOT tested here:
 * that layout gate calls TideCloak's `login()` directly, which requires a
 * real TideCloak server. Those tests live in `tests/e2e/local-tidecloak/`.
 */
test.describe('sign-in page', () => {
  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/auth/signin')
    expect(response?.status()).toBe(200)
  })

  test('shows the sign-in heading', async ({ page }) => {
    await page.goto('/auth/signin')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })

  test('shows the "Continue with TideCloak" button', async ({ page }) => {
    await page.goto('/auth/signin')
    await expect(page.getByRole('button', { name: 'Continue with TideCloak' })).toBeVisible()
  })
})
