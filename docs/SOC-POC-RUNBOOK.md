# SOC PoC independent laptop runbook

Updated 8 October 2026. **Draft: independent clean-clone startup is NOT VERIFIED.
The complete Tide protection PoC is incomplete.** This runbook describes the
current feature's native emulator demo. Older root/TideCloak documents contain
historical "no emulator", "roles not created" and unfinished-auth statements;
read their dated setup evidence, not those statements as current runtime status.

Use [the handoff](SOC-POC-HANDOFF.md), [peer cases](SOC-PEER-TEST-PLAN.md) and
[results template](SOC-PEER-TEST-RESULTS-TEMPLATE.md). All commands below are for
the teammate to run on **their own laptop/clone**. Startup steps were
source-reviewed, not executed as a fresh setup. The checks executed in the
current agent environment are recorded in section 10.

## 1. Published test version — required before cloning

Repository: https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git.
Branch: feature/soc-emergency-access-poc. Current owner HEAD:
27b09cbc52b6fb6ed69803b38c55e7f29c6699ee.

**Required implementation is still uncommitted and is absent from that HEAD.**
No feature remote-tracking ref was found locally; remote branch availability was
not checked. The owner must review/publish the complete approved test version,
grant repository access and provide its full commit SHA. A source-only clone of
the current baseline is insufficient. Do not substitute an archive of the
owner's working directory, private configuration or runtime data.

After publication, in a normal PowerShell terminal:

```powershell
git clone --branch feature/soc-emergency-access-poc --single-branch https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git soc-incident-report-protection
Set-Location -LiteralPath 'soc-incident-report-protection'
git branch --show-current
git rev-parse HEAD
git status --short
$socExpectedSha = Read-Host 'Full published test SHA supplied by the owner'
if ($socExpectedSha -notmatch '^[0-9a-fA-F]{40}
```

Compare HEAD with the full SHA supplied by the owner. Stop if the branch is
unavailable, HEAD differs, or required demo scripts/docs are missing. Record the
tested SHA before installation. Do not reset an existing checkout or overwrite
someone else's work. A later patched version needs a new test record.

## 2. Tools and compatibility

| Tool/package              | Requirement and evidence                                                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git                       | Git 2.x; repository access through the tester's own approved Git setup                                                                                                     |
| Node                      | Repository/backend require >=22; use 24.19.0 to match the owner's inspected runtime                                                                                        |
| pnpm                      | Use 11.19.0, matching the reviewed workspace policy schema and owner's runtime; root minimum >=10 alone is not a verified alternate toolchain                              |
| Java                      | 21 or newer for the emulator; owner runtime inspection found 23.0.2; Docker's Java 21 recipe has not been run here                                                         |
| Docker Desktop            | Linux containers and Compose v2 for TideCloak; CLI 28.3.0 was detected, but daemon access was denied; no compatible Desktop/daemon version was independently tested        |
| Firebase emulator tooling | scripts/demo.cjs/test-emulator.cjs use pnpm dlx firebase-tools@14.16.0; first use needs package/emulator download and cache permission                                     |
| Browser                   | Current Edge or Chrome; four separate profiles; Edge is a reported workaround, not a proven Chrome fix                                                                     |
| Application packages      | Existing pnpm-lock.yaml; Next 16.3.6, React 19.2.4, Tide nextjs/react/js 0.14.20; no Tide SDK upgrade                                                                      |
| TideCloak image           | Existing tideorg/tidecloak-dev:latest; mutable tag. Owner local image ID is recorded below; registry pull digest/software version and peer compatibility remain unverified |

