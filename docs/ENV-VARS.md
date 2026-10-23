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

`E2E_TIDECLOAK_USERNAME` / `E2E_TIDECLOAK_PASSWORD` are only needed to run `pnpm run test:e2e:local-tidecloak` (Playwright, see `docs/TESTING.md`). Like `KC_BOOTSTRAP_ADMIN_*`, they are intentionally absent from `scripts/sync-env.js` — Playwright reads them straight from the process environment at test-run time, never from a generated file or from `.env` directly. The current login/logout tests are always skipped because reliable external Tide-hosted selectors were not established; supplying credentials does not enable them. Owner private browser login is separate.

The `NEXT_PUBLIC_TIDECLOAK_*` values configure the browser login flow (TideCloak SDK). They are a **public** OIDC client's connection details — not secrets — and reach `frontend/.env.local` through the generic `NEXT_PUBLIC_*` pass-through in `scripts/sync-env.js` (no change to that script needed). The full adapter JSON (including the `jwk` field used for local, offline JWT verification) is server-only and travels through `CLIENT_ADAPTER` instead — see the row above and `docs/BACKEND.md`. The adapter JSON export (`data/tidecloak.json`) stays out of git.

`NEXT_PUBLIC_*` values are compiled into the browser bundle — that prefix must **never** appear on a secret (a Claude Code hook blocks this).

## Cloud credentials are not a local-demo prerequisite

The approved native/Docker demo uses an explicit emulator project with no cloud
fallback; do not create service-account keys or a Firebase project for this path.
Cloud Functions normally use ADC, but no cloud deployment or credential setup is
authorised by this guide. Keep any separately approved credential handling private.

## Production Secrets (GitHub Actions)

The root `.env` is for local development only. For CI/CD, add repository secrets in **GitHub → Settings → Secrets → Actions**:

- `NEXT_PUBLIC_APP_NAME`
- `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` — only if a deployed environment needs to run outside Application Default Credentials; deployed Cloud Functions normally do not need this secret at all

See `docs/CI-CD.md` for the full list and how they're used.

## Adding a New Variable

Use the `/add-env-var` Claude Code skill — it updates `.env.example`, `scripts/sync-env.js` (so the value reaches the right package), and this file consistently.

## Explicit local SOC demo additions

These names are backend-only. sync-env.js routes SOC_LOCAL_DEMO, GCLOUD_PROJECT, FIRESTORE_EMULATOR_HOST and SOC_DEMO_SHORT_DURATION; SOC_CONTAINER is set by Compose and SOC_TEST_MARKER by the isolated probe. Real private
configuration remains user-owned. No new secret value is documented.

| Variable                | Secret | Required            | Purpose                                                                           |
| ----------------------- | ------ | ------------------- | --------------------------------------------------------------------------------- |
| SOC_LOCAL_DEMO          | No     | Demo only           | Must explicitly enable the emulator storage mode                                  |
| GCLOUD_PROJECT          | No     | Demo only           | Dedicated demo project; a cloud project is rejected in demo mode                  |
| FIRESTORE_EMULATOR_HOST | No     | Demo only           | Loopback native host or internal container host; required, no cloud fallback      |
| SOC_DEMO_SHORT_DURATION | No     | Optional            | Enable clearly labelled 60-second duration only with local demo mode, default off |
| SOC_CONTAINER           | No     | Container only      | Compose-controlled backend listener binding within the container                  |
| SOC_TEST_MARKER         | No     | Isolated probe only | Internal ignored metadata path created by test-emulator.cjs                       |

Normal duration units in APIs/data/audit are seconds. Native demo scripts force the
dedicated project/host and use no service account. The short-duration flag must be
set in the trusted backend process; a frontend flag is never trusted. Frontend
public configuration remains embedded at Next.js build time. The complete
server-only CLIENT_ADAPTER is never a frontend build argument. See SOC-POC-RUNBOOK.md.

## Docker versus native loading

Compose normally loads the root configuration itself; do not print resolved
config. The public Tide URL/realm/client are required frontend build arguments;
NEXT_PUBLIC_API_URL and NEXT_PUBLIC_APP_URL default to localhost:5001/3000.
CORS_ORIGIN must match the browser app origin. Backend connects to firestore:8085;
native scripts force 127.0.0.1:8085. Compose supplies SOC_CONTAINER=true and
PORT=5001. The read-only adapter bind source must exist even when CLIENT_ADAPTER
is set; it is never a frontend build argument. Do not rewrite the JWT issuer to
container DNS. See [deployment commands](SOC-WEEK9-DEPLOYMENT.md).
