# Testing

## Test Layers

| Layer                          | Command                             | Tool                     | Firebase | Description                                                    |
| ------------------------------ | ----------------------------------- | ------------------------ | -------- | -------------------------------------------------------------- |
| Frontend unit                  | `pnpm run test:component`           | Vitest + Testing Library | Mocked   | Utils, hooks, components                                       |
| Backend unit                   | `pnpm run test`                     | Vitest + supertest       | Mocked   | Route handlers, middleware                                     |
| Frontend E2E (CI-safe)         | `pnpm run test:e2e`                 | Playwright               | N/A      | Pages that render with no TideCloak server reachable           |
| Frontend E2E (local TideCloak) | `pnpm run test:e2e:local-tidecloak` | Playwright               | N/A      | Route protection, login, logout against a real local TideCloak |
| All                            | `pnpm run test:all`                 | —                        | —        | Runs the unit layers (not E2E)                                 |

There's no local emulator, so there's no integration-test layer against a real Firestore — all tests mock Firebase and never make real network calls.

## Running Tests

```bash
# Run all unit tests
pnpm run test:all

# Watch mode (frontend)
pnpm --filter frontend run test:watch

# Watch mode (backend)
pnpm --filter backend run test:watch

# Coverage
pnpm --filter frontend run test:coverage
pnpm --filter backend run test:coverage

# Playwright E2E — CI-safe (no TideCloak needed)
pnpm run test:e2e

# Playwright E2E — local TideCloak (requires a running local TideCloak container)
pnpm run test:e2e:local-tidecloak

# View the last Playwright HTML report
pnpm --filter frontend run test:e2e:report
```

## End-to-End Tests (Playwright)

Config: `frontend/playwright.config.ts`. Chromium only. Tests live in
`frontend/tests/e2e/`, split into two groups that are never run together:

- **`tests/e2e/ci-safe/`** — no external dependencies. Runs in GitHub Actions.
  Covers pages that render the same way whether or not a TideCloak server is
  reachable: `/auth/signin` loading and its heading/button, and
  `/silent-check-sso.html` being served with the expected content.
- **`tests/e2e/local-tidecloak/`** — require a running local TideCloak
  container (`pnpm run tidecloak:start`, see `docs/TIDECLOAK-LOCAL.md`) with
  the realm and application client provisioned. Covers:
  - Unauthenticated access to `/dashboard`, `/profile`, `/settings` — each one
    triggers TideCloak's `login()`, which navigates the browser to the
    TideCloak auth server (`{authServerUrl}/realms/{realm}/protocol/openid-connect/auth`).
    The test asserts the browser actually lands on that TideCloak origin and
    that the dashboard shell never rendered — it does not pass merely because
    the app showed nothing.
  - Login through TideCloak back to `/dashboard`, and logout back to a
    logged-out state.

**These are two separate Playwright _projects_** (`ci-safe` and
`local-tidecloak`), not just folders — `--project=<name>` selects which one
runs, so a plain `playwright test` with no project flag would run both. Use
the package scripts above rather than the bare `playwright test` command in
this repo, since only `test:e2e` (`ci-safe`) is meant to run in CI.

### Credentials for the local-tidecloak login/logout test

Two environment variables, read directly from the process environment — never
from `.env` and never hard-coded in a spec file:

```
E2E_TIDECLOAK_USERNAME
E2E_TIDECLOAK_PASSWORD
```

They must belong to a real test account already created in the local
TideCloak realm; Playwright does not create one. If either variable is unset,
the login/logout tests **skip** with an explicit message rather than failing
or silently passing. `.env.example` carries both as empty placeholder names
only — see `docs/ENV-VARS.md`.

### CI status

Only `tests/e2e/ci-safe/` is intended to run in CI. `ci.yml` has **not** been
updated to run Playwright as part of this phase — wiring a Playwright job
(including `playwright install --with-deps chromium`) into CI is deferred to a
follow-up change. `tests/e2e/local-tidecloak/` cannot run in CI at all without
a TideCloak service container, which does not exist in this repo's pipeline.

## What to Test

### Frontend

- **Always test:** utility functions in `src/lib/`, Zod validation schemas, custom hooks
- **Skip:** shadcn `src/components/ui/` components (not hand-authored)
- **Skip:** `src/app/` page files (test via integration or E2E)
- Firebase is always mocked via `tests/setup.ts` — never call real Firebase in unit tests

### Backend

- **Unit tests:** Each route handler tested with supertest; Firebase Admin is mocked
- Every new route created via `/add-route` skill must have at minimum: 200/201 happy path + 401 without token

## Mocking Firebase

**Frontend** has no Firebase SDK — no Firebase mocks are needed in `frontend/tests/setup.ts`.

**Backend** (`backend/tests/setup.ts`) mocks `src/lib/firebase` (`adminDb` only — there is no Auth export) so the Admin SDK never initializes, and exports reusable auth mocks. Auth is injected per-app, not patched globally:

```typescript
import { createApp } from '../../../src/app'
import { mockVerifyToken, mockUser } from '../../setup'

const app = createApp({ verifyToken: mockVerifyToken })

// Authenticated request:
vi.mocked(mockVerifyToken).mockResolvedValue(mockUser)

// Unauthenticated request:
vi.mocked(mockVerifyToken).mockRejectedValue(new Error('invalid'))
```

## SOC emergency-access stage

Run pnpm run test:all, pnpm run typecheck, pnpm run lint, pnpm run build,
pnpm run validate, git diff --check and pnpm audit --audit-level=high.

Vitest uses its supported runner configuration loader and envDir:false. Unit tests
never load private application environment files; no test is skipped and no auth
bypass is introduced. Frontend framework-resolution failures in the restricted
checkout are recorded as blocked suites, not passing tests.

New backend unit tests cover validation boundaries, ownership/membership,
concurrent duplicate scopes/decisions, self/duplicate approvals, retry idempotency,
rejection/cancellation terminal states, wrong evidence scope, active-flag tampering,
server-time expiry, audit consistency, CORS and no-store. These use an explicitly
test-only memory store and verified-identity fixtures. They do not test live Tide
or a live database. Expiry tests use tampered/reserved active metadata solely to
exercise the fail-closed boundary; production has no authority activation path.

Frontend API/state tests cover session loss, stale asynchronous metadata after
context changes, no-store/header-only token use, reconnection/visibility rechecks
and safe errors. Form tests are updated for real API submission, retained reason
and double-submit prevention. No plaintext decryption is implemented or claimed
tested while the Tide integration is blocked.

pnpm run test:emulator builds the real backend and uses a new isolated demo project
and ports, then performs actual transaction/query checks and graceful export/import
retention. It does not reset existing demo data. On 8 October the owner reported
successful isolated seed/export/reload; persistence is VERIFIED owner evidence.
The current agent rerun stopped at Firebase CLI startup with EPERM before emulator
execution. Interactive demo restart, independent laptop startup and live JWT/
Fabric verification remain separate and unverified. Current exit codes are in
SOC-POC-HANDOFF.md; earlier blocked agent results do not override the owner's run.

Real Fabric tests require manual user sign-in with distinct authorised accounts,
approved policies and a compatible enclave/SDK. Direct decryption after expiry and
database-edit resistance must be exercised live, not inferred from mock assertions.
Use the detailed group checklist in SOC-POC-RUNBOOK.md.
