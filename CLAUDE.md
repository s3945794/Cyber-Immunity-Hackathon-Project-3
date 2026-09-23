# CLAUDE.md — SOC Incident Report Protection

This file provides full context for Claude Code. Read it before making any changes.

---

## Project Overview

**Type:** SOC Incident Report Protection application. Originally forked from a Firebase-based
student capstone boilerplate; frontend authentication has been migrated to TideCloak.
**Purpose:** Protect SOC incident reports with TideCloak-backed identity, Firestore as the
database, and (future) role-based access control, server-side JWT verification, encryption,
approval workflows and audit logging.

New to the repo? Read `docs/GUIDE.md` — it walks through the current setup.

---

## Tech Stack

| Layer              | Technology                                                                                                                                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend framework | Next.js 16 (App Router, React 19)                                                                                                                                                                                                                                                                                                |
| Language           | TypeScript 5 — strict mode                                                                                                                                                                                                                                                                                                       |
| Styling            | Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)                                                                                                                                                                                                                                                                      |
| UI components      | Raw Tailwind (shadcn can be added per project)                                                                                                                                                                                                                                                                                   |
| Backend            | Firebase Cloud Functions v2 (Express fat-lambda)                                                                                                                                                                                                                                                                                 |
| Database           | Firestore — unchanged by the auth migration                                                                                                                                                                                                                                                                                      |
| Auth (frontend)    | **TideCloak** — login, logout, callback (`/auth/redirect`), silent SSO implemented. Firebase Authentication, `proxy.ts`, `__session` cookie **removed**.                                                                                                                                                                         |
| Auth (server-side) | Backend now verifies **TideCloak** JWTs (not Firebase ID tokens) and extracts recognised SOC roles from them — see `docs/BACKEND.md`. Frontend Server Action helpers `getServerSession()`/`requireAuth()` (`frontend/src/actions/auth.actions.ts`) remain fail-closed placeholders — unrelated to the backend/RBAC status below. |
| Package manager    | pnpm workspaces — **always use pnpm, never npm or yarn**                                                                                                                                                                                                                                                                         |
| Testing            | Vitest + Testing Library (frontend) · Vitest + supertest (backend)                                                                                                                                                                                                                                                               |
| Git hooks          | Lefthook (commit-msg: Conventional Commits · pre-commit: lint + format)                                                                                                                                                                                                                                                          |
| CI/CD              | GitHub Actions                                                                                                                                                                                                                                                                                                                   |

---

## Repository Structure

```
/
├── frontend/          Next.js 16 App Router (deploys to Vercel)
├── backend/           Cloud Functions v2 Express fat-lambda
├── firebase/          Firestore rules, indexes
├── docs/              Architecture and conventions docs (start with GUIDE.md)
├── scripts/           Utility scripts (bootstrap, validate-placeholders, migrations)
├── tidecloak/         Local TideCloak config (SOC PoC) — see docs/TIDECLOAK-LOCAL.md
└── .claude/           Claude Code harness (agents, skills, MCP, settings, hooks)
```

**Nested instructions** are loaded automatically when editing files in a package:

- `frontend/CLAUDE.md` — Next.js 16, App Router, Server Components, auth flow, design reference
- `backend/CLAUDE.md` — Express fat-lambda, route pattern, error handling, testing

---

## Codebase Map — read this instead of exploring

Everything a feature build needs already exists below. **Do not survey the codebase before implementing** — consult this map, then Read only the files you will edit.

### Frontend building blocks

