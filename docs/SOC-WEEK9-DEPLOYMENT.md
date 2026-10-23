# Week 9 deployment preparation

**CLOUD HOSTING UNAPPROVED — PAUSED. Local Docker approved 21 October 2026.** No hosting choice, cost, provisioning or
public exposure is approved. The five Cloud Run implementation files are parked,
optional and unstaged while hosting is undecided. Preserve the independent
README, setup and readiness corrections.

Updated 22 October 2026. **Local Docker owner verification passed, including restart persistence. No public deployment.**
This is the single deployment proposal and acceptance record. README/runbook link
here; Week 8 findings retain their original attribution.

## Approved local Docker procedure — 21 October 2026

PM/owner accepts local Docker for Week 9. Cloud Run remains unapproved. Reuse
`docker-compose.soc-demo.yml` and the existing Dockerfiles (with the rules-path correction below). Do not run
the separate TideCloak Compose lifecycle or recreate its container/accounts/data.
Current HEAD: `44ea6254a95e72b761929809a95e894146700244`. Runtime fix 4143ad8 and deployment
documentation 44ea625 are now local commits. No remote publication is verified.
Owner tests originally covered base 8d55ac3 plus working-tree fixes before those
commits; do not relabel them as a new exact-HEAD peer run. Current reconciliation
is documentation-only and uncommitted. No image digest or public URL is claimed.

### Current local result and remaining release/handoff — 22 October 2026

**Owner PASSED:** image builds; final Compose startup exit 0/all services Healthy;
frontend 200; backend health 200; unsigned incidents 401; private login/dashboard/
incidents/request creation; completed graceful export and Exited (0) shutdown;
final rules-path image build and no fresh configuration warnings; internal
unauthenticated Firestore request 403; same synthetic request, both decisions,
history and audit retained after restart; application functions work. Evidence
remains locked under the existing Tide authority blocker. These are owner
observations, not agent runtime checks, independent peer evidence or full PoC
acceptance. The internal 403 is a GET/read denial check, not a separately tested
write-denial claim. Earlier failed starts and host HTTP 000 below remain history.

