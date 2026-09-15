# SOC Incident Report Protection

> Next.js + TideCloak + Firestore application for protecting SOC incident reports. Originally forked from a Firebase-based student boilerplate; authentication has been migrated to TideCloak.

**New here? Read the [step-by-step guide](docs/GUIDE.md)** — it walks through the current setup. The system diagrams are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Note for the PR** if you cannot merge your pr is because there is a high veulnerability and the system doesn't allow for pr with high vulnerabilities to be merged. Instructions are below to fix this.

## Stack

|                           |                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**              | Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind v4                                                                                                          |
| **Backend**               | Firebase Cloud Functions v2 · Express (single "fat lambda")                                                                                                              |
| **Database**              | Firestore                                                                                                                                                                |
| **Auth (frontend)**       | TideCloak — login, logout, callback and silent SSO are implemented. Server-side JWT verification and RBAC are **not yet implemented** — see `feature/tidecloak-protect`. |
| **Local identity server** | TideCloak runs in a single local Docker container for development — see [docs/TIDECLOAK-LOCAL.md](docs/TIDECLOAK-LOCAL.md)                                               |
| **Package manager**       | pnpm workspaces — always `pnpm`, never `npm`/`yarn`                                                                                                                      |
| **Testing**               | Vitest · Testing Library · supertest                                                                                                                                     |
| **Quality gates**         | Lefthook (Conventional Commits, lint, format) · GitHub Actions CI                                                                                                        |

Firestore is used directly by the frontend (client SDK) and the Admin SDK (server-side) — there's no local Firestore emulator, so the app always talks to a real Firebase project. Firebase Cloud Storage isn't used either; store file metadata in Firestore or use a free third-party host if a feature needs uploads.

## Quick Start

### 0. Prerequisites