| File                                             | Exports                                                                                                                         | Use for                                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `frontend/src/actions/auth.actions.ts`           | `getServerSession()` → `null`, `requireAuth()` → redirects                                                                      | **Placeholders** — server-side TideCloak verification lands in `feature/tidecloak-protect`; fail closed until then |
| `frontend/src/lib/tidecloak/config.ts`           | `getTideCloakConfig()`, `isTideCloakConfigured()`                                                                               | Builds the `<TideCloakProvider>` config from `NEXT_PUBLIC_TIDECLOAK_*` env vars                                    |
| `frontend/src/providers/AuthProvider.tsx`        | `AuthProvider` (wraps `<TideCloakProvider>`), `useAuthContext`                                                                  | Root client auth provider — TideCloak SDK init + `useAuth()` bridge                                                |
| `frontend/src/lib/firebase/admin.ts`             | `adminAuth`, `adminDb` (lazy, `server-only`)                                                                                    | All server-side Firebase (Firestore)                                                                               |
| `frontend/src/lib/firebase/client.ts`            | `getClientApp()`, `getClientDb()`                                                                                               | Browser Firestore SDK (Client Components only)                                                                     |
| `frontend/src/lib/firebase/firestore.ts`         | `getUsersCollection()`, `userDoc(uid)` — add new collections here as `get{X}Collection()` (`typedCollection` is module-private) | Typed collection access                                                                                            |
| `frontend/src/hooks/useFirestore.ts`             | `useCollection(ref, ...constraints)` → `{ data, loading, error }` (onSnapshot)                                                  | Realtime lists in Client Components                                                                                |
| `frontend/src/hooks/useAuth.ts`                  | `useAuth()` → `{ user: { uid, username, email } \| null, authenticated, loading, login, logout }`                               | Current user + auth actions in Client Components (TideCloak)                                                       |
| `frontend/src/types/index.ts`                    | `ActionResult<T>` `{ success, error?, data? }` + re-exports of `types/auth.ts`, `types/firestore.ts`                            | Return type of every Server Action                                                                                 |
| `frontend/src/types/firestore.ts`                | `UserProfile` — add new collection interfaces here (always with `_schemaVersion: 1`)                                            | Collection types                                                                                                   |
| `frontend/src/lib/validations/`                  | `idSchema`, `paginationSchema` (`common.ts`)                                                                                    | Zod schemas — add feature schemas here or in the feature folder                                                    |
| `frontend/src/lib/utils.ts`                      | `cn()`, `formatDate`, `formatDatetime`, `truncate`                                                                              | Class merging, formatting                                                                                          |
| `frontend/src/components/layout/`                | `DashboardShell`, `Sidebar` (navItems array — add links here), `Navbar`, `PageHeader`                                           | App shell                                                                                                          |
| `frontend/src/components/shared/`                | `ErrorBoundary`, `LoadingSpinner`, `FullPageSpinner`, `EmptyState { title, description?, icon?, action? }`                      | Loading/empty/error states                                                                                         |
| `frontend/src/app/(auth)/auth/redirect/page.tsx` | TideCloak post-login callback (`useAuthCallback` → PKCE token exchange → redirect)                                              | `/auth/redirect` — must be a `Valid redirect URI` on the TideCloak client                                          |

### Backend building blocks

| File                                     | Exports                                                                                                                                             | Use for                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `backend/src/app.ts`                     | `createApp({ verifyToken? })`                                                                                                                       | Composition; tests inject mock auth                               |
| `backend/src/middleware/auth.ts`         | `AuthenticatedRequest` (`.user` = `AuthUser { uid, email, claims, roles }`), `VerifyToken`, `verifyTideCloakToken`, `requireRole`, `requireAnyRole` | Authed user in routes; no Firebase import                         |
| `backend/src/middleware/firebaseAuth.ts` | `verifyFirebaseToken` (legacy, not wired into `createApp()`)                                                                                        | Legacy Firebase ID token verification, isolated                   |
| `backend/src/lib/errors.ts`              | `HttpError` + statics `badRequest/unauthorized/forbidden/notFound/conflict/internal`                                                                | All route errors, via `next(...)`                                 |
| `backend/src/lib/firebase.ts`            | `adminAuth`, `adminDb`                                                                                                                              | Sole Firebase Admin entry (CI-enforced)                           |
| `backend/src/lib/zodConverter.ts`        | `createZodConverter(schema, version, migrate?)`                                                                                                     | Typed Firestore reads with `_schemaVersion`                       |
| `backend/src/routes/index.ts`            | `apiRouter` — mount new routers here                                                                                                                | Route registry                                                    |
| `backend/tests/setup.ts`                 | `mockVerifyToken`, `mockUser`                                                                                                                       | Route unit tests (mocked Firebase Admin — no real Firebase calls) |

### Firestore rules helpers (`firebase/firestore.rules`)

`isAuthenticated()` · `isOwner(uid)` · `isAdmin()` (Firestore read) · `hasCustomClaim(claim)` (no read) · `notDeleted()`

### Existing routes/pages

