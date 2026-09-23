# Backend

## Overview

The backend is a **Firebase Cloud Functions v2** app using the **Express fat-lambda** pattern — a single Cloud Function (`api`) that delegates all routing to an Express app. One function to deploy, one app to test, and local development behaves exactly like production.

## Structure

```
backend/
├── src/
│   ├── index.ts              Cloud Functions entry point (exports `api`)
│   ├── app.ts                Express app factory — createApp()
│   ├── routes/
│   │   ├── index.ts          Route registry
│   │   ├── health.ts         GET /api/health
│   │   └── me.ts             GET /api/me — auth middleware demo endpoint
│   ├── middleware/
│   │   ├── auth.ts           TideCloak JWT verification → req.user; requireRole() (no Firebase import)
│   │   └── errorHandler.ts   Global error handler (RFC 9457 responses)
│   └── lib/
│       ├── firebase.ts       Admin SDK singleton (sole entry point; Firestore only, no Auth export)
│       ├── tidecloakConfig.ts  Adapter config loader (CLIENT_ADAPTER / data/tidecloak.json)
│       ├── tideJWT.ts        TideCloak access token verification + role extraction
│       └── errors.ts         HttpError — the single error type
└── tests/
    ├── unit/                 supertest tests (mocked Firebase)
    │   └── conventions.test.ts  Enforces the two backend rules in CI
    └── setup.ts              Vitest setup + Firebase mocks (adminDb only)
```

## Routes

| Method | Path          | Auth | Description                                                                                                                                                                  |
| ------ | ------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/health` | No   | Health check                                                                                                                                                                 |
| GET    | `/api/me`     | Yes  | Returns the authenticated user's `uid`, `email` and SOC `roles` from the verified TideCloak token. Demonstrates the auth middleware end to end — not an application feature. |

Add new routes with the `/add-route` Claude Code skill.

## Authentication

All routes under `/api/` (except `/api/health`) require a valid **TideCloak access token**:

```
Authorization: Bearer {tidecloak-access-token}
```

`createApp()` defaults `verifyToken` to `verifyTideCloakToken` (`src/middleware/auth.ts`), which
verifies the token via `src/lib/tideJWT.ts`:

- Signature verified locally against the adapter's embedded JWKS (`jose`'s `createLocalJWKSet` +
  `jwtVerify`) — **no remote JWKS endpoint is ever used**. No signing algorithm is hardcoded;
  `jose` verifies using whatever key material the JWKS provides.
- `exp` and `nbf` (when present) are verified by `jose`.
- `iss` must equal `${auth-server-url}/realms/${realm}` from the adapter config.
- `azp` (not `aud`) must equal the adapter's client id (`resource`).
- `iat` more than 60 seconds in the future is rejected.

The adapter configuration is loaded by `src/lib/tidecloakConfig.ts`, in priority order:

1. `CLIENT_ADAPTER` environment variable (adapter JSON as a string)
2. `data/tidecloak.json` (local file, gitignored) — resolved relative to the **repository
   root**, not the process's current working directory, so it is found the same way whether
   the backend is run via `pnpm run test` / `pnpm --filter backend ...` (cwd = `backend/`) or
   directly from the repo root.

Loading **fails closed**: if neither source is present, or the parsed config is missing
`auth-server-url`, `realm`, `resource`, or `jwk`, every request is rejected (401) rather than
falling back to an unverified state. Neither the config nor decoded token claims are ever logged.

The auth middleware attaches the user to the request:

```typescript
const { user } = req as AuthenticatedRequest
// user.uid    — token subject (sub)
// user.email  — email claim, if present
// user.claims — full decoded token payload
// user.roles  — recognised SOC roles only (soc-analyst, soc-supervisor,
//               soc-team-leader, soc-manager); unrelated TideCloak roles
//               are filtered out
```

Role-gate a route with `requireRole`:

```typescript
import { requireRole } from '../middleware/auth'

router.get('/reports', requireRole('soc-analyst'), handler)
```

`requireRole` returns **403** if the authenticated user lacks the role. The auth middleware itself
returns **401** for anything wrong with the token (missing header, wrong scheme, malformed,
invalid signature, expired, future-issued beyond tolerance, wrong issuer, wrong `azp`).

### Firebase Admin — Firestore only, no authentication use

Firebase Admin (`src/lib/firebase.ts`, `adminDb`) exists solely for **Firestore** access,
reserved for future features (emergency-access request, approval, expiry, audit history) — no
current route uses it. Firebase Authentication is not used anywhere in this backend; there is no
legacy Firebase auth module. `src/middleware/auth.ts` — the module the TideCloak auth path
imports — does not import `lib/firebase.ts` at all, so the auth path never touches Firebase
Admin. `lib/firebase.ts` initializes lazily: deployed Cloud Functions use Application Default
Credentials automatically; local development can optionally set
`FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` to use a real Firestore project.

### Roles

The four recognised SOC roles are declared in [`../tidecloak/roles.json`](../tidecloak/roles.json).
Creating these roles in a running TideCloak realm is a separate, not-yet-done step (Phase 1B) —
this backend code recognises them wherever they appear in a token but does not provision them.

## Error Handling

One error type — `HttpError` from `src/lib/errors.ts`. Always pass errors to `next()`; the global `errorHandler` turns them into RFC 9457 Problem Details responses and never leaks internals. The example below is illustrative of the intended pattern once a route needs Firestore — no current route uses `adminDb` yet; see `src/routes/incidents.ts` for today's actual pattern (synthetic data + role gating + explicit field allow-list):

```typescript
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await adminDb
      .collection('items')
      .doc(req.params.id ?? '')
      .get()
    if (!doc.exists) return next(HttpError.notFound('Item', req.params.id))
    res.json({ item: doc.data() })
  } catch (error) {
    next(error) // ← unknown errors become a generic 500
  }
})
```

Available helpers: `HttpError.badRequest()`, `.unauthorized()`, `.forbidden()`, `.notFound()`, `.conflict()`, `.internal()`.

## Conventions (enforced in CI)

`tests/unit/conventions.test.ts` fails the build if:

1. Any file other than `src/lib/firebase.ts` imports `firebase-admin` at runtime
2. Any `src/` file contains `console.log`

## Local Development

```bash
# Watch and recompile TypeScript
pnpm --filter backend run dev
```

There's no local emulator. Deployed Cloud Functions use Application Default Credentials for
Firestore access automatically; if a Firestore-backed feature is being developed locally, set
`FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` in the root `.env` to use a real Firebase project — this is
optional and not required to run the backend otherwise (see `docs/ENV-VARS.md`).

## Deployment

```bash
pnpm --filter backend build
npx firebase-tools deploy --only functions
```

The function is deployed to `australia-southeast1`. Change the region in `src/index.ts`.
