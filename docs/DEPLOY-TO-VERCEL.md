# Deploying to Vercel — Step by Step

This guide takes your local app live on the internet. It assumes `pnpm run dev` already works on your machine — if it doesn't, fix that first (see `docs/GUIDE.md`).

**What you're deploying:** the `frontend/` app only. It's a full Next.js server (pages + Server Actions) that talks to TideCloak for frontend authentication — TideCloak is the only authentication provider, and the frontend has no Firebase SDK at all. The old Firebase session-cookie route (`/api/auth/session`) has been removed. The separate `backend/` Express app (Cloud Functions) still exists as optional scaffolding for future features (including any Firestore-backed data, which is server-only); skip it unless your feature specifically calls it (see the box at the end).

The app has no required Firebase configuration to deploy today — Firestore is reserved for future backend features and is never accessed from the browser or from Vercel's deployment.

---

## Step 1 — Push your code to GitHub

Vercel deploys from a GitHub repo. If your latest work isn't pushed yet:

```bash
git push origin <your-branch>
```

If you're not on `main` yet, open a PR and get it merged first (or ask a maintainer) — Vercel's auto-deploy is normally wired to `main`.

## Step 2 — Create a Vercel account

Go to [vercel.com](https://vercel.com) → **Sign Up** → choose **Continue with GitHub**. Authorize Vercel to access your GitHub account when prompted.

## Step 3 — Import the repo

1. On the Vercel dashboard, click **Add New...** → **Project**
2. Find your repo in the list (search if needed) → click **Import**
3. If you don't see the repo, click **Adjust GitHub App Permissions** and grant Vercel access to it

## Step 4 — Configure the project

On the "Configure Project" screen:

| Field                | Set to                                                 |
| -------------------- | ------------------------------------------------------ |
| **Framework Preset** | Next.js (should auto-detect)                           |
| **Root Directory**   | Click "Edit" next to it → select `frontend` → Continue |

Do **not** click Deploy yet — you still need to add environment variables in the next step.

## Step 5 — Add environment variables

Still on the same screen, expand **Environment Variables** and add each row below. For each one: type the name in the left box, the value in the right box, click **Add**, repeat.

| Name                                                                                                      | Value                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`                                                                                    | your app's display name, e.g. `My Capstone App`                                                                                                      |
| `NEXT_PUBLIC_APP_URL`                                                                                     | leave as `https://placeholder.vercel.app` for now — you'll fix this in Step 6                                                                        |
| `NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL`, `NEXT_PUBLIC_TIDECLOAK_REALM`, `NEXT_PUBLIC_TIDECLOAK_CLIENT_ID` | TideCloak connection details — the TideCloak instance must be reachable from this deployed URL, not just `localhost` (see `docs/TIDECLOAK-LOCAL.md`) |
| `NEXT_PUBLIC_API_URL`                                                                                     | only if the frontend calls the deployed `backend/` API — its public base URL                                                                         |

**Checklist before continuing:**

- [ ] Every row shows a value, not blank
- [ ] No extra spaces at the start/end of any value (a trailing space is invisible and breaks things)
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` is **not** set here — it's a backend-only secret that must never reach the frontend

## Step 6 — Deploy, then fix the URL

1. Click **Deploy**. Wait for the build to finish (a few minutes).
2. Once it's live, copy the URL Vercel gives you (something like `https://your-app.vercel.app`)
3. Go to **Project Settings → Environment Variables**, edit `NEXT_PUBLIC_APP_URL`, and replace the placeholder with that real URL
4. Go to the **Deployments** tab → click the `...` menu on the latest deployment → **Redeploy** (so the corrected value takes effect)

**From now on, every push to `main` auto-deploys to this URL.** There's no approval step on Vercel's side — merging to `main` means it's live.

## Step 7 — Firestore security rules (only if you deploy the backend and use Firestore)

Only relevant if a Firestore-backed feature has been implemented in `backend/`. `firebase/firestore.rules` denies all direct client access by default — there is nothing to configure for the frontend, since the browser never connects to Firestore. If you do deploy Firestore rules:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

---

## Sanity check — is it actually working?

Visit your Vercel URL and:

1. Click "Continue with TideCloak" on `/auth/signin` — if this fails, double check the `NEXT_PUBLIC_TIDECLOAK_*` values in Step 5 and that the TideCloak instance is reachable from the public internet (not just `localhost`)
2. Confirm you land on `/dashboard` after signing in

---

## Do I need to deploy `backend/` too?

Almost certainly not, unless your feature specifically calls it (look for `fetch` calls to a `/api/...` URL in the frontend, or check `backend/src/routes/` for routes with actual code in them). Its auth middleware verifies **TideCloak access tokens** — Firebase Authentication is not used anywhere in this backend. Deploying it requires upgrading Firebase to the paid Blaze plan. Full instructions are in `docs/CI-CD.md` if you do need it.
