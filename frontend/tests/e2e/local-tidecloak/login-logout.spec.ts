import { test } from '@playwright/test'

/**
 * Local TideCloak login / logout — CURRENTLY SKIPPED. Do not remove this
 * file; it documents why automation was not attempted and what to verify by
 * hand instead. See "Manual verification" in docs/TESTING.md for the full
 * step-by-step.
 *
 * ---
 *
 * A manual Playwright run against a real local TideCloak instance (see
 * docs/TESTING.md) showed that `/auth/signin` → "Continue with TideCloak"
 * does NOT land on a local Keycloak-style login form. It lands on an
 * externally-hosted, HTTPS Tide sign-in page (`*.tideprotocol.com`) with a
 * fundamentally different structure:
 *
 * - The username and password fields are plain `textbox` elements with NO
 *   accessible name (no `<label>`, no `aria-label`) — only adjacent
 *   paragraph text that is not programmatically associated with the field.
 *   There is no `#username` / `#password` — those never existed here; this
 *   is not a Keycloak login form.
 * - The "Sign In" control is not exposed as a `button` in the accessibility
 *   tree — it is a plain clickable element with a paragraph label inside.
 * - The page also offers a QR-code sign-in path and a "Switch sign-in host
 *   (Advanced)" control, suggesting this flow may branch (e.g. an
 *   out-of-band mobile/enclave approval) rather than being a single
 *   synchronous form submit — that cannot be confirmed without live,
 *   credentialed access, which this pass does not have.
 *
 * Given that, the only selectors available for the two input fields would
 * be POSITIONAL (e.g. "first textbox", "second textbox") rather than
 * genuine accessible selectors. Positional selectors on a third-party page
 * we do not control are exactly the kind of brittle, silently-wrong
 * automation this task asked to avoid — a future unrelated field could
 * reorder the inputs and the test would fill the wrong one without any
 * signal. There is also no confirmed evidence the flow is a plain
 * single-step form submit at all.
 *
 * Per this task's explicit instruction, when a login flow cannot be safely
 * automated, the correct outcome is a clear, always-skipped test — not a
 * best-effort guess and not a failing test. Login/logout coverage for this
 * flow is manual for now (see docs/TESTING.md). Revisit automation once the
 * Tide sign-in page exposes accessible names on its username/password
 * fields and a semantic button for submit, or once Tide publishes a
 * documented test-automation contract for this page.
 */
test.describe('TideCloak login / logout', () => {
  test.skip(
    true,
    'Automated login/logout is skipped: the Tide-hosted sign-in page ' +
      '(*.tideprotocol.com) exposes its username/password fields with no ' +
      'accessible name and its submit control with no button role, so no ' +
      'stable selector exists without guessing positionally. See the file ' +
      'header comment and docs/TESTING.md "Manual verification" for the ' +
      'required manual test steps.'
  )

  test('login through TideCloak returns the user to /dashboard', async () => {
    // Intentionally skipped — see file header comment.
  })

  test('logout returns the user to a logged-out state', async () => {
    // Intentionally skipped — see file header comment.
  })
})
