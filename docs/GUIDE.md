# Building With This Project — A Beginner's Guide

This guide takes you from a fresh clone to a running app. No prior experience with this stack is assumed — follow it top to bottom.

---

## 1. Understand what you're working with

The app has three parts:

- **`frontend/`** — a Next.js website. Pages live in `frontend/src/app/`. Most pages render on the server (fast, secure); interactive parts run in the browser. **TideCloak** handles frontend authentication (login, logout, callback, silent SSO).
- **`backend/`** — an Express API deployed as one Firebase Cloud Function. You only need it for logic that shouldn't live in the frontend (webhooks, heavy processing, third-party API calls with secrets). Its auth middleware currently verifies **Firebase ID tokens**, not TideCloak tokens — reconnecting it to TideCloak is future work (`feature/tidecloak-protect`).
- **Firebase Firestore** — the database. There's no local emulator — dev, staging, and production all talk to real Firebase projects (use a separate free project for local dev so you're not testing against production data).

See the diagrams in [ARCHITECTURE.md](ARCHITECTURE.md) for how these connect, and [TIDECLOAK-LOCAL.md](TIDECLOAK-LOCAL.md) for the local TideCloak setup.

**The three golden rules** (everything else follows from these):

1. **Never trust the browser.** Every data access is checked server-side — Firestore security rules today; server-side TideCloak token verification is planned but not yet implemented, so treat any Server Action or API route as **not yet security-enforced** until that work lands.
2. **Server Components by default.** Only add `'use client'` to a file when it needs clicks, typing, live updates, or the TideCloak SDK.
3. **One collection, four places.** Every Firestore collection gets: a TypeScript type, a typed collection export, security rules, and a schema doc entry. The `/firebase-collection` skill does all four for you.

---

## 2. Set up your machine

Install once:

