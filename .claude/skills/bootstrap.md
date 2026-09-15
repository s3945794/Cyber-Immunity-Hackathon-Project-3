---
description: Full local bootstrap — from fresh clone to the app running against a real Firebase (Firestore) project and a local TideCloak container. Checks prerequisites, installs dependencies, walks through creating a free Firebase project, filling the root .env, starting TideCloak, starting the dev server, and manually verifying the TideCloak login round trip. Use on first setup or whenever local dev is broken.
---

# Skill: /bootstrap

Take the repo from fresh clone to a **running app against a real Firebase (Firestore) project and a local TideCloak identity server**, end to end, verifying every step. Do not stop at the first success message — the job is done only when the smoke test in Step 5 passes.

There is no local Firestore emulator in this project — the app always talks to the real Firebase project configured in `.env` for Firestore. Firebase's free Spark plan covers Firestore, so no billing is required. **Frontend authentication is TideCloak, not Firebase Authentication** — TideCloak runs in a local Docker container (see `docs/TIDECLOAK-LOCAL.md`).

## Step 1 — Preflight

```bash
node --version   # need >= 22
pnpm --version    # need >= 10
```

If either is missing or too old, stop and tell the user what to install.

## Step 2 — Install dependencies

```bash
pnpm install
```

| If you see                                          | Fix                                                                                                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_PNPM_IGNORED_BUILDS` / "Ignored build scripts" | `pnpm-workspace.yaml` must contain an `allowBuilds:` map with `'@firebase/util'`, `esbuild`, `lefthook`, `protobufjs`, `sharp`, `unrs-resolver` all set to `true`. Fix it, re-run `pnpm install`. |
| `'next' is not recognized` later                    | Re-run `pnpm install` from the **repo root**.                                                                                                                                                     |

Confirm Lefthook hooks installed (install output shows `sync hooks: ✔️`).

## Step 3 — The one env file

All configuration lives in the **root `.env`** (never edit `frontend/.env.local` / `backend/.env` — they are generated).

1. If `.env` does not exist: `cp .env.example .env`
2. Ask the user if they already have a Firebase project for this repo. If not, walk them through:
   - Create a project at https://console.firebase.google.com (free Spark plan — no billing needed)
   - Build → Firestore Database → create database (start in production mode; rules already live in `firebase/firestore.rules`)
   - Note: **do not** enable Firebase Authentication for this project — the frontend uses TideCloak, not Firebase Auth
3. Fill `.env` from the Firebase console (Firestore only):
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` — Project settings → General → Project ID
   - `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` — Project settings → Service accounts → Generate new private key, then base64-encode the downloaded JSON (macOS: `base64 -i service-account.json | tr -d '\n'` — BSD `base64` has no `-w` flag; Linux: `base64 -w 0 service-account.json`)
   - `NEXT_PUBLIC_FIREBASE_*` — Project settings → Your apps → add/open a web app → copy the `firebaseConfig` values
   - `NEXT_PUBLIC_APP_NAME`
4. `.firebaserc` → `projects.default` must equal `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
5. Fill in the `NEXT_PUBLIC_TIDECLOAK_*` variables — see `docs/TIDECLOAK-LOCAL.md` for how to
   provision the local realm and client these values come from.
6. `pnpm run env:sync`

Verify: `frontend/.env.local` and `backend/.env` exist and contain the values from `.env` (`NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64`, `NEXT_PUBLIC_TIDECLOAK_*`, etc).

## Step 4 — Start the app

```bash
pnpm run dev
```

Run in the background, then wait for `http://localhost:3000` → 200 (first compile can take ~30 s).

## Step 5 — Smoke test (mandatory — this defines "done")

```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000                 # 200
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/auth/signin    # 200
```

The `/dashboard` route can no longer be smoke-tested with a plain `curl` — it is gated
**client-side only** via `useAuth()` (a UX redirect via JavaScript), not by a server-side
redirect a `curl` request would see. Requesting `/dashboard` unauthenticated with `curl` returns
200 with HTML that redirects client-side; it does not return a server-side 307.

TideCloak's login flow requires a real browser (PKCE redirect through the TideCloak realm's own
sign-in page), so it cannot be scripted with `curl` the way the old Firebase Identity Toolkit
REST flow could. Verify the auth round trip manually:

1. Confirm the local TideCloak container is running: `pnpm run tidecloak:status` (start it with
   `pnpm run tidecloak:start` if not — see `docs/TIDECLOAK-LOCAL.md`).
2. Confirm `NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL`, `NEXT_PUBLIC_TIDECLOAK_REALM`, and
   `NEXT_PUBLIC_TIDECLOAK_CLIENT_ID` are set in `.env` and synced (`pnpm run env:sync`).
3. Open `http://localhost:3000/auth/signin` in a real browser.
4. Click "Continue with TideCloak" — confirm the browser redirects to the TideCloak realm's
   sign-in page.
5. Sign in with a TideCloak account linked to this realm (see `docs/TIDECLOAK-LOCAL.md` for how
   the realm and its linked account were provisioned).
6. Confirm the browser redirects back to `/auth/redirect`, then lands on `/dashboard` with the
   dashboard shell visible (not a spinner or a bounce back to `/auth/signin`).
7. Click the sign-out control in the navbar — confirm `logout()` ends the session and the app
   returns to a signed-out state.

If step 4 loops back to `/auth/signin` without opening the TideCloak sign-in page, check the
TideCloak server log for an OAuth error code — see `docs/tide-mcp-learning.txt` (ISSUE 010,
ISSUE 011) for previously diagnosed causes (DPoP requirement, silent-SSO iframe framing).

**Server-side verification is intentionally not part of this smoke test.** There is currently no
server-side TideCloak session check — `getServerSession()` always returns `null` and
`requireAuth()` always redirects. That gap is tracked under `feature/tidecloak-protect`, not
something `/bootstrap` can smoke-test today.

## Step 6 — Report

Output a summary the user can act on:

```
## Bootstrap complete ✅

Firebase project: <NEXT_PUBLIC_FIREBASE_PROJECT_ID> (Firestore only)
TideCloak realm:  <NEXT_PUBLIC_TIDECLOAK_REALM>
App:              http://localhost:3000

| Check | Result |
|-------|--------|
| Dependencies + git hooks | ✅ |
| .env → generated env files | ✅ |
| App pages (/, /auth/signin) | ✅ |
| TideCloak container running | ✅ |
| Manual login → /dashboard → logout | ✅ (verified by hand, see Step 5) |

Next: read docs/GUIDE.md to understand the current setup. Server-side TideCloak verification and
RBAC are not yet implemented (feature/tidecloak-protect).
```

If ANY check failed, the verdict is **NOT BOOTSTRAPPED** — show which step, the error, and the fix from the tables above. Never report success with a failing smoke test.