- **Node.js 22** — [nodejs.org](https://nodejs.org)
- **pnpm** — `npm install -g pnpm`
- **Docker Desktop** — required only for the local TideCloak container (see [docs/TIDECLOAK-LOCAL.md](docs/TIDECLOAK-LOCAL.md))
- No Firebase CLI install needed — `npx firebase-tools` runs it on demand for rule deploys

### 1. Bootstrap

```bash
git clone https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git my-project
cd my-project
pnpm run bootstrap
```

Bootstrap installs dependencies, creates the root `.env` from `.env.example` (only if missing), and generates the per-package env files.

### 2. Connect Firebase (Firestore) — one env file

**All env values live in the root `.env`.** `frontend/.env.local` and `backend/.env` are generated from it by `pnpm run env:sync` (runs automatically before `pnpm run dev`) — never edit them by hand.

Create a project at [console.firebase.google.com](https://console.firebase.google.com) — the free Spark plan is enough, no billing required — then:

1. Create a **Firestore** database
2. Register a **web app** (Project settings → Your apps → Web) and copy each `firebaseConfig` value into the matching `NEXT_PUBLIC_FIREBASE_*` variable in `.env`
3. Generate a **service account key** (Project settings → Service accounts), base64-encode it, and set `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` in `.env`:
   ```bash
   # macOS (BSD base64 — no -w flag)
   base64 -i service-account.json | tr -d '\n'
   # Linux (GNU base64)
   base64 -w 0 service-account.json
   # Windows PowerShell (single quotes around the path)
   [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\to\service-account.json'))
   ```
4. Set `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env` and the same id in `.firebaserc` (`projects.default`)

Full variable reference: [docs/ENV-VARS.md](docs/ENV-VARS.md).

### 3. Connect TideCloak (frontend authentication)

Start the local TideCloak container and provision a realm/client — see [docs/TIDECLOAK-LOCAL.md](docs/TIDECLOAK-LOCAL.md) for the full walkthrough. Set the `NEXT_PUBLIC_TIDECLOAK_*` variables in `.env` from the realm and client you create.

### 4. Run

```bash
pnpm run dev
```

- App → [http://localhost:3000](http://localhost:3000)

Restart the dev server after changing `.env` — `NEXT_PUBLIC_*` variables are baked in at startup.

## Current functionality

- TideCloak frontend login, logout, post-login callback (`/auth/redirect`), and silent SSO (`/silent-check-sso.html`) are implemented and working end to end.
- The dashboard route group is gated **client-side** via `useAuth()` — this is a UX gate, not a security boundary.
- Firestore remains the application database, accessed via the Admin SDK (server) and the client SDK (browser), unchanged by the TideCloak migration.

## Not yet implemented

- **Server-side TideCloak JWT verification** — Server Actions and the backend API do not yet verify TideCloak tokens. `getServerSession()`/`requireAuth()` are fail-closed placeholders.
- **Role-based access control (RBAC)** — the four SOC roles are declared in `tidecloak/roles.json` but not yet created in the realm, and no code reads roles from a token yet.
- **Backend API protection** — `backend/`'s auth middleware still verifies Firebase ID tokens, not TideCloak tokens; it has not been reconnected to the new frontend auth.
- **Encryption, approval workflows, and audit logging** for incident reports — not started.

This work is tracked under `feature/tidecloak-protect`.

## Troubleshooting

| Symptom                                                 | What to try                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Firebase web config is incomplete" on Vercel           | A `NEXT_PUBLIC_FIREBASE_*` env var is missing in Vercel. Add it under Project Settings → Environment Variables (same names as your local `.env`), then redeploy — existing deployments don't pick up new env vars automatically. See [docs/CI-CD.md § Vercel Setup](docs/CI-CD.md#vercel-setup-frontend). |
| `Invalid project id: REPLACE_WITH_...`                  | Set the real project id in `.firebaserc`.                                                                                                                                                                                                                                                                 |
| `'next' is not recognized` / `Command "next" not found` | Run `pnpm install` from the **repo root**. If it persists, delete all `node_modules` folders and reinstall.                                                                                                                                                                                               |
| Ignored build scripts warning from pnpm                 | Build approvals live in `pnpm-workspace.yaml` (`allowBuilds`) — re-run `pnpm install`.                                                                                                                                                                                                                    |
| "Missing or insufficient permissions"                   | Firestore security rules don't allow that access — add rules in `firebase/firestore.rules`, then deploy them (`npx firebase-tools deploy --only firestore:rules`).                                                                                                                                        |
| TideCloak login loops back to `/auth/signin`            | Check the TideCloak server log for the OAuth error code. See `docs/tide-mcp-learning.txt` for previously diagnosed causes (DPoP, silent-SSO iframe framing).                                                                                                                                              |
| Commit rejected                                         | Message must be Conventional Commits (`feat: …`, `fix: …`).                                                                                                                                                                                                                                               |

## Project Structure

```
/
├── frontend/          Next.js 16 App Router
│   └── src/
│       ├── app/       Pages (route groups: (auth), (dashboard))
│       ├── components/ UI components (layout, shared)
│       ├── features/  Feature modules (one folder per business domain)
│       ├── lib/       Firebase client/admin (lazy init), TideCloak config, validations, utils
│       ├── hooks/     Custom React hooks
│       ├── providers/ React context providers (TideCloak auth bridge)
│       ├── actions/   Next.js Server Actions
│       └── types/     TypeScript type definitions
├── backend/           Cloud Functions v2 — Express fat-lambda
│   └── src/
│       ├── app.ts     Express app factory
│       ├── routes/    One file per resource
│       ├── middleware/ auth (Firebase ID token → req.user — not yet TideCloak), errorHandler (RFC 9457)
│       └── lib/       firebase (Admin singleton), errors (HttpError), zodConverter
├── firebase/          Firestore rules, indexes
├── tidecloak/         Local TideCloak config and declared SOC realm roles
├── docs/              Guides and reference docs — start with GUIDE.md
└── .claude/           Claude Code harness (agents, skills, MCP, hooks)
```

## Commands

```bash
pnpm run bootstrap        # First-time: install deps, env templates
pnpm run dev              # Frontend dev server (talks to your real Firebase project)
pnpm run build            # Build all packages
pnpm run test             # Backend unit tests (mocked Firebase Admin)
pnpm run test:component   # Frontend unit tests
pnpm run test:all         # All tests
pnpm run lint             # ESLint across all packages
pnpm run format           # Prettier across all packages
pnpm run typecheck        # TypeScript check across all packages
pnpm run env:sync         # Regenerate frontend/backend env files from root .env
pnpm run validate         # Check for unreplaced template placeholders
pnpm run tidecloak:start  # Start the local TideCloak container
pnpm run tidecloak:stop   # Stop it (keeps ./data)
pnpm run tidecloak:status # Container state + HTTP probe
pnpm run tidecloak:logs   # Follow container logs
```

## Security

Security is enforced in independent layers — Claude Code guard hooks, HTTP hardening (helmet/CORS/rate limits), TideCloak frontend authentication, Zod input validation, default-deny Firestore rules, and CI scanning (`pnpm audit`). Server-side token verification and RBAC are not yet implemented — see [docs/SECURITY.md](docs/SECURITY.md) for the current, honest state of each layer.

### Known `pnpm audit` findings (manual fix)

`pnpm audit` currently flags two high-severity CVEs — both transitive, dev/build-time only, not runtime-reachable:

| Package   | Issue                                                     | Pulled in by                                                   |
| --------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `js-yaml` | CVE-2026-59870 — quadratic CPU DoS on `!!omap` resolution | eslint's dependency chain (lint-time only)                     |
| `nanoid`  | Infinite loop when a custom generator's `size` is 0       | postcss, used by Tailwind/Next/Vitest builds (build-time only) |

To patch: add these two lines under `overrides:` in `pnpm-workspace.yaml`, then run `pnpm install`:

```yaml
js-yaml: '^4.3.1'
nanoid: '^3.3.18'
```

Confirm with `pnpm audit` — should show 0 high/critical findings.

## Git Workflow

| Branch      | Purpose                                  |
| ----------- | ---------------------------------------- |
| `main`      | Production — protected, no direct pushes |
| `feature/*` | New features → PR back to `main`         |
| `hotfix/*`  | Urgent fixes → PR back to `main`         |

Use the Claude Code skills `/git-feature`, `/git-hotfix`, `/git-release`. Details: [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md).

## Claude Code Harness

The repo ships a pre-configured harness: three MCP servers (**context7** for live library docs, **firebase** for Firestore/deploy tooling, **stitch** for design-to-code), three sub-agents (**security-reviewer**, **doc-auditor**, **test-writer**), enforcement hooks (blocks `any`, secret prefixes, direct pushes to `main`, unapproved deploys), and skills for scaffolding and quality:

| Category    | Skills                                                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup       | `/bootstrap` — guided end-to-end local setup with verification                                                                                     |
| Scaffolding | `/new-feature` · `/new-page` · `/new-component` · `/firebase-collection` · `/add-auth-provider` · `/add-route` · `/evolve-schema` · `/add-env-var` |
| Quality     | `/verify` · `/checkpoint` · `/save-session` · `/resume-session`                                                                                    |
| Git         | `/git-feature` · `/git-hotfix` · `/git-release`                                                                                                    |

See [CLAUDE.md](CLAUDE.md) for the full harness reference.

## Documentation

| Topic                           | Link                                                     |
| ------------------------------- | -------------------------------------------------------- |
| **Beginner guide (start here)** | [docs/GUIDE.md](docs/GUIDE.md)                           |
| Architecture + diagrams         | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)             |
| Frontend conventions            | [docs/FRONTEND.md](docs/FRONTEND.md)                     |
| Backend conventions             | [docs/BACKEND.md](docs/BACKEND.md)                       |
| Design system                   | [docs/DESIGN.md](docs/DESIGN.md)                         |
| Firestore schema                | [docs/FIRESTORE-SCHEMA.md](docs/FIRESTORE-SCHEMA.md)     |
| Environment variables           | [docs/ENV-VARS.md](docs/ENV-VARS.md)                     |
| TideCloak local development     | [docs/TIDECLOAK-LOCAL.md](docs/TIDECLOAK-LOCAL.md)       |
| Testing                         | [docs/TESTING.md](docs/TESTING.md)                       |
| Security                        | [docs/SECURITY.md](docs/SECURITY.md)                     |
| Git workflow                    | [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md)             |
| CI/CD & deployment              | [docs/CI-CD.md](docs/CI-CD.md)                           |
| Tide MCP learning log           | [docs/tide-mcp-learning.txt](docs/tide-mcp-learning.txt) |

## Deployment

The frontend deploys to **Vercel** (free Hobby tier, no billing account needed — this app is server-rendered, so it needs a server host, not static hosting).
Use this to deploy to Vercel - [DEPLOY-TO-VERCEL.md](docs/DEPLOY-TO-VERCEL.md)

## Credits

Originally forked from a Firebase-based student capstone boilerplate by **Duc Gia Tin Huynh** ([LinkedIn](https://www.linkedin.com/in/huynhducgiatin/)).
