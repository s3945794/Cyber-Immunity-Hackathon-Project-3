# Developer setup guide

Updated 22 October 2026. Use synthetic data only; evidence remains locked.

## What runs

Next.js provides the browser UI and TideCloak login. Express verifies Tide tokens
before exposing incident metadata or the persisted request/review/history/audit
workflow. Firestore stores workflow records through the backend Admin SDK only.
It is required for this workflow, not optional future storage. Incident summaries
are synthetic source fixtures; protected values are not included in them.

All four recognised SOC roles may request and review others' requests. The
requester cannot review their own request. Two distinct other approvals produce
an authorising/unavailable state, not genuine Tide authority or unlocked evidence.
See [architecture](ARCHITECTURE.md), [backend](BACKEND.md) and
[Tide capability limits](SOC-TIDE-CAPABILITIES.md).

## Prerequisites and private setup boundary

- For the approved local Docker path, Docker Desktop Linux engine access and an
  existing functioning TideCloak container/realm/client/recognised accounts and
  backend adapter are required. Application image tool versions are pinned in
  the existing Dockerfiles; host Java/pnpm are not needed to run built images.
- For native development, use Node 22.12+ on the Node 22 line or supported Node
  24, existing pnpm (owner evidence: 11.20.0), and Java 21+ for Firestore. Use the
  existing actual JDK workaround from the runbook if a Windows shim prevents
  emulator shutdown. Do not install or change PATH as a troubleshooting shortcut.
- The root private environment is the native configuration source; env:sync
  generates frontend/.env.local and backend/.env. Public browser settings and
  server-only adapter names are described in [ENV-VARS.md](ENV-VARS.md).
- A new clone must use its own owner-approved identity setup. The historical
  [Tide setup](TIDECLOAK-LOCAL.md) is not a verified independent fresh-client
  recipe. F8/DPoP and the missing supported setup/version contract remain gaps.
  Do not copy another person's adapter/accounts, weaken client policy or create
  a realm as an automatic setup step. No cloud Firebase project is required for
  the explicit local demo; no service account or billing is needed for it.

## Choose one application runtime

Use the single [local Docker procedure](SOC-WEEK9-DEPLOYMENT.md) for commands,
readiness, internal Firestore 403, graceful export, backup and restart. It starts
the existing TideCloak container without recreating it. App/API are localhost
3000/5001; Firestore is internal at firestore:8085, not a host endpoint. This
owner-verified deployment is not a publicly hosted website.

For native development, follow the detailed [runbook](SOC-POC-RUNBOOK.md):

```powershell
pnpm install --frozen-lockfile
pnpm run env:sync
pnpm --filter backend build
```

Then use separate terminals for `pnpm run demo:emulator`,
`pnpm run demo:backend` and `pnpm run demo:frontend`. These use native emulator
127.0.0.1:8085, unlike Docker's internal hostname. Do not run native and Docker
applications together on the same ports or export directory. `pnpm run dev`
starts only frontend after environment sync; backend dev only watches TypeScript.
Neither starts the complete stack. Stop gracefully and confirm Export complete
before backup/restart. Do not reset data or delete volumes.

## Development conventions and checks

Use Server Components by default and small Client Components for interaction.
Frontend calls typed authenticated helpers in frontend/src/lib/api; never add a
browser Firebase SDK. Backend storage access goes through lib/firebase.ts and
access/store.ts; document schema changes in [FIRESTORE-SCHEMA.md](FIRESTORE-SCHEMA.md).
Server Action session helpers remain fail-closed placeholders; workflow mutations
use the verified backend, not those helpers. UI redesign needs owner design approval.

Use [TESTING.md](TESTING.md) for meaningful affected checks and evidence categories.
Do not repeat passed checks for documentation-only edits. [SECURITY.md](SECURITY.md)
covers current boundaries. Cloud Run and other paid/public hosting are unapproved;
[CI-CD.md](CI-CD.md) separates current CI from historical deployment examples.

For failures, use the runbook's safe fixed startup codes and troubleshooting.
Never paste credentials, callback URLs, tokens, raw SDK errors, adapter contents
or unredacted logs. A successful owner login does not resolve peer F8.