Actual owner local app: http://localhost:3000 (sign-in `/auth/signin`);
API health: http://localhost:5001/api/health; unsigned incidents:
http://localhost:5001/api/incidents. Existing TideCloak local entry is port 8080
(http://localhost:8080); no private realm/session URL is recorded. Internal
Firestore is `http://firestore:8085`, reachable from backend on the storage
network, not an owner-verified host endpoint. No public or remote peer URL.

Confirmed current HEAD: `44ea6254a95e72b761929809a95e894146700244` on
`feature/soc-emergency-access-poc`. Owner-tested earlier working-tree runtime
fixes are now committed; only the subsequent documentation reconciliation is
uncommitted. No image identities, remote publication, independent peer test or
final PM acceptance is inferred. No passed tests/builds/audits were repeated.

Final diff review: only runtime file changed is the Firestore Dockerfile COPY
location and configured-file build guard. Five Cloud Run files remain parked,
unapproved and unstaged. No dependency/authentication/rule weakening identified.
**Port reconciliation — 22 October:** public-source inspection found only the
SOC and TideCloak Compose files; no root override file, relevant override script
or documented extra `-f` input was found. Reviewed commands explicitly select
`docker-compose.soc-demo.yml`. No private environment/COMPOSE_FILE values were
read. This does not establish why the existing container showed no published
8085 binding: a prior runtime configuration or Docker networking behaviour
remains unconfirmed. Do not invent an override or a confirmed engine cause.

Removed only the Firestore `ports` declaration from SOC Compose. Database stays
on internal `storage`, with unchanged `firestore:8085`, health check, export bind
mount and rules. Dockerfile `EXPOSE 8085` documents a container port and does not
publish it. Frontend/backend loopback ports are unchanged. This expresses the
already owner-tested internal topology explicitly and prevents a fresh setup
from requesting host publication. No running service restarted or modified.
Previous owner passes predate this configuration-only deletion. Agent synthetic
Compose rendering/assertions passed (exit 0): no Firestore host publication,
storage remains internal, backend database DNS and export mount unchanged,
frontend/backend remain loopback-only. Used empty temporary env input and
synthetic public settings; no resolved values printed or private files read.
git diff --check passed. No fresh corrected-Compose rollout is claimed.

If exact historical runtime provenance is required, one targeted owner command
can return only the existing container's Compose-file label and port metadata:

```powershell
docker inspect --format 'composeFiles={{index .Config.Labels "com.docker.compose.project.config_files"}} hostBindings={{json .HostConfig.PortBindings}} effectivePorts={{json .NetworkSettings.Ports}}' soc-incident-demo-firestore-1
```

No full inspect, environment or private values should be printed. This is a
read-only check, not a restart or repeated application test. Engine version and
full networking provenance are not inferred from the label alone.

Minimum remaining steps (do not repeat completed checks):

- Review the explicit internal-only Compose correction and local release set;
  historical runtime cause remains unconfirmed pending the optional metadata check.
- Obtain explicit staging/commit/publication approval separately, then record
  the resulting exact release SHA and built image IDs/digests without secrets.
  No commit or push is authorised now.
- Retain a durable owner copy of the completed export backup; temporary backup
  exists, but a backup restore drill and Tide realm restore are not verified.
- Arrange independent peer retesting of the agreed exact candidate locally
  (same-machine supervised access or their isolated local setup), with private
  credentials entered by the peer. No tunnels, LAN/public exposure or shared
  private adapter/config files. Current owner passes are not peer results.
- Give PM the local URLs, exact base-plus-diff state, owner evidence and remaining
  limitations; record Planner acceptance when PM accepts local-only delivery.
  F8, genuine authority/expiry and Braces/uuid remain separate unresolved work.

### Historical reviewed local release set — now committed

Runtime/config group (only changed existing files):

- `docker-compose.soc-demo.yml`: remove Firestore host publication.
- `docker/firestore.Dockerfile`: place rules/indexes inside Firebase project root
  and fail image build when configured files are missing.

Documentation group:

- `README.md`
- `docs/DEPLOY-TO-VERCEL.md`
- `docs/SOC-POC-HANDOFF.md`
- `docs/SOC-POC-RUNBOOK.md`
- `docs/SOC-WEEK9-DEPLOYMENT.md` (new)

These seven reviewed files were committed in 4143ad8 and 44ea625. This list is historical, not the current docs-only change set. Reused unchanged dependencies of
this setup include backend/frontend Dockerfiles, container Firebase config,
entrypoint, deny-client rules and indexes; already tracked, so do not stage them.
Exclude all five parked files: `deploy/cloudrun/api.service.yaml`,
`deploy/cloudrun/web.service.yaml`, `deploy/cloudrun/backend.Dockerfile`,
`deploy/cloudrun/serve.cjs`, `deploy/cloudrun/serve.test.cjs`. Preserve them unstaged.
Also exclude private configuration, runtime data, exports, backups, quarantine
and generated files. No ignore-rule or private configuration change is needed.

Proposed messages: `fix(docker): keep Firestore internal and load deny-client rules`
and `docs(soc): record verified local Docker deployment and handoff limits`.
Those two commits now exist locally. No staging or commit was performed by this
documentation reconciliation. Peer retesting, image identities, remote publication
and final PM/Planner acceptance remain pending; F8 and Tide authority are unresolved.

### Documentation reconciliation checks — 22 October 2026

Current reconciliation changes documentation only. Relevant tracked source,
Compose, Dockerfiles, entrypoint, schemas, routes, manifests and launch scripts
were inspected without loading private configuration. Local relative Markdown
file links and deployment PowerShell command-block syntax were checked (commands
not executed). Documentation formatting and git diff --check are recorded in the
final report. No application/browser/emulator tests, builds, audit, service
operation, Tide lookup, commit or push was performed. CLAUDE.md maintenance
instructions were left unchanged; older stage-specific descriptions there are
not a replacement for this current record.

### Prerequisites and networking

Docker Desktop Linux engine must be accessible. Existing private configuration
may load normally; do not print resolved Compose configuration or inspect private
files. The read-only `data/tidecloak.json` mount must already exist even when
CLIENT_ADAPTER is configured. Public frontend URLs are baked during image build.
Existing TideCloak must already be running and permit the configured localhost
app origin/redirect/logout. If not, propose exact changes before proceeding.

Expected browser URLs: `http://localhost:3000` for the app,
`http://localhost:5001/api/health` for API health, and the existing TideCloak
browser origin (normally `http://localhost:8080`). App/API URLs were owner-verified. Tracked Compose declares loopback mappings
for 3000 and 5001 only; Firestore is internal with no host mapping. Backend uses
`firestore:8085` on an internal network; browsers never use that service DNS.
Backend verifies embedded JWKS locally, so do not rewrite the configured issuer
to a Docker hostname. Existing client policy remains unchanged.

Firestore is synthetic demo persistence, not a public or production database.
Preserve `demo-data`; never store real sensitive evidence. Existing pins remain
Node 24.21.0, pnpm 11.19.0, Temurin 21.0.12.1_1 and Firebase CLI 14.16.0;
owner image builds/startup passed for these pins; no independent registry or peer verification inferred.

### Owner normal-PowerShell procedure, repository root

First check Docker access, container ownership and occupied ports. Do not stop
unrelated services. If a command fails, stop before later steps. No raw logs,
resolved configuration, credentials or authentication URLs should be shared.

```powershell
docker ps -a --format '{{.Names}}|{{.Status}}|{{.Ports}}'
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 3000,5001,8080 } | Select-Object LocalAddress,LocalPort,OwningProcess
docker compose -f docker-compose.soc-demo.yml config --quiet
docker compose -f docker-compose.soc-demo.yml build
# Only if the existing TideCloak container is stopped; never recreate it:
docker start soc-incident-report-protection-tidecloak-1
docker compose -f docker-compose.soc-demo.yml up -d --no-build --wait --wait-timeout 180
docker compose -f docker-compose.soc-demo.yml ps
(Invoke-WebRequest -UseBasicParsing http://localhost:3000/auth/signin).StatusCode
(Invoke-WebRequest -UseBasicParsing http://localhost:5001/api/health).StatusCode
curl.exe --silent --output NUL --write-out '%{http_code}' http://localhost:5001/api/incidents
```

Expected HTTP statuses: 200, 200, 401. Do not supply a token. Health ordering is
Firestore, backend, frontend; health does not prove authenticated operation.
Owner then signs in privately and creates one clearly labelled synthetic request
through the normal UI. Record its reference and nonsecret displayed details.

```powershell
$socStopSince = (Get-Date).ToUniversalTime().ToString('o')
docker compose -f docker-compose.soc-demo.yml stop -t 60
$LASTEXITCODE
docker compose -f docker-compose.soc-demo.yml ps -a
docker compose -f docker-compose.soc-demo.yml logs --no-color --since $socStopSince firestore 2>&1 |
    Select-String -Pattern 'Export complete' |
    ForEach-Object { 'Export complete confirmed for this shutdown.' }
Test-Path -LiteralPath './demo-data/firestore/firebase-export-metadata.json'
```

Require all app containers stopped and emulator **Export complete** confirmed in
locally reviewed shutdown output. Metadata existence alone may reflect an older
export. If completion is missing, preserve all data and stop; do not claim
successful persistence. Keep a backup of the completed export outside the repo,
without overwriting another backup, before restarting. Never use `down -v`,
volume pruning, force kills or data resets. Do not stop TideCloak.

After the stop/export gates pass, preserve an outside-repository backup before
restart. This copies the stopped export without opening its contents and creates
a unique destination; it does not delete or overwrite existing data:

```powershell
$socExport = (Resolve-Path -LiteralPath './demo-data/firestore' -ErrorAction Stop).Path
$socBackup = Join-Path ([IO.Path]::GetTempPath()) ('SOC-firestore-backup-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $socBackup -ErrorAction Stop | Out-Null
Copy-Item -LiteralPath $socExport -Destination $socBackup -Recurse -ErrorAction Stop
Test-Path -LiteralPath (Join-Path $socBackup 'firestore/firebase-export-metadata.json')
$socBackup
```

Require backup success before proceeding.

```powershell
docker compose -f docker-compose.soc-demo.yml up -d --no-build --wait --wait-timeout 180
docker compose -f docker-compose.soc-demo.yml ps
```

Temp backup is not archival: retain a separate
owner-selected durable backup before cleaning temporary storage. The completed
backup from the actual owner restart is recorded below. After restart, the direct
unauthenticated read check uses available Node inside the backend container;
it prints only status (403 required, 000 means transport failure):

```powershell
docker compose -f docker-compose.soc-demo.yml exec -T backend node -e "fetch('http://firestore:8085/v1/projects/demo-soc-incident-protection/databases/(default)/documents/socRulesProbe/nonexistent',{signal:AbortSignal.timeout(10000)}).then(r=>{console.log(r.status);process.exitCode=r.status===403?0:1}).catch(()=>{console.log('000');process.exitCode=1})"
```

Repeat the three HTTP checks. Owner confirms private login, retained synthetic
request/history/audit details and locked evidence. Preserve the synthetic record.
The entrypoint imports the existing export. Rollback requires graceful app-only
stop, preserved export/backup and a separately reviewed source/image revision;
do not reset this working tree. No rollback has been tested.

### Actual evidence, limitations and acceptance

Owner image build: `docker compose -f docker-compose.soc-demo.yml build`
passed, exit 0; backend, frontend and Firestore images all built successfully.
This verifies the owner image build only. Agent Docker access remains denied;
no access retry was made.

Owner runtime follow-up: `docker start soc-incident-report-protection-tidecloak-1`
returned the existing container name. The displayed container inventory ran
before that start, so post-start Tide readiness is not established by it.
Compose `up -d --no-build --wait --wait-timeout 180` reported Firestore, backend
and frontend Healthy. Owner HTTP checks returned frontend 200, backend health
200 and unsigned incidents 401. The displayed `$LASTEXITCODE` values preceded
the startup commands and are not recorded as their exit codes. These are owner
runtime observations, not agent verification or independent peer results.
Owner browser follow-up: private login, dashboard, incidents and synthetic request
creation passed. Two other staff approvals were recorded, but the requester
could not view protected evidence. This is the existing genuine Tide authority
blocker, not a new finding or a successful secure-access test. Application
approvals and audit entries do not establish a genuine Tide grant. Evidence
remains locked; no database-only unlock or authentication change is authorised.
Owner graceful shutdown/export PASSED: all three application containers Exited (0);
Firestore export completed at 2026-10-21T04:42:23Z (15:42:23 AEDT), and host
export metadata timestamp was 21 October 2026, 15:42:22 AEDT. Restart and
comparison of the synthetic request, decisions, history and audit subsequently PASSED by owner. No full PoC acceptance, public
deployment or resolved F8/authority/expiry is claimed.

Owner follow-up, 21 October: `docker version` returned Client and Server;
`docker ps` succeeded with no running containers. `docker ps -a` confirmed the
existing stopped `soc-incident-report-protection-tidecloak-1` container. The
owner's `Get-NetTCPConnection -State Listen -ErrorAction Stop` check for ports
3000, 5001, 8080 and 8085 returned no output and no error: no listeners were
reported at that check. These are owner observations, separate from agent
results. Preserve the stopped TideCloak container and all saved data.
Agent follow-up: one `docker ps -a` formatted inventory still failed with
`open //./pipe/dockerDesktopLinuxEngine: Access is denied.` No retry of that
access method, build, startup or lifecycle operation followed. Agent access remains
blocked; owner inventory above supersedes the earlier missing stopped-container
and port evidence. Continue the reviewed owner procedure one step at a time.

Agent 21 October: Compose v2.38.1-desktop.1 available. Synthetic `config --quiet`
passed, exit 0, with an empty temporary env file and synthetic public settings;
private configuration was not loaded for that check. Static review supports
loopback bindings, internal database DNS, read-only adapter, health ordering and
export/import wiring; shell entrypoint LF endings confirmed.

Docker inventory failed in sandbox and one normal-access attempt:
`open //./pipe/dockerDesktopLinuxEngine: Access is denied.` No further daemon
retry, image build or service startup was attempted. Port-query empty output is
not proof of available ports. Container ownership, Tide readiness, image builds,
HTTP smoke tests were not verified by the agent; owner results above supersede
the earlier owner build/runtime gaps. Owner Docker restart persistence subsequently PASSED.
No application tests were repeated. Historical native emulator and owner browser
success are separate evidence and do not verify Docker.

Owner restart/persistence checks passed; independent peer retesting remains pending. Peer must use
the exact candidate and deployment files, own recognised account, and verify
login/request/review/history/audit with evidence still locked. Local URLs are
reachable on this machine only; this is not a public deployment. F8, genuine
Tide authority/expiry, Braces and uuid remain unresolved. Full PoC acceptance is
not claimed. Record runtime results before marking Week 9 complete.

### Rules-path correction — 22 October 2026

Latest owner verification: final Firestore build exit 0; Compose startup exit 0
with all three application services Healthy; fresh configuration-warning check
had no matches. Host curl to localhost:8085 failed with HTTP 000. Owner Compose
status showed only `8085/tcp`, without a published host port. HTTP 000 is a
transport failure, not a rule-enforcement result. Do not publish a port to test
rules. Use Node fetch inside the existing backend container on the storage
network, requesting `http://firestore:8085/v1/projects/demo-soc-incident-protection/databases/(default)/documents/socRulesProbe/nonexistent`
without headers or authentication and print only its HTTP status (expect 403).
Direct-client GET denial (403) and post-restart workflow comparison subsequently PASSED by owner; the
latest owner runtime results supersede the earlier final-build/start pending
statements below. Agent Docker access was not retried.

Owner startup warning confirmed `/app/docker/firebase/firestore.rules` was missing
and Firebase defaulted to allowing all reads/writes. This is a local container
setup defect, not a Tide defect. Treat the earlier healthy status as insufficient
for rules enforcement. Application API token verification was not changed.
The source confirms config-relative resolution: configuration is under
`/app/docker`, whereas Docker COPY places both rules and indexes under
`/app/firebase`. First correction used `../firebase/...`. Owner rebuild passed
(exit 0), but Compose startup failed (exit 1): Firestore exited (1), application
services did not start, and CLI reported `../firebase/firestore.rules is outside
of project directory`. File existence alone did not check CLI project containment;
the first correction was insufficient. Existing TideCloak start succeeded.

Final correction restores config-relative `firebase/...` for both files and
changes only their Docker COPY destination to `/app/docker/firebase/`. Both files
now remain inside the Firebase project directory and match their config paths.
Deny-client rules, indexes contents, entrypoint, Admin SDK behaviour, export and
dependencies are unchanged. The build-time configured-file existence check is
retained. Focused host assertions passed for project containment, COPY mapping,
both source files and retained deny-all rules. Owner final image build, runtime
direct GET denial and persistence subsequently passed. Docker access was
not retried. No failed-start export overwrite or data loss is assumed; preserve
both original export and backup and report any subsequent import error.

Agent backup completed before restart, using filesystem copy (no Docker access):
`C:\Users\Xnami\AppData\Local\Packages\sandbox.{04be9add-e915-472a-98f5-4fa872116ba2}\AC\Temp\SOC-firestore-backup-20261022T012401Z-b6b7ad945c2a456d8d3ed657685c907e\firestore`.
All four files matched relative paths and sizes; contents were not inspected or
hashed. Original export was preserved. Keep this temporary backup until a
separate durable owner backup is retained; temporary storage is not archival.
Rebuild only the `firestore` service, then
start the existing application Compose stack with `--no-build --wait`; leave
TideCloak alone. Its build-time configured-file check must pass. Check only fresh
startup logs for the missing-rules/default-allow warnings without sharing raw
logs. A direct unsigned Firestore REST GET must return 403, not 200/404. This is
a direct-client rules check, separate from the backend's unsigned API 401 check.
Finally owner privately compares the existing synthetic request, both decisions,
history and audit, and confirms evidence remains locked. Corrected-image
verification, warning removal, direct-client GET denial and reload comparison
are now owner-verified passes. No new secure-access finding is created.

## Historical public-hosting decision: strict $0 assessment — 20 October 2026

**No supported complete $0 deployment has been established.** No paid plan,
card-required signup/trial, temporary credit or pay-as-you-go allowance qualifies.
Cloud Run and its five implementation files remain UNAPPROVED/PAUSED; the older
paid option below is retained for history, not recommended under this budget.
No hosting was selected, provisioned or tested and no implementation file added.

**Hosted scan:** one gh run list attempt for exact SHA
8d55ac385da4041224a24080e069a3d8271477ad failed to connect to api.github.com.
The Security Scan/job output was not accessible, so its actual findings are NOT
verified. Do not replace them with the 17 October owner LOCAL audit (0 Critical,
1 High Braces GHSA-vfj7-8cjw-p6xm, 1 Moderate uuid GHSA-w5hq-g745-h8pq). No new
audit/test/install or retry was performed. Peer retest remains pending.

| Actual component                                           | Official free-tier evidence                                                                                                                                                                                                                                                                             | Strict $0 decision / limit                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Next.js frontend: Vercel Hobby candidate                   | Free for personal non-commercial use; no team collaboration; Hobby cannot connect organisation-owned Git repos. Included 100 GB transfer, 1M function invocations, 4 active CPU-hours/month; Hobby functions max 300 seconds and 2 GB/1 CPU. Limits can pause use rather than grant unlimited capacity. | Potential FRONTEND only, subject to actual project/account eligibility and no card/billing upgrade. Request-driven functions may cold-start; no persistent JVM/realm filesystem. Do not count this as the whole app. Signup/payment challenge was not tested.                                                                                                                                                                  |
| Express: Render Free web service candidate                 | Officially supports Node/Express/Docker, public HTTPS. 750 running hours/workspace/month; sleeps after 15 idle minutes, restart about a minute; single instance, ephemeral filesystem. Without payment method, limits suspend services/builds instead of buying more.                                   | Potential stateless API, not selected. Share the hour pool if hosting multiple services. Outbound database/API traffic can trigger suspension. CPU/RAM numbers were not exposed by the returned official pricing snapshot and are not invented; capacity/build must be verified before selection. Current emulator listener is unsuitable and paused Cloud Run wrapper assumes ADC: neither is declared a ready Render target. |
| Persistent application database: Firestore Spark candidate | No payment method needed. One free database; 1 GiB storage, 50k reads/day, 20k writes/day, 20k deletes/day and 10 GiB outbound/month. Not a sleeping/ephemeral web-service filesystem.                                                                                                                  | Possible persistent workflow store within hard quotas, with no linked billing account/Blaze. Keep server-only IAM and deny-all browser rules. External backend identity/secret injection requires a separate approved setup; no credentials inspected. Managed backup/PITR/restore/TTL features require billing and are excluded, so free recovery arrangements remain unverified.                                             |
| Public HTTPS TideCloak with persistent realm data          | Render Free has no persistent disk and loses local files on redeploy/restart/sleep. Its free Postgres expires after 30 days. Vercel serverless hosting does not establish durable Tide container hosting.                                                                                               | MISSING: supported durable identity host, HTTPS, adequate resources, backup/operator and compatible client policy. No ephemeral H2, expiring database or unsupported storage substitution accepted. No supported Tide external-database configuration is established.                                                                                                                                                          |
| Alternatives excluded by budget                            | Oracle Free Tier requires credit/debit-card verification. Firebase Functions/Cloud Run require billing/Blaze or pay-as-you-go eligibility, even with no-cost quotas.                                                                                                                                    | Excluded. No trials, temporary credits, payment cards or AWS coursework budgets.                                                                                                                                                                                                                                                                                                                                               |

These are partial candidates, not an approved architecture or proven $0 account
eligibility. No blanket claim that all worldwide free hosts are impossible.
The focused sources do not establish a supported durable TideCloak path under
the strict constraints. Generic free Postgres or a sleeping container is not
proof of compatibility with this Tide image and its realm/persistence contract.

**One recommendation:** keep complete deployment blocked and request an existing
PM/Tide/institution-provided identity host. Only after that gap and client policy
are confirmed should the frontend/API/Spark combination be selected and its
remaining resource, secret and recovery gates reviewed. No more implementation
files or provider research until that response/selection. F8/DPoP, genuine
Tide evidence authority/expiry, Braces and uuid remain separate unresolved work;
evidence stays locked. No security check or authentication setting is weakened.

Minimum PM/Tide question — draft only, NOT SENT:

> Can PM/Tide provide, at no cost to us and without a card or billing account,
> a maintained public-HTTPS TideCloak instance with persistent realm data and
> confirmed SDK 0.14.20/client-policy compatibility, or an approved institutional
> host for it?

A public frontend is a partial deployment. A complete usable deployment requires
reachable frontend/API, protected persistent application data and compatible
persistent HTTPS identity. A laptop/tunnel presentation depends on the owner's
running machine and network; it is a temporary demo, not that hosted deployment.
Do not mark Week 9 deployed or live-verified for either partial result.

Focused official references for this pass:

- https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits
- https://render.com/docs/free and https://render.com/docs/web-services
- https://render.com/pricing (returned snapshot did not expose CPU/RAM table)
- https://firebase.google.com/pricing
- https://firebase.google.com/docs/firestore/quotas
- https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- https://www.oracle.com/cloud/free/faq/

Only this existing assessment was updated. No repeated application checks or
installation, no new implementation files, no account/realm/service changes,
no Tide MCP call, and no quarantine access or modification. git diff --check
is the documentation-only validation; previous deployment-wrapper test results
below remain historical and do not establish free-host interoperability.

## Candidate and evidence

| Field                        | Current record                                                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Historical source candidate  | 8d55ac385da4041224a24080e069a3d8271477ad                                                                                                            |
| Branch                       | feature/soc-emergency-access-poc                                                                                                                    |
| Repository                   | origin: github.com/s3945794/Cyber-Immunity-Hackathon-Project-3                                                                                      |
| Remote evidence              | Local origin tracking ref matches; no fetch or live remote check                                                                                    |
| Historical entry worktree    | No tracked modifications; six accidental untracked files preserved unread                                                                           |
| Deployment preparation       | Uncommitted, NOT contained in the candidate above                                                                                                   |
| Approved deploy SHA          | PENDING review/publication and exact-SHA peer retest                                                                                                |
| Peer retest of candidate     | PENDING: no passing result found for this exact release                                                                                             |
| Deployed web/API/Tide URLs   | LOCAL owner-verified: http://localhost:3000 / http://localhost:5001 / existing Tide port 8080; no public URL                                        |
| Authorised cloud environment | NOT ESTABLISHED; no account, billing or credential inspection                                                                                       |
| Last audit                   | Owner 17 October: 0 Critical, 1 High Braces GHSA-vfj7-8cjw-p6xm, 1 Moderate uuid GHSA-w5hq-g745-h8pq; no qs advisories. Historical, not rerun today |
| Local qs evidence            | Owner 135 backend units/nine files; coverage 135/report, 79.24% lines; agent typecheck/lint/build/frozen and ten parsing checks passed              |
| Tide/browser limit           | Owner Edge InPrivate success is not peer portability; blocked-token alert inconclusive; F8 unresolved                                               |

Historical preparation-only observation (20 October; later owner local startup
is recorded above): no service started, private environment/adapter inspected, or AWS coursework
account/budget assumed. Provider config filenames and a disabled deployment
workflow do not establish funding, access or a usable hosted environment.

## Readiness decisions

| Issue                                                                                        | Classification                                                  | Gate                                                                                             |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| No approved project/budget/operator/DNS                                                      | Blocks deployment                                               | Explicit owner environment and spend approval                                                    |
| Exact-release peer retest missing                                                            | Blocks deployment                                               | Independent retest before public release; old owner/CI checks do not substitute                  |
| Existing backend image starts emulator-only listener                                         | Blocks deployment of that image                                 | Separate cloud wrapper prepared; image build/startup smoke test pending                          |
| Tide HTTPS endpoint, immutable image, proxy/hostname, durable database/backup contract       | Blocks deployment                                               | Laptop H2/latest image is not verified internet hosting; supported operator recipe required      |
| Matching issuer/client/JWKS and fresh-peer login                                             | Blocks deployment                                               | No loopback identity; DPoP-required client cannot use incomplete Bearer integration              |
| F8/proof-aware DPoP integration                                                              | Blocks full PoC acceptance; deployment if required by client    | Separate runtime approval; no weakening settings or flag-only fix                                |
| Genuine encryption/quorum/scope/Fabric expiry                                                | Blocks full PoC acceptance                                      | Six missing contracts remain in capability assessment; approvals/deadlines never unlock evidence |
| Braces/uuid findings                                                                         | Blocks deployment unless explicit restricted-beta risk approval | No fix/suppression/green audit claim; synthetic data only                                        |
| Cold starts, single region/identity VM, shared-IP process-local rate limits, broad frame-src | Restricted beta only with explicit approval                     | No production availability or security claim; proxy trust unchanged                              |
| Native pnpm.exe and real induced callback-failure browser verification                       | Documented limits                                               | No substitution of mocks/owner happy path for these checks                                       |

Recommendation: prepare a synthetic-data restricted beta. Public launch is NOT
ready today. Full protection acceptance remains blocked even if beta deployment
is later approved. Tide hosting/DPoP and evidence-authority contracts are separate.

## Archived paid option — Cloud Run (unapproved; excluded by strict $0 budget)

New owner-approved Google Cloud project in australia-southeast1:

- Cloud Run soc-web: existing standalone frontend Dockerfile, port 3000,
  1 CPU/512 MiB, minimum 0/maximum 1 instance; managed HTTPS.
- Cloud Run soc-api: new deploy/cloudrun/backend.Dockerfile and serve.cjs,
  port 8080/0.0.0.0, same size/scaling; existing Express factory, token checks
  and locked evidence. This is not the emulator server or a Firebase Function
  deployment of lib/index.js. /api/me remains authentication-only.
- Firestore Native (default): persistent server-only workflow/audit data; dedicated
  project, ADC runtime identity, committed indexes and deny-all browser rules.
  Admin SDK uses IAM, not rules. No emulator, local export import or static key.
- Secret Manager soc-client-adapter: numeric pinned version injected as
  CLIENT_ADAPTER. API identity gets secretAccessor on only this secret plus
  roles/datastore.user in the dedicated project; web gets no database/secret roles.
- Artifact Registry soc: two images pinned by digest, full release SHA labels.
- Tide reservation: one e2-standard-2 VM (2 vCPU/8 GiB), 20 GiB boot disk,
  separate 40 GiB persistent data disk, static IP and owner-controlled HTTPS
  hostname. Sizing proposal only: supported image digest, proxy/hostname,
  database, restart, backup/restore and safe logging contract remain required.
  Do not transplant generic Keycloak flags. If external SQL is required, revise
  resources/cost before approval. Never expose admin/management/database ports.

Cloud Run ephemeral disk cannot retain Tide H2 or application records. No free
hosting assumption covers this stack. VM lifecycle is independent of scale-to-zero.
A local Docker URL is not peer-accessible deployed hosting.

Planning allowance: **USD 100–150/month**, low-traffic beta, continuous identity
VM plus disks/IP, two scale-to-zero services, database/images/secrets/backups and
limited logs/egress. Not a regional quote or cost cap; excludes domain/Tide licence,
tax/currency and any SQL. Owner must price exact Sydney resources in the official
calculator and approve budget/test window/shutdown owner. Alerts do not cap spend;
stopped VMs can retain billable disks/IP/backups. No credits/AWS budget assumed.

## Tide and origins

Use exact stable HTTPS origins. Cloud Run short names have deterministic URLs
https://SERVICE-PROJECT_NUMBER.REGION.run.app; verify actual assigned URLs before
exposure and stop on mismatch. No wildcard redirects/CORS. NEXT_PUBLIC_API_URL
is API ORIGIN without /api; client helpers append /api. Cloud Run forwards those
paths unchanged, with no Firebase function-name prefix or new proxy rewrite.

Tide operator must confirm without sharing adapter/credential contents:

- Exact public HTTPS base URL, realm/public client, SDK 0.14.20 compatibility and
  server version/image digest; issuer/client/embedded JWKS match backend export.
- Exact redirect WEB/auth/redirect, silent WEB/silent-check-sso.html, web origin,
  and approved logout target (verify SDK target before registering exact path).
- Code flow, PKCE S256, state/nonce, token signature/issuer/client checks preserved;
  no browser client secret, role workaround, new account or evidence unlocking.
- Bearer compatibility explicitly established. If client requires DPoP, stop:
  no disabling it, flag-only activation or failed relay lookup repetition.
- Supported public proxy/hostname/TLS, persistent database, backup, health,
  restart, admin restriction and log-redaction recipe. Existing Compose is LOCAL,
  mutable latest/H2 instructions alone do not establish safe supported hosting.
- Preserve frame protections and narrow silent-SSO exception; test real fresh-peer
  login. Current broad frame-src needs explicit beta security review.

Evidence-authority APIs remain the six contracts in SOC-TIDE-CAPABILITIES.md.
Reuse its unsent question; do not invent cryptography or repeat broad lookups.

## Prepared files and names (no secret values)

New deploy/cloudrun/: serve.cjs, serve.test.cjs, backend.Dockerfile,
api.service.yaml, web.service.yaml. Reuse frontend/Dockerfile unchanged. No CI
activation or dependency change. Frozen image install skips lifecycle scripts,
as existing Docker targets do; build/age/integrity policy is not relaxed. Actual
image build and contents remain unverified; development tooling is still copied,
so do not assume Braces is excluded from images merely because it is a dev path.

Public frontend build names: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL,
NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL,
NEXT_PUBLIC_TIDECLOAK_REALM, NEXT_PUBLIC_TIDECLOAK_CLIENT_ID,
NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED, NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI.

API runtime: NODE_ENV, PORT (provider injected), GCLOUD_PROJECT, CORS_ORIGIN,
TIDECLOAK_AUTH_SERVER_URL, TIDECLOAK_REALM, TIDECLOAK_CLIENT_ID; secret
CLIENT_ADAPTER. No FIRESTORE_EMULATOR_HOST, SOC_LOCAL_DEMO=true,
SOC_DEMO_SHORT_DURATION=true, FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 or
GOOGLE_APPLICATION_CREDENTIALS. Use attached service identity/ADC.

Identity bootstrap, only if required by approved Tide recipe:
KC_BOOTSTRAP_ADMIN_USERNAME / KC_BOOTSTRAP_ADMIN_PASSWORD; remaining supported
hostname/database/runtime names must be supplied, not guessed.

## Approval-gated operator commands — NOT EXECUTED

Owner must first approve dedicated project/billing, budget, residual risk and
Tide prerequisites. Use a new clean exact-SHA checkout; never upload this working
directory with accidental files. No source deployment/archive upload command.
Check each command exit code and stop on failure. Install approved operator CLIs
separately; no gcloud availability, signed-in session or provider access assumed.

### Provision approved app resources

```powershell
$SocProject = Read-Host 'Approved dedicated Google Cloud project ID'
$SocRegion = 'australia-southeast1'
gcloud services enable run.googleapis.com artifactregistry.googleapis.com firestore.googleapis.com secretmanager.googleapis.com compute.googleapis.com --project=$SocProject
gcloud artifacts repositories create soc --repository-format=docker --location=$SocRegion --project=$SocProject
gcloud iam service-accounts create soc-api --project=$SocProject
gcloud iam service-accounts create soc-web --project=$SocProject
gcloud projects add-iam-policy-binding $SocProject --member="serviceAccount:soc-api@$SocProject.iam.gserviceaccount.com" --role=roles/datastore.user
gcloud firestore databases create --database='(default)' --location=$SocRegion --type=firestore-native --project=$SocProject
gcloud secrets create soc-client-adapter --replication-policy=automatic --project=$SocProject
gcloud secrets add-iam-policy-binding soc-client-adapter --member="serviceAccount:soc-api@$SocProject.iam.gserviceaccount.com" --role=roles/secretmanager.secretAccessor --project=$SocProject
```

Owner enters adapter into the provider secret UI; record version number only.
Never echo or pass secret values as CLI/build arguments. Deploy committed rules
and indexes using the approved pinned Firebase CLI with explicit project and
only firestore:rules,firestore:indexes. No new CLI installation assumed.
Tide VM/disk/DNS launch commands are withheld until a supported hosting contract
exists; the resource reservation above is not a fabricated vendor manifest.

Exclude raw Cloud Run request logs BEFORE traffic: callback query URLs can contain
codes. Dedicated project example (requires separate operator permission):

```powershell
gcloud logging sinks update _Default --project=$SocProject --add-exclusion='name=soc-http-metadata,filter=resource.type="cloud_run_revision" AND log_id("run.googleapis.com/requests")'
```

Confirm no other sink/export captures these requests. Never log headers, cookies,
query strings, request/response bodies, adapters or raw SDK errors. Fixed startup
codes/counters only. Confirm Tide/proxy redaction before public launch.

### Build exact approved release

```powershell
$SocReleaseSha = Read-Host 'Approved full SHA containing deployment files'
if ($SocReleaseSha -notmatch '^[0-9a-f]{40}$') { throw 'Full SHA required' }
if ((git rev-parse HEAD) -ne $SocReleaseSha) { throw 'Wrong release checkout' }
if (git status --porcelain) { throw 'Use a clean release checkout' }
$SocNumber = gcloud projects describe $SocProject --format='value(projectNumber)'
$SocWebOrigin = "https://soc-web-$SocNumber.$SocRegion.run.app"
$SocApiOrigin = "https://soc-api-$SocNumber.$SocRegion.run.app"
$SocTideOrigin = Read-Host 'Approved HTTPS Tide origin, no query or credentials'
$SocRealm = Read-Host 'Approved public realm name'
$SocClient = Read-Host 'Approved public client ID'
$SocRegistry = "$SocRegion-docker.pkg.dev/$SocProject/soc"
gcloud auth configure-docker "$SocRegion-docker.pkg.dev"
docker build --platform linux/amd64 --file deploy/cloudrun/backend.Dockerfile --label "org.opencontainers.image.revision=$SocReleaseSha" --tag "$SocRegistry/api:$SocReleaseSha" .
docker build --platform linux/amd64 --file frontend/Dockerfile --label "org.opencontainers.image.revision=$SocReleaseSha" --build-arg "NEXT_PUBLIC_API_URL=$SocApiOrigin" --build-arg "NEXT_PUBLIC_APP_URL=$SocWebOrigin" --build-arg NEXT_PUBLIC_APP_NAME=SOC --build-arg "NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL=$SocTideOrigin" --build-arg "NEXT_PUBLIC_TIDECLOAK_REALM=$SocRealm" --build-arg "NEXT_PUBLIC_TIDECLOAK_CLIENT_ID=$SocClient" --build-arg NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED=all --build-arg "NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI=$SocWebOrigin/auth/redirect" --tag "$SocRegistry/web:$SocReleaseSha" .
docker push "$SocRegistry/api:$SocReleaseSha"
docker push "$SocRegistry/web:$SocReleaseSha"
```

Record image digests and use REGISTRY/api@sha256:... and web@sha256:... in YAML,
not mutable tags. Public NEXT_PUBLIC values are frozen at build time; rebuild if
changed. Never source private local environment files or include adapters in images.

Render YAML in a temporary directory using only these public substitutions:
SOC_PROJECT, SOC_API_IMAGE, SOC_WEB_IMAGE, SOC_WEB_ORIGIN, SOC_TIDE_ORIGIN,
SOC_TIDE_REALM, SOC_TIDE_CLIENT_ID, SOC_ADAPTER_VERSION. Use digest image references,
HTTPS origins, scalar-safe project/realm/client identifiers and a numeric secret
version. Reject unreplaced placeholders; no secret contents in YAML. YAML syntax
validation is not provider schema acceptance. Do not run local Compose config
with private environment interpolation. Service templates create no IAM binding.

### Private revisions, then separate public exposure

```powershell
gcloud run services replace SOC_RENDERED_API_YAML --region=$SocRegion --project=$SocProject
gcloud run services replace SOC_RENDERED_WEB_YAML --region=$SocRegion --project=$SocProject
gcloud run services describe soc-api --region=$SocRegion --project=$SocProject --format='value(status.url,status.latestReadyRevisionName)'
gcloud run services describe soc-web --region=$SocRegion --project=$SocProject --format='value(status.url,status.latestReadyRevisionName)'
```

NEW services default to IAM-private; reused names might already have public
bindings. Verify effective IAM first; stop on unexpected allUsers or
allAuthenticatedUsers access. Compare actual assigned URLs to approved origins.
Use the owner's approved private access method without displaying Cloud Run
identity tokens. Platform identity tokens and application Tide tokens are distinct;
no manual token copying into terminal history. Probes check listener health only.

Only after an explicit public-exposure approval and all readiness gates:

```powershell
gcloud run services add-iam-policy-binding soc-api --member=allUsers --role=roles/run.invoker --region=$SocRegion --project=$SocProject
gcloud run services add-iam-policy-binding soc-web --member=allUsers --role=roles/run.invoker --region=$SocRegion --project=$SocProject
```

API protected routes still require valid Tide tokens; public invocation/CORS is
not authentication. Do not set broad trust proxy: current rate limiting may group
proxied peers by IP and is process-local. Test this limit explicitly in beta.
Record full deployed SHA, URLs, image digests, revisions, date, operator, approval
reference and adapter version in the release table. No login/action URLs recorded.

## Startup, persistence, logs and recovery

Order: approved Firestore/IAM/rules/indexes and secret; supported Tide HTTPS with
persistent store; private API; private frontend; validation; approved exposure;
peer live checks. Liveness does not prove database/Tide readiness. Cloud Run
replaces failed instances; all workflow persistence stays in managed Firestore.
Tide host/container restart/health must follow supported recipe, not the local
no-restart Compose file. Preserve accounts and no laptop data import.

Before rollout: managed Firestore export to an approved protected backup bucket;
consistent Tide database backup using supported tool. Restore exercise pending.
Keep identity/key material and secret versions protected, never in Git. Existing
emulator seed/export/reload success is not a cloud backup/restore pass. Running-H2
disk snapshot is not accepted as a consistency guarantee. Backups incur charges.

Rollback: keep previous compatible image digests/revisions, public build settings
and adapter secret versions. Example (after approval): gcloud run services
update-traffic soc-api --to-revisions=APPROVED_PREVIOUS_REVISION=100 --region=REGION
--project=PROJECT, and soc-web. Check client/secret compatibility first. Code
rollback does not undo database writes. No destructive restore without approval.

Shutdown: remove public allUsers invoker bindings from both services and verify
private access; take approved backups, then stop identity VM through its supported
procedure. Never delete volumes/database/accounts or use compose down -v. Private
services can still run for authorised callers; max instances is not a cost cap.
Disks/IP/images/database/backups can remain billable after stopping VM/services.

## Minimum acceptance and peer handoff

Before deployment: immutable-SHA independent peer retest; project/budget/operator
and residual-risk approval; Tide HTTPS/version/persistence/logging/client contract;
image build and container startup/health smoke tests using synthetic data; backup/
restore readiness. No existing app test is repeated for docs-only changes. New
wrapper synthetic tests use fake listeners and never start services:

```powershell
node --check deploy/cloudrun/serve.cjs
node --test --test-isolation=none deploy/cloudrun/serve.test.cjs
```

Image builds, provider schema acceptance, real container binding/SIGTERM, cloud
ADC/IAM/indexes, protected persistence and peer live login remain separate checks.
New wrapper tests do not claim Windows/cloud process or Tide interoperability.

Peer message draft (NOT SENT):

> Please verify the approved SOC beta at the recorded web URL and exact release
> SHA. Use your own private login. Check dashboard/incidents, one-field read
> requests for 15/30/60 minutes, self-review rejection, two distinct other SOC
> reviewers, cancellation/history/audit and logout. Evidence must remain locked
> even after approval. Verify unsigned API access is 401. Coordinate persistence
> after an operator-approved restart. Report PASS/FAIL with safe page/status
> observations only; no credentials, tokens, headers, callback URLs or raw errors.

Public health should be 200; it does not replace authenticated workflow testing.
Record restart/persistence, CORS/cold-start/rate-limit and four-identity results
separately. If F8 reoccurs, stop that path without weakening client policy.

Historical public-cloud Planner draft (paused/unapproved; superseded for local scope by the current local record above): **Public deployment BLOCKED.**

- [x] Inspect candidate, prior evidence, Docker and hosting configuration.
- [x] Prepare environment proposal, public/secret names and deployment files.
- [x] Update access/setup instructions and document limitations.
- [ ] Independent peer retest of exact approved deploy release.
- [ ] Owner project/budget/risk and public-exposure approval.
- [ ] Supported Tide HTTPS/image/persistence/logging and client compatibility.
- [ ] Image build/smoke tests and backup/restore readiness.
- [ ] Deploy approved release and record real URLs/SHA/digests/revisions.
- [ ] Peer live verification and final Planner completion.

## Preparation verification — 20 October 2026

- PASS: node syntax checks for both new CJS files.
- PASS: 18 new node:test cases with fake listeners/process/timers; no HTTP port
  opened. Covers binding, production/emulator/static-key guards, fixed safe
  failure stages, synthetic-secret non-disclosure, drain and eight-second timeout.
- PASS: both service YAML templates rendered IN MEMORY with synthetic public
  values and parsed using installed js-yaml. Checked ports, probes, max scale,
  secret references and no emulator container/setting. No private files read.
- PASS: static explicit-COPY/frozen-install/non-root checks on both Dockerfiles.
- PASS: PowerShell parser accepted all six command blocks WITHOUT execution.
- PASS: targeted Prettier formatting and git diff --check. Formatter touched
  only the explicitly named files; no application/dependency files changed.
- Docker CLI 28.3.0 exists; no daemon, image build or container startup was invoked.
  gcloud was not found by command discovery; no cloud authentication was attempted.
- Existing application tests/builds/audit were NOT repeated: application modules,
  dependency graph and authentication remain unchanged. New wrapper mocks do not
  prove real cloud startup, provider YAML schema, ADC, IAM, persistence or Tide.

A first long documentation-write command exceeded the Windows launcher command
length and did not execute; smaller writes completed. No unsafe fallback, service
operation or permission bypass was used. Preparation does not close any deployment
or full-PoC acceptance blocker listed above.

## Official sources checked 20 October 2026

- https://cloud.google.com/run/docs/container-contract
- https://cloud.google.com/run/docs/triggering/https-request
- https://cloud.google.com/run/docs/configuring/services/secrets
- https://cloud.google.com/run/docs/configuring/healthchecks
- https://cloud.google.com/firestore/native/docs/security/iam
- https://cloud.google.com/run/pricing
- https://cloud.google.com/firestore/pricing
- https://cloud.google.com/products/compute/pricing
- https://cloud.google.com/compute/disks-image-pricing
- https://cloud.google.com/artifact-registry/pricing
- https://cloud.google.com/billing/docs/how-to/budgets
- https://docs.tide.org/Core-Concepts/dpop

Provider docs confirm managed HTTPS/ephemeral Cloud Run disks, secret bindings,
server IAM and billable resource classes; prices vary by region/use. Planning
allowance is not a provider quote. Focused Tide hosting page requests returned no
usable recipe; no supported proxy/database/image contract was established. No
Tide MCP calls or failed asset-lookup repetition. Reprice at approval.
