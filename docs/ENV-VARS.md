# Environment Variables

## One file to edit

All environment variables live in the **root `.env`** — the single source of truth:

```bash
cp .env.example .env    # once
# fill in values, then:
pnpm run env:sync       # also runs automatically before `pnpm run dev`
```

`env:sync` (`scripts/sync-env.js`) generates the files the toolchains require:

```
.env  ──►  frontend/.env.local   (read by Next.js)
      ──►  backend/.env          (read by the Firebase Functions CLI)
```

**Never edit the generated files** — they carry a header saying so, and the next sync overwrites them. All three files are gitignored.

## Variables (defined in root `.env`)

| Variable                                | Secret  | Required           | Description                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------- | ------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64`   | **Yes** | No                 | Base64-encoded service account JSON. Backend-only, local development only — only needed to run the backend against a real Firestore project from your machine. Never synced to the frontend; deployed Cloud Functions use Application Default Credentials instead (see `backend/src/lib/firebase.ts`). Not required to run the app otherwise. |
| `NEXT_PUBLIC_APP_URL`                   | No      | Yes                | Public app URL (`http://localhost:3000` locally)                                                                                                                                                                                                                                                                                              |
| `NEXT_PUBLIC_APP_NAME`                  | No      | Yes                | App display name                                                                                                                                                                                                                                                                                                                              |
| `CORS_ORIGIN`                           | No      | No                 | Allowed CORS origin for the API (empty = deny all cross-origin)                                                                                                                                                                                                                                                                               |
| `PORT`                                  | No      | No                 | Local Functions dev server port (default `5001`)                                                                                                                                                                                                                                                                                              |
| `NEXT_PUBLIC_API_URL`                   | No      | No                 | Base URL the frontend uses to call the backend Express API directly (e.g. `GET /api/incidents`). Defaults to `http://localhost:5001` if unset. Public — same trust level as `NEXT_PUBLIC_APP_URL`.                                                                                                                                            |
| `STITCH_API_KEY`                        | **Yes** | No                 | Google Stitch key for the Claude Code MCP (stays in root `.env` only)                                                                                                                                                                                                                                                                         |
| `KC_BOOTSTRAP_ADMIN_USERNAME`           | No      | For TideCloak      | Local TideCloak container bootstrap admin username. **No default** — you choose it. Read by `docker-compose.tidecloak.yml` only. See `docs/TIDECLOAK-LOCAL.md`.                                                                                                                                                                               |
| `KC_BOOTSTRAP_ADMIN_PASSWORD`           | **Yes** | For TideCloak      | Local TideCloak container bootstrap admin password. **No default.** Read by `docker-compose.tidecloak.yml` only; never commit a real value or put it on a command line.                                                                                                                                                                       |
| `NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL` | No      | For TideCloak auth | TideCloak base URL (`http://localhost:8080` locally). Used by the browser SDK.                                                                                                                                                                                                                                                                |
| `NEXT_PUBLIC_TIDECLOAK_REALM`           | No      | For TideCloak auth | TideCloak realm name (`soc-incident-report-protection`).                                                                                                                                                                                                                                                                                      |
| `NEXT_PUBLIC_TIDECLOAK_CLIENT_ID`       | No      | For TideCloak auth | TideCloak **public** OIDC client id (`soc-incident-report-protection-app`). Not a secret.                                                                                                                                                                                                                                                     |
| `NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED`    | No      | No                 | Adapter `ssl-required` value. Defaults to `external` (correct for localhost).                                                                                                                                                                                                                                                                 |
| `NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI`    | No      | No                 | Explicit post-login redirect URI. Defaults to `<app origin>/auth/redirect`.                                                                                                                                                                                                                                                                   |
| `CLIENT_ADAPTER`                        | **Yes** | For TideCloak auth | Full Tide adapter JSON (single-line string) used by the **backend** to verify TideCloak access tokens locally (embedded JWKS). Server-only; synced only to `backend/.env`, never to the frontend. Falls back to `data/tidecloak.json` if unset. See `docs/BACKEND.md`.                                                                        |
| `E2E_TIDECLOAK_USERNAME`                | No      | For local E2E only | Username of a real test account in the local TideCloak realm, used only by the Playwright `tests/e2e/local-tidecloak/` login/logout test. **No default.**                                                                                                                                                                                     |
| `E2E_TIDECLOAK_PASSWORD`                | **Yes** | For local E2E only | Password for the same test account. **No default.** Never commit a real value or put it on a command line.                                                                                                                                                                                                                                    |

`KC_BOOTSTRAP_ADMIN_*` are only needed if you run the local TideCloak container (`pnpm run tidecloak:start`), which requires **both** to be set — there is no default for either. They are consumed directly by Docker Compose (which reads the root `.env` itself) and are intentionally absent from `scripts/sync-env.js`, so they never reach `frontend/.env.local` or `backend/.env`.

`E2E_TIDECLOAK_USERNAME` / `E2E_TIDECLOAK_PASSWORD` are only needed to run `pnpm run test:e2e:local-tidecloak` (Playwright, see `docs/TESTING.md`). Like `KC_BOOTSTRAP_ADMIN_*`, they are intentionally absent from `scripts/sync-env.js` — Playwright reads them straight from the process environment at test-run time, never from a generated file or from `.env` directly. If either is unset, the login/logout Playwright tests skip with a clear message instead of running with empty credentials.

The `NEXT_PUBLIC_TIDECLOAK_*` values configure the browser login flow (TideCloak SDK). They are a **public** OIDC client's connection details — not secrets — and reach `frontend/.env.local` through the generic `NEXT_PUBLIC_*` pass-through in `scripts/sync-env.js` (no change to that script needed). The full adapter JSON (including the `jwk` field used for local, offline JWT verification) is server-only and travels through `CLIENT_ADAPTER` instead — see the row above and `docs/BACKEND.md`. The adapter JSON export (`data/tidecloak.json`) stays out of git.

`NEXT_PUBLIC_*` values are compiled into the browser bundle — that prefix must **never** appear on a secret (a Claude Code hook blocks this).

## Generating the Service Account Key (Base64) — optional, backend-only

Only needed if you're working on a backend feature that reads or writes Firestore and want to
run it locally against a real Firebase project. Not required otherwise — deployed Cloud
Functions use Application Default Credentials instead (see `backend/src/lib/firebase.ts`), and
the frontend never uses this variable (Firebase Authentication is not used; the browser never
connects to Firestore directly — see `firebase/firestore.rules`).

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Click **Generate new private key** — save the JSON file securely
3. Convert to base64:
   ```bash
   # macOS (BSD base64 — no -w flag)
   base64 -i service-account.json | tr -d '\n'

   # Linux (GNU base64)
   base64 -w 0 service-account.json

   # Windows PowerShell (single quotes around the path)
   [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\service-account.json'))
   ```
4. Paste the result as `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` in `.env`, run `pnpm run env:sync`
5. Delete the JSON file — it now lives in the env var

**Never commit the service account JSON or the base64 string to version control.**

## Production Secrets (GitHub Actions)

The root `.env` is for local development only. For CI/CD, add repository secrets in **GitHub → Settings → Secrets → Actions**:

- `NEXT_PUBLIC_APP_NAME`
- `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` — only if a deployed environment needs to run outside Application Default Credentials; deployed Cloud Functions normally do not need this secret at all

See `docs/CI-CD.md` for the full list and how they're used.

## Adding a New Variable

Use the `/add-env-var` Claude Code skill — it updates `.env.example`, `scripts/sync-env.js` (so the value reaches the right package), and this file consistently.