Install prerequisites from the official [Node](https://nodejs.org/en/download),
[pnpm](https://pnpm.io/installation), [Docker Desktop](https://docs.docker.com/desktop/)
and [Temurin Java](https://adoptium.net/temurin/releases/) distribution guidance;
select the versions above and use your organisation's normal software approval.
No tool installer or new dependency was run by the agent.

Check tool versions locally. Do not share Docker configuration or resolved
Compose environment. Access to the package registry, Docker image source and
Tide's hosted identity/Fabric infrastructure may be needed; "independent" means
no connection to the owner's laptop, not an offline Tide deployment.

## 3. Frozen installation and private configuration

```powershell
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Installation failed; stop without bypassing package policies.' }
```

Keep existing overrides, allowBuilds and supply-chain verification. Do not run
forced audit fixes or broaden upgrades. The disabled Tide JS postinstall is
intentional; frontend/public/silent-check-sso.html is already supplied (learning
ISSUE 007). A normal install may install local Git hooks. Do not stage or commit
merely to finish setup.

In a genuinely fresh clone only:

```powershell
if (Test-Path -LiteralPath '.env') { throw 'Existing private configuration: review it privately instead of overwriting it.' }
Copy-Item -LiteralPath '.env.example' -Destination '.env'
```

The tester edits their own root configuration privately. Never send it to the
owner or put credentials on a command line. Only the permitted .env.example
template and source references were reviewed; no real environment, credential,
private adapter or user configuration file was inspected. Generated frontend/.env.local
and backend/.env are not edited directly.

### Configuration names, purposes and source of the tester's values

| Name                                  | Purpose                                | Where the tester obtains their own value                                                                                               |
| ------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| KC_BOOTSTRAP_ADMIN_USERNAME           | Local master-realm bootstrap admin     | Choose privately for the new local instance; not an application SOC account                                                            |
| KC_BOOTSTRAP_ADMIN_PASSWORD           | Bootstrap secret                       | Choose a strong private value for the new instance                                                                                     |
| NEXT_PUBLIC_APP_URL                   | Browser app origin                     | Their own local origin; normal native demo uses http://localhost:3000                                                                  |
| NEXT_PUBLIC_APP_NAME                  | Public display label                   | Choose a non-sensitive label                                                                                                           |
| NEXT_PUBLIC_API_URL                   | Browser API base, without /api suffix  | Their own backend; normal demo uses http://localhost:5001                                                                              |
| NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL | Public authentication server base      | Their own new TideCloak; normal demo uses http://localhost:8080                                                                        |
| NEXT_PUBLIC_TIDECLOAK_REALM           | Public realm name                      | The realm they create in the wizard                                                                                                    |
| NEXT_PUBLIC_TIDECLOAK_CLIENT_ID       | Public OIDC client ID                  | Their own wizard-created client                                                                                                        |
| NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED    | SDK OIDC setting                       | Established localhost guidance uses external; not a production TLS decision                                                            |
| NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI    | Optional explicit callback             | Their own app origin plus /auth/redirect; default comes from the browser origin                                                        |
| CORS_ORIGIN                           | Exact permitted browser origin         | Their own app origin; no wildcard                                                                                                      |
| PORT                                  | Native backend port                    | Demo wrapper forces 5001; an alternate value is not supported by this native sequence                                                  |
| CLIENT_ADAPTER                        | Server-only full Tide adapter JSON     | Export from the tester's own approved realm/client via Tide-specific installation provider; optional if own data/tidecloak.json exists |
| FIREBASE_SERVICE_ACCOUNT_KEY_BASE64   | Cloud-only backend secret              | Leave empty for this emulator demo; no cloud project, console or key is needed                                                         |
| SOC_LOCAL_DEMO                        | Explicit local storage mode            | demo:backend/emulator force true; do not use as an authentication bypass                                                               |
| GCLOUD_PROJECT                        | Dedicated emulator project             | Scripts force demo-soc-incident-protection; no real cloud project                                                                      |
| FIRESTORE_EMULATOR_HOST               | Local Firestore destination            | Native scripts force 127.0.0.1:8085                                                                                                    |
| SOC_DEMO_SHORT_DURATION               | Optional trusted 60-second demo choice | Default false; set only in the tester's backend process if intentionally testing this menu                                             |
| SOC_CONTAINER                         | Container listener mode                | Compose-controlled only; leave unset for native use                                                                                    |
| SOC_TEST_MARKER                       | Isolated probe marker                  | Created by test-emulator.cjs; do not set or reuse manually                                                                             |

No Stitch or E2E credential variables are needed for these manual peer tests.
Do not add secrets under NEXT_PUBLIC_. The frontend configuration contains public
OIDC fields only; the full adapter remains server-only. Never transfer the owner's
adapter, realm database, data directory, Docker volumes or enrollment links.

## 4. Fresh local TideCloak and manual setup

**Historical single-laptop wizard success is documented in TIDECLOAK-LOCAL.md
and learning ISSUE 005/006/009/010. Fresh peer reproduction is unverified.**

Use a new clone directory on the teammate's laptop. Its ./data must be new and
must not point at any existing TideCloak data directory. If another local instance
or service owns port 8080, stop and agree an isolated setup; do not replace that
service, attach its database or delete its data. The wrapper creates a
project-scoped container, has no fixed global container name and keeps ./data.
Only the teammate's own new instance is part of these instructions.

After the tester supplies their own bootstrap configuration:

```powershell
pnpm run tidecloak:start
pnpm run tidecloak:status
```

The wrapper checks nonblank bootstrap configuration and probes the root HTTP
endpoint. A response below 500 proves reachability only; it does not prove token
exchange, account linking, governance, ORK quorum or evidence authority.

### Owner-observed local image and application settings

The owner reports this **local Docker image ID** for the working instance:

```text
sha256:0d0f1009548bae5f8a3c9c7bd0df59ca0edaa25e89ea8dc6390b5e4593f68a5e
```

This is not a registry pull digest or a TideCloak software version. It does not
provide a reproducible registry image pin; the existing latest tag is mutable.
No image lookup, pull or configuration change was performed by the agent.

The owner's current Capability Config screenshot shows:

| Setting                   | Owner-observed value |
| ------------------------- | -------------------- |
| Require DPoP bound tokens | Off                  |
| Require PKCE              | On                   |
| PKCE Method               | S256                 |

These describe the existing working application. They are not a verified fresh-
laptop security procedure or permission to change existing settings. The DPoP
fresh-client limitation below remains open.

### Established realm/client checklist

1. Open the tester's local admin console and use their private bootstrap admin.
   Use the built-in **Create a Tide realm** wizard; do not invent/import a minimal
   realm.json. The historical wizard created the Tide connection/licence, linked
   administrator, client and QEA workflow. If it is absent or provisioning fails,
   stop and record the failed stage; do not substitute another bootstrap API.
2. Choose the project reference realm soc-incident-report-protection and public
   client soc-incident-report-protection-app, or record the tester's own names
   privately and keep browser/backend configuration consistent. These are design
   names, not exported account identities.
3. Use the app **base origin** http://localhost:3000 in the wizard field labelled
   Redirect URI. The recorded wizard appended callback paths; entering the callback
   itself created a duplicated path. Review generated values before authorising.
4. Established reference client: public client; Standard/Authorization Code flow
   enabled; Direct access grants disabled; PKCE required with S256. Web origin is
   http://localhost:3000. Source uses /auth/redirect and /silent-check-sso.html.
   The full supported fresh-client redirect and post-logout configuration has
   not been established. Do not copy a historical wildcard or broaden origins/
   redirects to hide an error. Confirm logout returns to the intended local app under the
   actual approved client settings; exact fresh-client post-logout settings were
   not established by the existing guide.
5. Review and authorise every generated governed/QEA change using the new realm's
   authorised governance identities. Five changes were reported historically,
   but neither that number nor a quorum is a universal setup rule. Do not bypass
   governance, change its quorum or reuse application approvals as setup authority.
   Ragnarok/offboarding was left disabled in the historical local setup; do not
   enable later features for this test.
6. **Client security blocker:** ISSUE 010 records a historical missing-DPoP-proof
   failure and a governed local workaround that turned the requirement off,
   reducing replay protection. This task does not approve repeating that change.
   Obtain the supported fresh-client flow compatible with the unchanged SDK,
   preserving DPoP, PKCE, token verification and governance. Do not turn DPoP
   off to finish setup. If proof support cannot be established, mark setup Blocked.

### Four separate identities and matching roles

| Private test alias | Realm role machine name | Display label   |
| ------------------ | ----------------------- | --------------- |
| A                  | soc-analyst             | SOC Analyst     |
| B                  | soc-supervisor          | SOC Supervisor  |
| C                  | soc-team-leader         | SOC Team Leader |
| D                  | soc-manager             | SOC Manager     |

Create these four role definitions, if absent, in the tester's new realm using
the established design in tidecloak/roles.json. Review/authorise the resulting
QEA changes and confirm effective membership privately. Display labels are not
authority. All four roles can request and review other users; there is no
hierarchy or exclusive reviewer role.

Create four separate test identities owned by the tester, and link each to a
different Tide identity through the supported enrollment workflow. Assign each
its matching role through governance. The bootstrap administrator, linked
governance identity and four SOC test identities are distinct concepts; do not
assume bootstrap credentials log in on Tide's hosted authentication page. A local
password added in TideCloak does not establish external Tide account credentials.

### Owner-observed account setup sequence

For the teammate's own local realm, the owner reports these actions:

1. Users → Add user → Credentials → Credential Reset → Link Tide Account.
2. Open the enrollment link privately. Select Create account, enter and confirm
   the teammate's own credentials. The owner skipped the email step; that is a
   local observation, not an established requirement for every enrollment.
3. Return to Users → select user → Role mapping → Assign realm role.
   Assign the matching SOC realm role from the table above.
4. Repeat for four distinct test accounts owned and Tide-linked by the teammate.

Approved Change Requests and successful sign-ins were observed by the owner.
The exact approval/commit button sequence remains unconfirmed; Approved alone
does not prove that a separate commit action occurred. Do not invent that step,
its order or a quorum. Existing owner accounts are not recreated or changed.

**Remaining onboarding blocker:** action names are now owner-observed, but the
exact governance prerequisites/approval/commit sequence and failure recovery
are not established for a new laptop. Independently validate the walkthrough
with the actual image and approved client posture before claiming setup works.
Do not invent an enrollment endpoint, copy another person's link or add broad
selfdecrypt permissions. If linking or governed assignment cannot complete,
mark first launch Blocked.

Teammates need their own local realm, four linked test accounts, passwords and
adapter. Existing owner accounts are local/private runtime state, not Git files;
Git does not transfer those accounts to the teammate's laptop.

### Historical partial Change Requests evidence — earlier 8 October 2026

The owner reports that a partial TideCloak Change Requests screen shows Approved
entries for:

- Creating the four SOC roles and four test users.
- Granting roles to users.
- Setting tideInvitable to true.
- Setting the application DPoP attribute to false.
- Updating client redirect URIs and web origins.

The owner confirms all four existing accounts can sign in. The agent did not
inspect the screenshot or record identities, IDs or other identifiers.

Approved is the displayed status, not proof of a separately completed commit
step. The partial history does not establish exact action/button order, approval
requirements, a complete linking procedure or fresh-laptop reproducibility.
At that stage, the attribute-change history did not establish the current
Capability Config field value; the later owner screenshot values are now
recorded above. tideInvitable=true alone did not establish the linking action
sequence; the owner has since supplied the observed actions above.
This evidence is not permission to change security settings or existing accounts.
Independent startup and live Tide/JWT/Fabric verification remain unverified;
evidence remains locked.

### Owner questionnaire — only the remaining non-secret details

The owner has already created and successfully used four distinct local accounts.
Do not recreate or change them. Answer from that completed setup using action
names and settings only. This does not prove startup on another laptop.

| Topic                                | Already supported / owner evidence                                                                                                                                                                                                                                     | Remaining answer needed                                                                                                                                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Image identity/version            | Compose uses mutable tideorg/tidecloak-dev:latest. Owner local image ID is recorded above; it is not a registry pull digest or software version                                                                                                                        | Which TideCloak software version and registry pull digest, if safely available, correspond to that local image? Do not resend the known local image ID or a Docker configuration dump                                                               |
| 2. Fresh realm/client                | Reference wizard/client settings documented. Current owner Capability Config shows Require DPoP bound tokens Off, Require PKCE On, PKCE Method S256. Approved redirect/web-origin changes were reported; exact values and fresh compatibility are not established      | What exact current redirect URI, web-origin and post-logout settings are needed for the fresh client? Identify only differences from the reference setup. Current DPoP/PKCE labels and values do not need repeating; do not change settings         |
| 3. Account creation and Tide linking | Owner-observed Users/Add user/Credentials/Credential Reset/Link Tide Account sequence, private Create account enrollment with email skipped locally, and Role mapping/Assign realm role are recorded above; all four owner sign-ins succeeded                          | No additional action-name answer is needed. Independent fresh-laptop execution and failure recovery remain unverified; do not send identities, passwords or enrollment/action links                                                                 |
| 4. Governed role assignment          | Four roles and matching assignments known. Owner observed Role mapping → Assign realm role and Approved Change Requests. Historical ISSUE 001 records Bulk Authorize/Bulk Commit for role definitions; that does not establish current account-assignment button order | What exact actions and order approve/commit account-to-role changes, with what governance prerequisites? Was there a separate commit action, and how was effective membership confirmed? Use generic governance roles; omit identity/signing values |
| 5. Provider adapter export           | Owner observed Apps → soc-incident-report-protection-app → Credentials → Tide adapter → Download tidecloak.json; screenshot confirms the control. Existing provider reference and ignored data/tidecloak.json destination are documented                               | No additional export-menu answer is needed. Downloaded contents and independent export/use remain unverified. Each teammate exports their own adapter; do not overwrite an existing working adapter or send its contents                            |

Sources: [local setup history](TIDECLOAK-LOCAL.md),
[learning ISSUE 001/005/006/009/010](tide-mcp-learning.txt) and the owner
Change Requests/sign-in reports, Capability Config screenshot, local image ID
and console action sequence above. These are local observations, not a verified
fresh-client procedure. The questionnaire no longer asks for the known local
image ID, DPoP/PKCE values, creation/linking actions or export control. It does not
ask for existing account identities or another owner account run. Do not send screenshots, environment files, credentials, tokens,
enrollment links or private adapter values. Preserve the actual DPoP setting,
redirect boundaries and governance while recording the missing procedure.
**Independent startup stays unverified until another laptop starts successfully.**

### Own backend adapter and generated configuration

In the owner's working Tide console, the observed path is:

**Apps → soc-incident-report-protection-app → Credentials → Tide adapter →
Download tidecloak.json.**

The screenshot confirms the download control exists. It does not verify the
downloaded contents, the teammate's adapter or an independent fresh setup.
No adapter was downloaded or opened by the agent.

Teammates must export **their own realm's application adapter** using that
control for their own client and save it at **data/tidecloak.json**, relative
to the project root. Use the reference client name above when it matches the
teammate's configuration. Before saving, check whether that destination already
exists. **Do not overwrite an existing working adapter.** Keep it intact and
stop to resolve the realm/clone choice before saving a different export.
Do not transfer the owner's adapter, credentials, enrollment links or data.

The existing project guidance identifies the Tide installation provider as
vendorResources/get-installations-provider; this is not a generic Keycloak export.
The destination is ignored by Git. CLIENT_ADAPTER remains the documented private
single-line alternative; do not print or share its value. Backend requires realm,
auth-server-url, resource and nonempty embedded jwk.keys, verifies issuer/signature
and azp locally, and does not fetch a substitute remote JWKS. These requirements
do not establish that any downloaded adapter is valid. If the control/provider
is unavailable, stop for supported instructions. Builds alone do not validate
live adapter use.

After manual setup/configuration:

```powershell
pnpm run env:sync
if ($LASTEXITCODE -ne 0) { throw 'Configuration sync failed; stop.' }
pnpm run typecheck
pnpm run lint
pnpm run test:all
pnpm run build
# Run separately if frontend build prevents the chained backend build.
pnpm --filter backend build
pnpm audit --audit-level=high
```

Record each result independently. The build embeds public browser settings;
repeat sync/restart dev server or rebuild production frontend after changing
the tester's public settings. demo:frontend does not call env:sync automatically.

## 5. Native launch — three application terminals

All terminals start in the same clone root, using the same configured version.

Terminal 1, after the backend build:

```powershell
pnpm run demo:emulator
```

Wait for Firestore readiness at 127.0.0.1:8085. The dedicated demo uses hub 4405,
logging 4505, no emulator UI and project demo-soc-incident-protection. It imports
demo-data/firestore only when export metadata exists; first launch starts empty.
It requests export to that same directory on graceful exit. No reset occurs.

Terminal 2, while the emulator is ready:

```powershell
pnpm run demo:backend
```

Wait for **SOC local backend ready; Tide evidence authority unavailable**. The
listener checks emulator reachability and adapter shape first; backend/lib/server.js
must exist. Wrapper forces demo/project/emulator/port and normally the app CORS
origin. Demo storage uses no service-account credential and rejects cloud fallback.

Terminal 3:

```powershell
pnpm run demo:frontend
```

Wait for Next readiness at port 3000. Next may choose another port if occupied;
that breaks the documented origin/redirect/CORS match. Resolve occupancy safely
before treating that launch as valid.

### Readiness and manual first launch

```powershell
pnpm run tidecloak:status
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5001/api/health).StatusCode
(Invoke-WebRequest -UseBasicParsing http://localhost:3000/auth/signin).StatusCode
# Public readiness and auth denial only; no Authorization header or payload.
node -e "fetch('http://127.0.0.1:5001/api/incidents',{redirect:'manual'}).then(r=>console.log(r.status)).catch(()=>{console.error('API unavailable');process.exitCode=1})"
```

Expected health/sign-in status 200 and unsigned incident status 401. These
checks neither authenticate nor inspect identities. Open
http://localhost:3000/auth/signin manually in profile A; use the tester's own
linked Tide identity. Confirm Dashboard and authenticated application data, then
repeat for B–D. HTTP root readiness or the backend's ready message is not a
successful login. Record first successful independent launch and SHA, then follow
the peer cases. Evidence stays locked after two business approvals.

## 6. Shutdown, export/import and restart

Stop frontend and backend with Ctrl+C in their own terminals. Then press Ctrl+C
once in the emulator terminal and wait for successful export completion. Do not
close the terminal, force-stop Java or remove demo-data while exporting.
Restart the same three commands in the same clone. Existing export metadata
causes import from demo-data/firestore. Verify requests, decisions, reasons,
cancellation/history and audit in the browser after restart.

Stop only the tester's own TideCloak when finished:

```powershell
pnpm run tidecloak:stop
```

This retains ./data. On a later test restart TideCloak explicitly, then start the
three application terminals in order. Export-on-exit is not continuous durability;
a crash may lose changes since the last export. Native Windows Ctrl+C propagation
and fresh-peer interactive restart are still unverified.

### Isolated real Firestore verification

```powershell
pnpm run test:emulator
```

Uses unique ignored .emulator-tests/ data/project; ports 8086/4406/4506 must be
free. It refuses occupied ports and never imports existing demo data. Success
requires seed PASS, graceful export, reload PASS in a separate emulator process,
final PASS and exit 0. It covers six collections, retained requests/decisions/
rejection/cancellation/history/audit, replay, self-review, equal roles and concurrent
duplicates/races using real FirestoreStore and synthetic verified identities.

**Owner-reported seed/reload PASS is recorded as VERIFIED persistence for the
unchanged probe.** It is not an agent rerun, fresh-peer result, live JWT/Fabric
check, Docker restart, crash-durability or production index guarantee. Mocked
MemoryStore units are a different evidence source. Rerun after dependency changes.

## 7. Safe recovery

| Symptom                                                             | Smallest safe next step                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Port 3000/5001/8080/8085/4405/4505 occupied                         | Identify the owner locally; gracefully stop only the tester's known process with permission, or pause. Do not kill arbitrary processes or silently change ports. Alternate native ports need coordinated script/config/client changes and separate approval |
| Missing configuration / disabled login                              | Tester privately completes required names, runs env:sync and restarts/rebuilds frontend. Do not print environment or borrow owner values                                                                                                                    |
| Missing backend output                                              | Run pnpm --filter backend build in clone root, then start emulator before backend                                                                                                                                                                           |
| Backend startup fails                                               | Check emulator readiness, expected port and own adapter presence/shape through normal configuration workflow. Failure remains closed; no cloud fallback or auth bypass                                                                                      |
| Download, metadata/attestation or installed-file permission failure | Stop and record stage/exit result; use approved normal-terminal/network/cache access. Keep lockfile/policies; no forced fix, arbitrary ACL relaxation or manual integrity edits                                                                             |
| Tide root reachable but login returns 502                           | Record sanitized time/timezone, stage/status and destination hostname only. Reachability is not token readiness; do not claim a voucher, DPoP or ORK cause without matching evidence                                                                        |
| Voucher-session error or Chrome failure                             | Historical workaround: genuinely fresh Edge InPrivate session/profile allowed login. This is a workaround, root cause not confirmed; do not change accounts/governance or restart services as an assumed fix                                                |
| Midgard signing has insufficient successful ORK responses           | Record as separate sanitized diagnostic evidence; no causal link to the browser failure unless correlated                                                                                                                                                   |
| Linking/QEA assignment cannot complete                              | Stop at that step; seek supported onboarding/governance guidance for the new realm, without bypassing approvals or copying identities/enrollment links                                                                                                      |
| History missing after restart                                       | Check the graceful export/import success stage and same clone/export directory privately; retain artifacts and report failure; never delete existing data to "repair" it                                                                                    |
| Two approvals produce authorising/authority.failed                  | Expected current boundary: authority unavailable, evidence locked. Do not edit records, fabricate authority, reset the scope or promise an active timer                                                                                                     |

Do not attach raw tidecloak:logs output or HAR files. Reports may include sanitized
timestamps, safe exception messages/nested causes, HTTP statuses and destination
hostnames only; remove identity/session data and all URL queries.

## 8. Optional application Docker path — NOT VERIFIED

Native launch is the peer's first path. docker-compose.soc-demo.yml manages only
frontend/backend/Firestore, uses the tester's own adapter file read-only and
demo-data export, and does not create TideCloak, realm/accounts or governance.
The adapter file must exist even if CLIENT_ADAPTER is configured because the
bind mount refuses to create a missing source. Public URLs are baked at build.

With native app processes gracefully stopped, the tester may separately test:

```powershell
docker compose -f docker-compose.soc-demo.yml config --quiet
docker compose -f docker-compose.soc-demo.yml build
docker compose -f docker-compose.soc-demo.yml up -d
docker compose -f docker-compose.soc-demo.yml ps
docker compose -f docker-compose.soc-demo.yml stop -t 60
docker compose -f docker-compose.soc-demo.yml up -d
```

Do not print resolved Compose configuration, delete volumes, run down -v or
copy another developer's data. Record build/readiness and retained history after
restart separately. The recipe specifies Node 24.21.0, pnpm 11.19.0, Temurin
21.0.12.1_1 and Firebase CLI 14.16.0; source review does not verify these images,
Docker networking, installation or persistence. No Docker setup was run here.

## 9. Dependencies and full-PoC limitations

**Unresolved baseline: 3 Critical, 5 High, 10 Moderate audit findings.**
All eight High/Critical advisories and exact paths were reconciled previously
against locked/installed versions in the handoff. The prepared
SOC-DEPENDENCY-PATCH-PLAN.patch is unapplied. The earlier agent audit failed
to fetch (exit 1); the owner's successful audit still reports the unresolved counts
above. There is no clean audit or reduced count. Findings are potential dependency
risk, not proof of exploitability in this app. The owner must review local test
risk before publishing. Use synthetic data; this is not a production release.

The proposal uses a **zero-context unified patch, UTF-8 without BOM, with LF
endings**. It was regenerated against the current public workspace file using
temporary copies outside the repository; proposed versions are unchanged. This
avoids the old blank context marker's whitespace warning. The original CRLF
patch did not match the LF workspace; both contained valid UTF-8 em dashes.
Validate without applying from the project root; **--unidiff-zero is required**:

```powershell
git apply --check --unidiff-zero -- docs/SOC-DEPENDENCY-PATCH-PLAN.patch
```

The repaired proposal passed this check (exit 0). It remains unapplied: the real
workspace, lockfile and installed dependencies were not changed. This verifies
applicability only, not dependency compatibility in a running application or
vulnerability remediation. Do not apply it during baseline peer setup.

The previous compatible candidates remain Busboy 3.2.2, source-map-js 1.2.2,
proxy-addr 2.0.8 and Sharp 0.35.5 with scoped existing-parent overrides. Braces
has no established official patched version for its supplied advisory. Tinypool
requires a separately approved supported Vitest/coverage major migration.
Do not apply these in this task or during baseline peer setup; do not change
Tide SDKs. The patch is retained for separate owner review, not as an installation
step. Any future approved dependency change requires its own normal lockfile
update, checks, audit and published test SHA. Do not apply an unsupported major
override, new production dependency or assumed Braces fix. No dependency change
happened during this task.

Genuine Tide encryption, ciphertext storage, scoped cryptographic authority,
activation/unlocking and expiry remain incomplete. No protected plaintext or
pretend ciphertext is supplied. The future integration needs supported contract/
intent/endorsement/completion semantics and compatible SDK/enclave/ORK versions,
including Fabric denial using cached ciphertext and authority after expiry.
Application approvals and QEA setup approvals are different from that authority.
No broad selfdecrypt, fabricated policy or server key substitute is acceptable.
The authorised setup-forseti-e2ee, custom-contracts and version-policy lookups
were reported completed, but did not establish that full tested flow. Policy v4
or an SDK upgrade is not a confirmed solution. No additional lookup was made.

TIDE-01/02/03 stay **Blocked**. Application failure to grant access is testable;
it is not full-PoC completion. Expiry cannot erase plaintext already copied.

## 10. Actual verification and completion gate

### Owner post-correction verification — 8 October 2026

The supplied normal-PowerShell transcript verifies both frontend/backend
typechecks and lint, 114 backend tests in 8 files, 98 frontend tests in 11 files,
and both production builds. All 14 incident-detail cases passed, including the
six new recovery/stale-response regressions. The transcript explicitly prints
exit 0 for git diff --check; other numeric exits were not shown.

The fresh owner pnpm audit --audit-level=high completed and returned **3 Critical,
5 High and 10 Moderate findings**, all unresolved. A completed audit with findings
is not a clean audit. No dependency, lockfile or Tide SDK change occurred.

These are owner local results; the component/API/authentication surfaces are
mocked in unit tests. They do not prefill peer-browser results or prove live
Tide/JWT/Fabric authority. The earlier owner real-emulator seed/export/reload
remains VERIFIED for that isolated probe and was not rerun now. Independent
startup, interactive/Docker restart and live verification remain unverified.
Two application approvals still leave evidence locked; genuine encryption,
scoped authority, decryption and expiry remain unfinished. The owner questionnaire
now credits the approved history, current settings, local image ID, account
actions and adapter download control. Exact governance approval/commit actions,
remaining redirect/logout settings and image software-version/registry provenance
are still open. Independent first launch remains unverified. Preserve the
existing four accounts.

No repeat of the application checks is needed solely to close the recovery-test
execution gap. Use the command sequence below again after relevant changes,
recording each exit independently. The earlier failed agent attempts are retained
as history. This follow-up only reconciles documentation; agent document
formatting/content checks and git diff --check passed.

### Historical focused recovery follow-up — earlier 8 October 2026

The incident page now clears obsolete notFound/error on a successful changed-ID
load and keeps failed-load states consistent. Existing effect cancellation and
locked evidence remain intact. Six regression cases were added (14 cases in the
incident suite). No incident-suite assertion executed here: the import of
next/navigation failed before collection. Frontend typecheck passed (exit 0).

The attempted test command included a literal -- separator and selected the
broader frontend suite: 37 existing mocked tests passed, seven suites failed to
load Next imports, exit 1. The corrected single-file normal-terminal access
request did not start because automatic approval review timed out, including its
one permitted retry. This is not a test pass or an unsafe-action finding.
Frontend formatting and final diff checks pass. Known lint/build EPERM failures,
backend tests, emulator checks and audit were not repeated in this focused task.

The following post-correction checks were supplied for normal PowerShell;
the later owner transcript above now verifies the full application checks:

```powershell
Set-Location -LiteralPath 'C:\Users\Xnami\Tide MCP\soc-incident-report-protection'
pnpm --filter frontend run test tests/unit/app/incident-detail.test.tsx
$LASTEXITCODE
pnpm run typecheck
$LASTEXITCODE
pnpm run lint
$LASTEXITCODE
pnpm run test:all
$LASTEXITCODE
pnpm run build
$LASTEXITCODE
# Run separately if the frontend build prevents the backend build.
pnpm --filter backend run build
$LASTEXITCODE
pnpm audit --audit-level=high
$LASTEXITCODE
git diff --check
$LASTEXITCODE
```

The later owner execution above verifies the new cases. The earlier 92-test
report and isolated persistence are separately attributed historical evidence.
The application workflow exists; Tide encryption/scoped authority/expiry remain
unfinished; two approvals keep evidence locked. The supplied 3 Critical/5 High/
10 Moderate findings remain unresolved. Independent startup remains unverified.

### Historical peer-preparation checks — earlier 8 October 2026

Earlier agent run, 8 October 2026:

| Command                         | Exit | Actual result                                                                                     |
| ------------------------------- | ---- | ------------------------------------------------------------------------------------------------- |
| pnpm run typecheck              | 0    | Both packages pass                                                                                |
| pnpm run lint                   | 1    | Child ESLint exit 2; EPERM reading installed brace-expansion@1.1.21/index.js before source checks |
| pnpm run test:all               | 1    | Backend 114 pass; frontend 37 pass in 4 files, 7 suites fail to load next/link or next/navigation |
| pnpm run build                  | 1    | EPERM reading installed Next executable before compilation; backend chain not reached             |
| pnpm --filter backend run build | 0    | Separate backend production compilation passes                                                    |
| pnpm run test:emulator          | 1    | Backend build passes; Firebase CLI EPERM resolving user profile before emulator startup           |
| pnpm audit --audit-level=high   | 1    | EACCES/fetch failed; no advisory totals obtained                                                  |
| git diff --check                | 0    | Final whitespace check passes                                                                     |

The isolated probe's demo-project/data guards were inspected and ports
8086/4406/4506 were available before execution. No unrelated process was stopped
or existing data deleted. This agent run did not execute emulator transactions,
export or reload. The owner's separate successful isolated seed/export/reload
remains VERIFIED owner evidence. Interactive/native/Docker restart and independent
startup remain unverified. No interactive app, login or account setup was attempted.
No Tide MCP, cloud console or credential inspection occurred.

Earlier owner normal-terminal frontend typecheck/lint, all 92 frontend tests and
both production builds are user-reported passes, not this run's results. Backend
units use mocked verification/store fixtures and generated test-key JWTs; frontend
units are mocked. Neither category proves live JWT or Tide/Fabric security.

To rerun in normal PowerShell from the existing clone root, keep each result
separate. Confirm ports 8086/4406/4506 are free before the emulator command:

```powershell
pnpm run typecheck
$LASTEXITCODE
pnpm run lint
$LASTEXITCODE
pnpm run test:all
$LASTEXITCODE
pnpm run build
$LASTEXITCODE
pnpm --filter backend run build
$LASTEXITCODE
pnpm run test:emulator
$LASTEXITCODE
pnpm audit --audit-level=high
$LASTEXITCODE
git diff --check
$LASTEXITCODE
```

Historical R-01 review finding is corrected by the focused follow-up above.
PEER-17/18 still require executed UI recovery checks; owner unit passes and
earlier agent import failures do not prove independent browser behaviour.

Before handoff completion: owner reviews and publishes the approved full SHA,
resolves onboarding/governance/client-security gaps, teammate provisions their own
configuration/identities, confirms first independent launch and records peer
cases plus retention checks. Review redacted feedback. Only an executed successful
independent startup can close this handoff's current NOT VERIFIED status.
