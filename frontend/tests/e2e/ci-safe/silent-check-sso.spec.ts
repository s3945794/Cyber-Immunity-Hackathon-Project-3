import { test, expect } from '@playwright/test'

/**
 * CI-safe: `/silent-check-sso.html` is a static file (see
 * `frontend/public/silent-check-sso.html`) used by the TideCloak SDK for
 * silent session refresh in a hidden same-origin iframe. It is served by
 * Next.js regardless of whether a TideCloak server is reachable, so this is
 * a pure static-asset check — no TideCloak dependency.
 */
test.describe('silent-check-sso.html', () => {
  test('returns HTTP 200', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/silent-check-sso.html`)
    expect(response.status()).toBe(200)
  })

  test('contains the expected postMessage script', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/silent-check-sso.html`)
    const body = await response.text()
    expect(body).toContain('parent.postMessage(location.href, location.origin)')
  })
})
