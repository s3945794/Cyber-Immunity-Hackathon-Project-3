# Backend

## Overview

The backend is an **Express API**. The approved runtime is the local Docker/native listener. A Firebase Cloud Functions v2 `api` export is retained as a hosting entry point; it is not evidence of a deployed Cloud Function. The local entry point is server.ts. Local emulation is not production storage.

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

Incidents and persisted workflow routes are also current; see the complete workflow table below. /api/me is authentication-only; incidents and workflow routes additionally require recognised SOC membership.

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
used now by AccessService/FirestoreStore for requests, decisions, cancellation, history and audit. Firebase Authentication is not used anywhere in this backend; there is no
legacy Firebase auth module. `src/middleware/auth.ts` — the module the TideCloak auth path
imports — does not import `lib/firebase.ts` at all, so the auth path never touches Firebase
Admin. `lib/firebase.ts` initializes lazily: deployed Cloud Functions use Application Default
Credentials automatically; local development can optionally set
`FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` to use a real Firestore project.

### Roles

The four recognised SOC roles are declared in [`../tidecloak/roles.json`](../tidecloak/roles.json).
The owner’s existing realm has recognised staff accounts used in local workflow checks. This code recognises role claims but does not provision roles/accounts; independent fresh-realm setup remains unverified. All four roles are equal membership labels.

## Error Handling

One error type — `HttpError` from `src/lib/errors.ts`. Always pass errors to `next()`; the global `errorHandler` turns them into RFC 9457 Problem Details responses and never leaks internals. The example below illustrates generic storage error handling; actual workflow reads/writes use access/store.ts transactions and access/service.ts invariants. Incident summaries separately remain synthetic and explicitly allow-listed:

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

The watch command only recompiles; it does not start the listener or database. Use the runbook's demo:emulator and demo:backend scripts, or the approved local Docker procedure. Explicit demo mode never falls back to cloud/ADC when emulation is unavailable. Real cloud storage is a separate unapproved environment, not a setup prerequisite.

## Deployment

```bash
pnpm --filter backend build
# Cloud deployment is not approved for the current local scope.
```

The function is deployed to `australia-southeast1`. Change the region in `src/index.ts`.

## Persisted emergency access workflow (implemented; Tide authority incomplete)

This stage adds server-only Firestore requests and a native listener. See
SOC-POC-RUNBOOK.md for authorised local emulator startup; the Cloud Function export
remains intact. Owner local Docker workflow and persistence passed; no cloud deployment is claimed.

| Method / path                                  | Behaviour                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET /api/access/config                         | Recognised member receives allowed durations in seconds and authorityAvailable=false            |
| POST /api/requests                             | Strict create input; UUID Idempotency-Key required                                              |
| GET /api/requests                              | Signed-in request history, bounded pages with optional before cursor                            |
| GET /api/requests/:id                          | Safe request details available to recognised SOC users for review/audit                         |
| GET /api/approvals                             | Pending requests eligible for this other, not-yet-approved user                                 |
| POST /api/requests/:id/decisions               | Strict approve or reject-with-reason; UUID operation ID                                         |
| POST /api/requests/:id/cancel                  | Empty body; requester-only pending cancellation; UUID operation ID                              |
| GET /api/access/incidents/:incidentId/requests | This user's latest safe scope state for each incident resource                                  |
| GET /api/audit                                 | Read-only application audit, bounded cursor pages                                               |
| POST /api/requests/:id/evidence                | Strict incident/resource/read correlation; always denies until verified Tide integration exists |

Create JSON fields are incidentId, resource, permission, reason, durationSeconds
and acknowledged. Unknown requester IDs, roles, status, timestamps, approvals and
grant fields are rejected. Resources are victimHost/exposureEvidence/suspiciousProcess;
permission is read; reason is trimmed and has 20–500 characters; acknowledgement
is true. Normal durations are 900/1800/3600 seconds. Optional 60 is enabled only by
trusted demo configuration.

All four recognised SOC roles are equal membership labels. The requester cannot
review themselves; two different other users approve. Each reviewer decides once.
Decisions and cancellation are transactional and idempotent. A single valid
rejection closes pending state. Two approvals produce authorising with a blocked
authority job, never active. No Tide call occurs in a retrying transaction.

Responses use no-store. CORS permits configured-origin preflight before auth and
the required Idempotency-Key header; protected operations still verify tokens.
Malformed JSON is 400; oversized bodies are 413; conflicts are 409; unavailable
storage/authority is 503. Provider error bodies/stacks are not logged or returned.

Production FirestoreStore is injected through createApp composition. MemoryStore
and identity mocks exist only under tests/support and unit tests. They are not
runtime alternatives. See FIRESTORE-SCHEMA.md and SOC-TIDE-CAPABILITIES.md.
