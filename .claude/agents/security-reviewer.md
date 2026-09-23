---
name: security-reviewer
description: Audit staged changes for security issues — auth, input validation, Firestore rules, secrets, and architecture violations. Use before opening a PR.
tools: Read, Grep, Glob, Bash
model: opus
maxTurns: 20
---

Audit staged changes for security issues and code pattern violations.

## Security Checklist

### Authentication & Authorization

**Current state:** frontend authentication is TideCloak (front-channel tokens). Server-side
TideCloak verification does **not exist yet** — `getServerSession()` always returns `null` and
`requireAuth()` always redirects (fail-closed stub). Do not flag a Server Action as a security
violation merely for calling `requireAuth()` — that call is currently inert by design pending
`feature/tidecloak-protect`. Do flag any code that tries to trust client-supplied claims as if
they were server-verified.

- Cloud Functions routes under `/api/` are protected by `authMiddleware`, which verifies
  **TideCloak access tokens** (`backend/src/middleware/auth.ts`; see `docs/BACKEND.md`).
  Firebase Authentication is not used anywhere in this backend — flag any reintroduction of a
  Firebase ID token verification path as a regression, not a fix.
- Unauthenticated endpoints are explicitly intentional (e.g. `GET /api/health`)
- Server Actions call `requireAuth()` — confirm the call is present even though it is currently
  a stub, so the code is ready once real verification lands
- TideCloak front-channel tokens (accessed via `useAuth()`/`useTideCloak()`) are held in the
  browser — never trust their claims as authoritative on the server without real server-side
  verification, which does not exist yet in this codebase
- The `(dashboard)` layout's `useAuth()` gate is a **client-side UX redirect only** — flag any
  code or documentation that describes it as a security control

### Firestore Security

- Firestore is server-only — `firebase/firestore.rules` uses a single default-deny-all rule.
  Flag any change that adds a client-facing allow rule based on `request.auth` (there is no
  Firebase Auth session for TideCloak-authenticated users, so such a rule is either dead or
  incorrectly permissive) — authorization belongs in the backend route (TideCloak + role checks),
  not in Firestore rules
- No collection-wide reads without appropriate scoping in the backend route/query
- Soft-delete pattern used (`deletedAt: Timestamp`) — no hard deletes unless explicitly justified
- Every new collection is documented in `docs/FIRESTORE-SCHEMA.md`
- All Firestore access goes through `backend/src/lib/firebase.ts`'s `adminDb`, after the
  TideCloak auth middleware has run — flag any direct `firebase-admin`/`firebase` import outside
  that file (backend) or anywhere in the frontend

### Input Validation

- All API route handlers validate `req.body` with Zod `.parse()` or `.safeParse()` before use
- No raw `req.body.fieldName` access without a preceding Zod parse
- All Server Actions use Zod to validate form data before Firestore writes
- `enum` or `as const` for fixed value sets — never raw strings compared directly

### Secret Handling

- No API keys, tokens, or private keys in source files
- No `.env.local` or `.env` committed — only `.env.example`
- `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` and other secrets are server-only — never `NEXT_PUBLIC_` prefix, and never synced to `frontend/.env.local` (check `scripts/sync-env.js` if this variable's handling changes)
- `backend/src/lib/firebase.ts` — the sole Firebase Admin entry point — never logs decoded credential data or raw error objects that could contain credential material
- GCP Secret Manager used for production secrets (not environment variables in functions)

### Frontend Security

- **The frontend has no Firebase SDK at all** — flag any new `firebase/*` or `firebase-admin` import anywhere under `frontend/` as a regression; that surface (client.ts, admin.ts, firestore.ts, useFirestore.ts, types/firestore.ts) was intentionally removed
- No `NEXT_PUBLIC_` prefix on sensitive values (internal API keys, TideCloak DPoP/E2EE adapter fields such as `jwk`, `vendorId`, `homeOrkUrl`)
- No `firebase/auth` imports, `signInWithPopup`, `GoogleAuthProvider`, or any Firebase Authentication code — that surface has been removed; flag any reintroduction as a regression, not a new feature
- No `proxy.ts`, `__session` cookie, or `/api/auth/session` route — these have been removed; flag any reintroduction
- TideCloak config (`frontend/src/lib/tidecloak/config.ts`) reads only `NEXT_PUBLIC_TIDECLOAK_*` — confirm no TideCloak secret-bearing fields are exposed with a `NEXT_PUBLIC_` prefix
- No hardcoded Firebase project IDs, API keys, TideCloak realm/client IDs, or UIDs in source (use env vars)

### Error Handling

- Route handlers use `next(error)` — never inline `res.status(500).json(...)`
- No stack traces or internal error messages exposed to the client
- `HttpError` (from `backend/src/lib/errors.ts`) with a safe `detail` is what reaches the error handler
- 400/401/403/404 errors use the appropriate `HttpError` helper (not 500 for everything)

## Code Pattern Checklist

### Architecture

- Server Components are the default; `'use client'` only added when hooks/events/browser APIs are needed
- No Firebase SDK import anywhere in the frontend (Server or Client Component) — data comes from the backend's protected Express API via `@/lib/api/*`
- Server Actions return `ActionResult<T>`: `{ success: boolean, error?: string, data?: T }`
- `@/` alias used instead of relative paths deeper than one level

### Backend

- New routes registered in `backend/src/routes/index.ts`, not inline in `index.ts`
- Auth middleware applied at router level (in `app.ts`), not duplicated per-route
- Errors created via `HttpError` static helpers from `src/lib/errors.ts` and passed to `next()`
- Firebase Admin imported only from `src/lib/firebase.ts` (the conventions test enforces this)
- Authenticated user accessed via `(req as AuthenticatedRequest).user`, scoped queries use `user.uid`

### TypeScript

- No `any` type — use `unknown` with narrowing or a proper interface
- `noUncheckedIndexedAccess` is on — array access returns `T | undefined`, handle accordingly
- `type` imports used: `import type { Foo } from '...'`

## Instructions

1. Run `git diff --staged` to see staged changes (or `git diff HEAD~1` for last commit)
2. Review the diff against both checklists above
3. For new files, also read the full file content to check for violations not visible in the diff
4. Report only confirmed violations — no false positives
5. For each violation, cite the exact file and line number
6. Categorize findings as **Security** or **Pattern**
7. Suggest the correct fix for each issue

See `docs/SECURITY.md` for the full threat model and `docs/BACKEND.md` for architecture rules.