Pages: `/` · `/auth/signin` · `/auth/signup` · `/auth/redirect` (TideCloak callback) · `/dashboard` · `/profile` · `/settings` · `/access-denied` (route groups `(auth)`, `(dashboard)`). Auth: **TideCloak** front-channel — `/auth/signin` & `/auth/signup` are "Continue with TideCloak" buttons (no password fields). The `(dashboard)` layout is wrapped in `RoleGuard` (`frontend/src/components/auth/RoleGuard.tsx`), which accepts any of the four recognised SOC roles — this is a UX gate only, not a security boundary. An authenticated user without a recognised SOC role sees `/access-denied`. Firebase Auth, the `__session` cookie, `proxy.ts` and `/api/auth/session` have been removed from the frontend. Backend: `GET /api/health` (public); everything else under `/api` requires `Authorization: Bearer <TideCloak access token>`, verified by `backend/src/middleware/auth.ts` (`verifyTideCloakToken`) — Firebase ID token verification is legacy and no longer wired into `createApp()`. `requireRole`/`requireAnyRole` are available role-membership guards but are not yet applied to any route — `/api/me` remains authentication-only by design, and no feature API exists yet to gate.

---

## MCP Servers

Run `/mcp` in Claude Code to view and configure. Three servers are pre-configured:

| Server       | Purpose                                                                              | Setup                          |
| ------------ | ------------------------------------------------------------------------------------ | ------------------------------ |
| **context7** | Up-to-date library docs (Next.js, Firebase, Tailwind, etc.)                          | No auth needed                 |
| **firebase** | 30+ Firebase tools — deploy rules, query Firestore, manage auth users                | Run `firebase login`           |
| **stitch**   | Google Stitch design-to-code — fetch design tokens, screen code from Stitch projects | Set `STITCH_API_KEY` in `.env` |

**Usage tips:**

- Say "use context7" when asking about library APIs to get current docs
- Use the Firebase MCP to inspect Firestore data or deploy rules without leaving Claude Code
- Use the Stitch MCP to import UI designs: "fetch the design tokens from my Stitch project"

---

## Sub-agents

Sub-agents run in their own isolated context with a tailored system prompt. Claude delegates to them automatically, or you can invoke them by name:

| Agent               | Description                                                                                                                               | Model  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `doc-auditor`       | Audits skills, docs, and CLAUDE.md for drift against the actual codebase. Use before a PR or after a major refactor.                      | Opus   |
| `security-reviewer` | Audits staged changes for auth, input validation, Firestore rules, secret handling, and architecture violations. Use before opening a PR. | Opus   |
| `test-writer`       | Writes Vitest unit tests for a given file matching project conventions (supertest for backend, Testing Library for frontend).             | Sonnet |

**Usage examples:**

- "Use the security-reviewer agent to audit my staged changes before I open this PR"
- "Use the doc-auditor agent to check if the skills are still accurate"
- "Use the test-writer agent to write tests for `backend/src/routes/health.ts`"

---

## Available Skills

Run these with `/skill-name` in Claude Code:

**Setup**