| Tool           | How                                             |
| -------------- | ----------------------------------------------- |
| Node.js 22     | [nodejs.org](https://nodejs.org)                |
| pnpm           | `npm install -g pnpm`                           |
| Docker Desktop | required for the local TideCloak container only |

Then from the repo root:

```bash
pnpm run bootstrap
```

This installs dependencies, creates the root `.env` from the template, and generates the per-package env files.

### Connect a Firebase project (Firestore)

**All env values live in one file: the root `.env`.** (`frontend/.env.local` and `backend/.env` are generated from it — never edit those.)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) — the free **Spark plan** is enough, no billing required
2. Create a **Firestore** database
3. Project settings → **Your apps** → add a **Web app** → copy each `firebaseConfig` value into `.env` (the variable names match: `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.)
4. Project settings → **Service accounts** → generate a private key → base64-encode it (macOS: `base64 -i service-account.json | tr -d '\n'`; Linux: `base64 -w 0 service-account.json`) → paste into `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` in `.env`
5. Set `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env` and put the same id in `.firebaserc` (replacing the placeholder)

### Connect TideCloak (frontend authentication)

Start the local TideCloak container and provision a realm/client, then fill in the `NEXT_PUBLIC_TIDECLOAK_*` variables in `.env`. Full walkthrough: [TIDECLOAK-LOCAL.md](TIDECLOAK-LOCAL.md).

After changing anything in `.env`, run `pnpm run env:sync` (or just restart `pnpm run dev` — it syncs automatically).

### Run it

```bash
pnpm run dev
```

- App: [http://localhost:3000](http://localhost:3000)

Sign in via "Continue with TideCloak" on `/auth/signin` and confirm you land on `/dashboard`. The dashboard gate is currently **client-side only** (a UX gate, not a security boundary) — see [SECURITY.md](SECURITY.md) for the current, honest state of each security layer.

---

## 3. Where things go — cheat sheet

| I want to…                              | Put it in…                                                     | Skill                  |
| --------------------------------------- | -------------------------------------------------------------- | ---------------------- |
| Add a page                              | `frontend/src/app/(dashboard)/…` or `(auth)/…`                 | `/new-page`            |
| Add a business feature                  | `frontend/src/features/{name}/`                                | `/new-feature`         |
| Add a reusable component                | `frontend/src/components/shared/`                              | `/new-component`       |
| Add a database collection               | types + firestore.ts + rules + schema doc                      | `/firebase-collection` |
| Change a collection's fields            | (guided migration)                                             | `/evolve-schema`       |
| Add an API endpoint                     | `backend/src/routes/`                                          | `/add-route`           |
| Add a config value                      | `.env.example` + `docs/ENV-VARS.md`                            | `/add-env-var`         |
| Configure a TideCloak identity provider | TideCloak realm admin console — see `/add-auth-provider` skill | `/add-auth-provider`   |

---

## 4. Common pitfalls

| Symptom                                                               | Cause & fix                                                                                                                                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Firebase web config is incomplete" on Vercel                         | A `NEXT_PUBLIC_FIREBASE_*` env var is missing in Vercel's project settings. Add it (same name as your root `.env`), then redeploy — Vercel doesn't retroactively apply new env vars to existing deployments. |
| Changed an env var, nothing happened                                  | Edit the root `.env` (not the generated files), then restart `pnpm run dev` — `NEXT_PUBLIC_*` values are baked in at startup.                                                                                |
| Edited `frontend/.env.local` or `backend/.env` and it got overwritten | Those files are generated. Make the change in the root `.env` instead.                                                                                                                                       |
| "Missing or insufficient permissions" from Firestore                  | Your security rules don't allow the read/write. Add rules for the collection in `firebase/firestore.rules`, then deploy them: `npx firebase-tools deploy --only firestore:rules`.                            |
| `Invalid project id: REPLACE_WITH_...`                                | Set your real project id in `.firebaserc`.                                                                                                                                                                   |
| Imported `firebase/firestore` in a page and it crashed                | Client SDK in a Server Component. Use `@/lib/firebase/admin` on the server, or move the code into a `'use client'` component.                                                                                |
| Hook/`useState` error in a page                                       | The file needs `'use client'` at the top — or better, move the interactive part into its own small Client Component.                                                                                         |
| TideCloak login loops back to `/auth/signin`                          | Check the TideCloak server log for the OAuth error code (e.g. `invalid_dpop_proof`). See `docs/tide-mcp-learning.txt` for previously diagnosed causes.                                                       |
| Commit rejected                                                       | The message isn't Conventional Commits format. Use `feat: …`, `fix: …`, `docs: …` etc.                                                                                                                       |

More troubleshooting lives in the [README](../README.md#troubleshooting).

---

## 5. Going further

- [ARCHITECTURE.md](ARCHITECTURE.md) — diagrams and the reasoning behind the design
- [FRONTEND.md](FRONTEND.md) / [BACKEND.md](BACKEND.md) — per-package conventions
- [DESIGN.md](DESIGN.md) — colors, typography, component patterns
- [SECURITY.md](SECURITY.md) — the current security model, layer by layer, including what is and isn't implemented yet
- [TESTING.md](TESTING.md) — what to test and how
- [GIT-WORKFLOW.md](GIT-WORKFLOW.md) — branches, merges, releases
- [CI-CD.md](CI-CD.md) — deployment in full: Vercel, Firestore rules, the optional backend
- [TIDECLOAK-LOCAL.md](TIDECLOAK-LOCAL.md) — local TideCloak container setup and realm provisioning
- [tide-mcp-learning.txt](tide-mcp-learning.txt) — recorded findings from the TideCloak integration

## 6. Shipping it — Deploy to Vercel

Local dev talks to your Firebase project already — going live just means putting the frontend somewhere public. Deploy to [Vercel](https://vercel.com) (free, no billing account needed): sign in with GitHub, **Add New Project**, import this repo, set **Root Directory** to `frontend`, then add the environment variables listed (including the `NEXT_PUBLIC_TIDECLOAK_*` values, pointed at a reachable TideCloak instance) — Vercel doesn't read your root `.env` file, so each variable has to be added manually under the same name it has there. For a step-by-step walkthrough, see [DEPLOY-TO-VERCEL.md](DEPLOY-TO-VERCEL.md).
