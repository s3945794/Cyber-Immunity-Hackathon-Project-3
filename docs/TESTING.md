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

**Frontend** (`frontend/tests/setup.ts`):

```typescript
vi.mock('@/lib/firebase/client', () => ({ auth: ..., db: {} }))
vi.mock('@/lib/firebase/admin', () => ({ adminAuth: { verifySessionCookie: vi.fn() }, ... }))
```

**Backend** (`backend/tests/setup.ts`) mocks `src/lib/firebase` so the Admin SDK never initializes, and exports reusable auth mocks. Auth is injected per-app, not patched globally:

```typescript
import { createApp } from '../../../src/app'
import { mockVerifyToken, mockUser } from '../../setup'

const app = createApp({ verifyToken: mockVerifyToken })

// Authenticated request:
vi.mocked(mockVerifyToken).mockResolvedValue(mockUser)

// Unauthenticated request:
vi.mocked(mockVerifyToken).mockRejectedValue(new Error('invalid'))
```