| Skill        | Description                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/bootstrap` | Full local setup: prerequisites → install → .env (walks you through creating a free Firebase project) → dev server → auth smoke test |

**Scaffolding**

| Skill                  | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| `/new-feature`         | Scaffold a feature module (types, hook, Server Actions, component)        |
| `/new-page`            | Create a Next.js App Router page in the correct route group               |
| `/new-component`       | Create a React component (Server or Client) with typed props              |
| `/firebase-collection` | Add a typed Firestore collection (type + rules + hook + docs)             |
| `/add-auth-provider`   | Configure an identity provider through the TideCloak realm (not Firebase) |
| `/add-route`           | Add a Cloud Functions Express route with tests                            |
| `/evolve-schema`       | Safely evolve a Firestore collection schema                               |
| `/add-env-var`         | Add an env var consistently across packages and docs                      |

**Quality & verification**

| Skill                                     | Description                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `/verify`                                 | Full pipeline: lint → typecheck → test → console.log scan → READY/NOT READY verdict |
| `/checkpoint create\|verify\|list [name]` | Mark stable milestones, compare against them later                                  |
| `/save-session [name]`                    | Save session state (8-section format) to `.claude/sessions/`                        |
| `/resume-session [name]`                  | Load a saved session and resume from exact stopping point                           |

**Git workflow**

| Skill          | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `/git-feature` | Create `feature/*` branch from `main` + draft PR back to `main` |
| `/git-hotfix`  | Create `hotfix/*` branch from `main` + PR back to `main`        |
| `/git-release` | Tag the current `main` as a milestone/submission checkpoint     |

---

## Agent Permissions

**CAN do autonomously:**

- Create feature branches from `main` and commit/push to them
- Create draft PRs targeting `main`
- Read, edit, and create files within the repo
- Run `pnpm` commands (lint, typecheck, test, build)
- Use MCP tools (context7, firebase, stitch)

**CANNOT do without explicit user approval:**

- Merge or close PRs
- Push to `main` directly
- Delete branches
- Deploy to production (`firebase deploy`)
- Modify CI/CD workflow files

---

## Critical Conventions

### Package manager

Always use `pnpm`. Run commands as:

- `pnpm install` (not `npm install`)
- `pnpm --filter frontend add {package}`
- `pnpm --filter backend add {package}`
- `pnpm -r lint` (run across all packages)

### TypeScript

- Strict mode is on. **Never use `any`** — use `unknown` and narrow.
- `noUncheckedIndexedAccess` is on — array index access returns `T | undefined`.
- Use `type` imports: `import type { Foo } from '...'`
- The `@/` alias maps to `frontend/src/`. Always use it — never relative paths more than one level deep.

### React / Next.js

- **Server Components by default** — all files in `app/` are Server Components unless `'use client'` is at the top.
- Add `'use client'` only when you actually need: React hooks, event handlers, or browser APIs.
- Never import `firebase/auth` or `firebase/firestore` in a Server Component — these are client-only SDKs.
- For server-side Firebase, always use `@/lib/firebase/admin` (imports `server-only`).
- Server Actions return `ActionResult<T>`: `{ success: boolean, error?: string, data?: T }`.
- Use `sonner` (`toast` from `sonner`) for all user-facing notifications.

### Firestore

- Every collection has a typed collection export in `frontend/src/lib/firebase/firestore.ts`.
- Every collection has security rules in `firebase/firestore.rules`.
- Every collection is documented in `docs/FIRESTORE-SCHEMA.md`.
- Always call `requireAuth()` in Server Actions before any Firestore operation. Note: `requireAuth()` is currently a fail-closed stub (always redirects) — it does not yet verify a real TideCloak session. Server Actions that need identity are effectively disabled until `feature/tidecloak-protect` lands.
- Use the soft-delete pattern (add `deletedAt: Timestamp`) instead of hard deletes.

### Backend (Cloud Functions)

- All routes under `/api/` (except `/api/health`) are protected by the auth middleware — it verifies a **TideCloak access token** (`verifyTideCloakToken` in `backend/src/middleware/auth.ts`) and extracts recognised SOC roles onto `req.user.roles`. Legacy Firebase ID token verification (`middleware/firebaseAuth.ts`) is isolated and not wired into `createApp()`. `requireRole(role)` and `requireAnyRole(...roles)` are available role-membership guards — see `docs/BACKEND.md`. `/api/me` stays authentication-only (no role gate) by design; the emergency-access request, two-person approval, protected-evidence and access-expiry workflows are **not implemented yet**.
- Access the authenticated user via `(req as AuthenticatedRequest).user` — `{ uid, email, claims }`.
- Error handling: pass `HttpError` (from `src/lib/errors.ts`) to `next()` — never inline `res.status(500)`.
- Import Firebase Admin only from `src/lib/firebase.ts` — enforced by the conventions test.
- Unit tests use supertest + mocked Firebase Admin (no real Firebase calls).

### Git

- Branch from `main` for everything (`feature/*`, `hotfix/*`). Never commit directly to `main`.
- Commit messages must follow Conventional Commits — enforced by the `commit-msg` hook.
- Use `/git-feature`, `/git-hotfix`, `/git-release` skills for branch management.

### Harness integrity

- When you change a code pattern that is documented in `.claude/skills/` or `docs/`, update those files in the same session — never let them drift.
- When you add or move a core export (lib, hooks, middleware), update the **Codebase Map** section above in the same session — it is what keeps future sessions from re-exploring the repo. The `doc-auditor` agent checks it for drift.
- Skills and agents must discover files dynamically using `Glob` or `Grep` — never hardcode file lists or paths that will break when files move. (The Codebase Map is the one deliberate exception, maintained by the rule above.)

---

## High-Value Tide Learning Log

`docs/tide-mcp-learning.txt` is a curated log of **high-value findings about Tide, Tide MCP, TideCloak, or the Tide Cybersecurity Fabric**. It is for reuse by this developer, by future Tide developers, and for review by the client (Tide). Keep it small and high-signal.

**Recording gate — add an entry only when all four are true:**

1. The issue is directly connected to Tide, Tide MCP, TideCloak, or the Tide Cybersecurity Fabric.
2. There is clear evidence — an error, an unexpected tool result, a missing instruction, or repeatable behaviour.
3. The issue has a meaningful effect on security, correctness, development time, or future Tide integrations.
4. The entry gives a useful workaround, solution, or actionable improvement for Tide.

An important **security** problem may be recorded immediately, even if found quickly.

**Do not record:** user typos or wrong commands, wrong-directory mistakes, a forgotten service, missing local software, ordinary bugs in this project's own code, a first failed coding attempt, simple errors solved quickly, general unfamiliarity, Claude Code / Kiro issues unrelated to Tide, or local Windows / Docker / network problems unless a Tide instruction directly caused them. If the issue was mainly caused by the user or by ordinary project code, it does not belong in the log.

**When writing an entry:** follow the file's existing structure — include evidence, impact, investigation, solution or workaround, and verification. Separate confirmed facts from inferences; write "Root cause not confirmed" when the cause is unknown. **Update the original entry** once a solution is found instead of adding a duplicate.

**Never** store secrets (passwords, tokens, cookies, keys, session values) or private AI reasoning in the log.

**For this project:** do not access Gmail. Avoid repeatedly loading large Tide canon documents when focused, section-level guidance is available.

---

## What To Avoid

- `npm` or `yarn` — use `pnpm`
- `any` in TypeScript — use `unknown` + type narrowing
- `pages/` directory — this is App Router only
- `firebase/compat` — modular SDK only
- Firebase Cloud Storage — removed from this boilerplate; it requires the paid Blaze plan. Store file metadata in Firestore, or use a free third-party host, if a feature needs uploads.
- Local Firebase emulators — not part of this setup; the app always talks to your real (free Spark-plan) Firebase project. **Scoped exception:** this project runs a local **TideCloak** identity server in one Docker container (`docker-compose.tidecloak.yml`, `pnpm run tidecloak:*`) for frontend authentication. The frontend, backend and Firestore are still never containerised. See `docs/TIDECLOAK-LOCAL.md`.
- `NEXT_PUBLIC_` prefix on secret values (service account, API keys)
- Committing `.env.local` or `.env` — they are gitignored
- Committing directly to `main`
- Inline styles — use Tailwind classes
- CSS-in-JS (styled-components, emotion) — not part of this stack

---

## Environment Variables

**Single source of truth: the root `.env`** (template: `.env.example`). `pnpm run env:sync` (`scripts/sync-env.js`) generates `frontend/.env.local` and `backend/.env` from it — those files are generated output, never edit them directly. The sync runs automatically before `pnpm run dev`.

When adding a variable, use the `/add-env-var` skill — it updates `.env.example`, `scripts/sync-env.js`, and `docs/ENV-VARS.md` together. See `docs/ENV-VARS.md` for the full variable reference.

---

## Running the Project

```bash
pnpm install              # Install all workspace dependencies
pnpm run validate         # Check for unreplaced template placeholders
pnpm run dev              # Start the frontend dev server (talks to your real Firebase project)
pnpm run test             # Backend unit tests (mocked Firebase Admin)
pnpm run test:component   # Frontend unit tests
pnpm run test:all         # All tests
pnpm run lint             # ESLint across all packages
pnpm run typecheck        # TypeScript check across all packages
```

---

## Remaining Migration Work

This repo was originally a generic Firebase-based student capstone boilerplate. The frontend
auth migration to TideCloak is done. Backend TideCloak JWT verification and role-membership
guards are also done:

- Backend `middleware/auth.ts` verifies TideCloak access tokens (`verifyTideCloakToken`), not
  Firebase ID tokens, and extracts the four recognised SOC roles onto `req.user.roles`.
- `requireRole(role)` and `requireAnyRole(...roles)` exist as tested, reusable role-membership
  guards. Neither is wired to a feature route yet — there is no feature API to gate, and
  `/api/me` intentionally stays authentication-only.
- The frontend `(dashboard)` layout is gated by `RoleGuard`, which admits any of the four SOC
  roles and shows `/access-denied` for an authenticated user without one.

Known gaps still open:

1. **`getServerSession()`/`requireAuth()`** in `frontend/src/actions/auth.actions.ts` remain
   fail-closed placeholders — Server Actions that need identity are still effectively disabled.
2. **Emergency-access request workflow** — not implemented.
3. **Two-person approval workflow** (a requester cannot approve their own request; two distinct
   other SOC staff members must approve; role alone never grants access) — not implemented.
4. **Protected-evidence access** (requires two valid approvals, correct requester, approved
   incident/resource/permission, and an active, unexpired access period) — not implemented.
5. **Encryption, audit logging** — not started.

Run `pnpm run validate` before committing — must return zero errors.
