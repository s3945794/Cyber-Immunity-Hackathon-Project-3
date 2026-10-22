# SOC PoC independent laptop runbook

## Week 9 preparation — 20 October 2026

Current source HEAD: 8d55ac385da4041224a24080e069a3d8271477ad; local tracking ref
matches without a remote fetch. New deployment files are uncommitted, absent
from that SHA. Exact-candidate peer retest is not recorded. **Not deployed; no
live URL or verification.** The single [Week 9 proposal](SOC-WEEK9-DEPLOYMENT.md)
contains readiness classes, environment/secret names, protected persistence,
Tide gates, costs, commands and peer/Planner checklists. No cloud account/funding
or access was verified. Older SHA/audit/owner results below retain their dates.
Braces, uuid, F8 and genuine authority/expiry remain unresolved; evidence locked.

Updated 17 October 2026 (qs verification complete; historical evidence retained).
**Draft: independent clean-clone startup is NOT VERIFIED.
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
Branch: feature/soc-emergency-access-poc. Owner-reported hosted test SHA:
**f8a05a2f1e556c7cb54f91f46f39578f9595bf93**. Current local source-review HEAD:
**19399aeb77b81af1a6fd9bf9dee235778ebbb871**. The intervening commit changes
only the three status documents. No new hosted run for 19399ae is asserted.

The application and approved Vitest migration are committed; the older claim
that required implementation is absent from the baseline is superseded. Choose
and record the owner's exact published test SHA, not whichever branch HEAD a
later clone happens to receive. Preserve existing checkouts and private data.
This agent did not fetch, publish or verify remote availability during this pass.

After publication, in a normal PowerShell terminal:

```powershell
git clone --branch feature/soc-emergency-access-poc --single-branch https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git soc-incident-report-protection
Set-Location -LiteralPath 'soc-incident-report-protection'
git branch --show-current
git rev-parse HEAD
git status --short
$socExpectedSha = Read-Host 'Full published test SHA supplied by the owner'
if ($socExpectedSha -notmatch '^[0-9a-fA-F]{40}$') {
  throw 'Supply the full published test SHA before continuing.'
}
$socActualSha = git rev-parse HEAD
if ($LASTEXITCODE -ne 0 -or $socActualSha -ne $socExpectedSha) {
  throw 'Checkout does not match the approved test SHA. Stop; do not reset it.'
}
```

Compare HEAD with the full SHA supplied by the owner. Stop if the branch is
unavailable, HEAD differs, or required demo scripts/docs are missing. Record the
tested SHA before installation. Do not reset an existing checkout or overwrite
someone else's work. A later patched version needs a new test record.

## 2. Tools and compatibility

| Tool/package              | Requirement and evidence                                                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git                       | Git 2.x; repository access through the tester's own approved Git setup                                                                                                     |
| Node                      | Use Node 22.12+ within Node 22, or Node 24+; owner-tested runtime 24.19.0. Node 23 is outside Vitest's supported range                                                     |
| pnpm                      | Owner local pnpm 11.20.0; hosted workflow uses pnpm 10 and frozen installation. Preserve the existing workspace supply-chain policy                                        |
| Java                      | 21 or newer for the emulator; owner runtime inspection found 23.0.2; Docker's Java 21 recipe has not been run here                                                         |
| Docker Desktop            | Linux containers and Compose v2 for TideCloak; CLI 28.3.0 was detected, but daemon access was denied; no compatible Desktop/daemon version was independently tested        |
| Firebase emulator tooling | scripts/demo.cjs/test-emulator.cjs use pnpm dlx firebase-tools@14.16.0; first use needs package/emulator download and cache permission                                     |
| Browser                   | Current Edge or Chrome; four separate profiles; Edge is a reported workaround, not a proven Chrome fix                                                                     |
| Application packages      | Existing pnpm-lock.yaml; Next 16.3.8, React 19.2.4, Vitest/coverage-v8 4.1.11, Vite 7.3.6, Tide nextjs/react/js 0.14.20; no Tide SDK upgrade                               |
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

### F1 launcher compatibility and F3 startup diagnostics — 15 October 2026

The emulator launchers now share `scripts/pnpm-launcher.cjs`. JavaScript pnpm
entries (`.js`, `.cjs`, `.mjs`) run through Node; an absolute native Windows
`pnpm.exe` runs directly. POSIX extensionless native entries are also supported.
Arguments remain separate, with `shell: false`. Batch/PowerShell shims are not
executed as command strings: `npm_execpath` supplied by `pnpm run` must identify
the underlying JavaScript entry or native executable. Do not change package
versions, approval policy or supply-chain protections to make a launch work.

Demo environment overrides, port checks, export/import arguments, child exit
handling and signal handlers are retained. In Windows, inherited console Ctrl+C
must reach the child; the wrappers still avoid forced `child.kill()` there.
Mocked tests cover this contract, but real emulator export/shutdown is not yet
verified for either entry type by this follow-up.

The native backend now emits one fixed startup code and recovery instruction.
Configuration/port validation runs before a connection or adapter read; adapter
validation still precedes app construction/listening. Existing authentication
and database guards are unchanged.

| Code                      | Established failing stage and safe recovery                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SOC_STARTUP_CONFIG`      | Check explicit local demo settings, dedicated project/emulator configuration and backend PORT: integer 1024–65535, excluding Tide's 8080.                               |
| `SOC_STARTUP_EMULATOR`    | Check that the configured local Firestore emulator is ready and reachable. Do not fall back to a cloud database.                                                        |
| `SOC_STARTUP_ADAPTER`     | Check your own adapter's presence and format through the private configuration workflow; never paste its contents into a report.                                        |
| `SOC_STARTUP_APPLICATION` | Application construction failed before binding. Check the local backend build/setup. This code does not identify a realm/client mismatch.                               |
| `SOC_STARTUP_BIND`        | Listener binding/setup failed. Check local port availability and permissions; leave unrelated processes running. It does not assert a specific EADDRINUSE/EACCES cause. |

Failures still set exit code 1. Diagnostics use only static allowlisted text;
they never print raw exceptions, causes, adapter contents, headers or configured
values. A startup code is stage evidence, not a login, JWT or Tide readiness pass.

Offline regression commands from the clone root:

```powershell
pnpm exec node --test scripts/tests/demo-launchers.test.cjs
pnpm --filter backend exec vitest run tests/unit/server.test.ts --configLoader runner
pnpm --filter backend typecheck
pnpm --filter backend lint
pnpm --filter backend build
```

On 15 October these passed: 30 launcher tests with mocked child/socket/file I/O,
21 startup tests with mocked app/adapter/network, backend typecheck, lint and
TypeScript production build. Synthetic secret sentinels in failures are checked
for absence from diagnostic output. Focused code formatting also passed after
formatting the three new/changed files identified by the initial style check.

The agent's broader `pnpm --filter backend test` run returned 82 passes and 53 failures,
all denied loopback HTTP connections (`connect EACCES 127.0.0.1`). One approved
outside-sandbox retry returned the same totals/cause; no further retry was made.
Those results remain blocked agent-environment evidence, not a successful agent
run. Separately, on **15 October 2026**, the owner reports running the same
command in their normal Windows terminal: **all 135 tests passed across nine
files, including all 21 server startup tests**, without the earlier loopback
EACCES failures. This is owner-run evidence supplied in chat, not an agent rerun.
It establishes the reported backend unit-suite pass in that environment, not
native pnpm.exe invocation, live backend startup or emulator persistence.
The exact command used by the owner was:

```powershell
pnpm --filter backend test
Write-Output "backend test exit: $LASTEXITCODE"
```

The version-only Windows process probe below starts no application or emulator.
For an npm-installed JavaScript pnpm shim, resolve its underlying entry:

```powershell
$pnpmJsEntry = Join-Path (Split-Path (Get-Command pnpm).Source) 'node_modules/pnpm/bin/pnpm.cjs'
if (-not (Test-Path -LiteralPath $pnpmJsEntry)) { throw 'Supply the installed absolute JavaScript pnpm entry path.' }
pnpm exec node scripts/check-pnpm-launcher.cjs $pnpmJsEntry
Write-Output "JavaScript launcher probe exit: $LASTEXITCODE"
```

This succeeded here on Windows with JavaScript pnpm 11.20.0, exit 0; no pnpm
version was changed. The first probe omitted the entry and failed because
`pnpm exec` does not provide `npm_execpath` here. The probe now requires the
explicit entry; the actual demo wrappers continue to use `pnpm run`.

For an already installed native executable, supply its absolute path:

```powershell
$nativePnpmEntry = (Get-Command pnpm.exe -CommandType Application -ErrorAction Stop).Source
pnpm exec node scripts/check-pnpm-launcher.cjs $nativePnpmEntry
Write-Output "native launcher probe exit: $LASTEXITCODE"
```

**Not tested: no native executable found on PATH.** The owner subsequently
reports that `Get-Command pnpm -All` lists `pnpm.ps1`, `pnpm.cmd` and `pnpm`
under AppData/Roaming/npm, and `Get-Command pnpm.exe` returns no results.
This is owner-reported evidence, separate from the earlier agent lookup.
Neither the owner's 135-test backend pass nor the mocked tests or successful
JavaScript probe verifies native pnpm.exe invocation. Continue with the existing
JavaScript installation; do not install another pnpm or change PATH. The native
probe instructions below are reference only, not a requirement to obtain an exe.

To identify already available candidates without changing PATH:

```powershell
Get-Command pnpm.exe -All -CommandType Application -ErrorAction SilentlyContinue |
  Select-Object Name, Source
```

Choose the actual executable from a known existing native pnpm installation.
`pnpm.cmd`, `pnpm.ps1` and `pnpm.cjs` are different entry types. If several
executables are listed, choose the intended installation's full path rather
than assuming the first is the one to test. If none is listed but the owner
knows an existing installation outside PATH, use that exact path; do not search
private configuration or install a package. The same probe accepts it directly:

```powershell
$nativePnpmEntry = (Resolve-Path -LiteralPath (Read-Host 'Full path to existing pnpm.exe')).ProviderPath
pnpm exec node scripts/check-pnpm-launcher.cjs $nativePnpmEntry
Write-Output "native launcher probe exit: $LASTEXITCODE"
```

These commands do not change PATH. A successful result must say `win32`,
`native entry` and `exit 0` with the installed version. This verifies only the
native executable's version-command invocation through the shared launcher.
If no existing native executable is available, leave the check unverified.
The probe's output is restricted to a version/result; child errors/stdout/stderr
are not relayed on failure.

After separate service-start approval, use the existing `pnpm run demo:emulator`
and `pnpm run test:emulator` procedures for each actual pnpm entry type. Record
Ctrl+C export completion and seed/export/reload/final exit separately from mocks.
Live backend diagnostic confirmation also requires a separately approved setup;
do not open private configuration or start services under this follow-up's scope.
F1/F3 are implemented with offline evidence, not fully verified live fixes.

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

**The earlier owner-reported seed/reload PASS is historical 8 October evidence
for that candidate only.** The latest owner run on 15 October failed before
reload, as recorded below. Do not carry the earlier persistence pass forward
to the changed runner. Neither result is an agent rerun, live JWT/Fabric check,
Docker restart, crash-durability or production index guarantee. Mocked units
are a separate evidence source.

### Latest owner verification — 15 October 2026

These are owner-run observations, recorded from the owner's report. The agent
did not start services, inspect private configuration or independently inspect
the screenshots during this update.

| Check                                     | Owner result and scope                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Live emulator-unavailable backend startup | `SOC_STARTUP_EMULATOR`, exit **1**, no ready message. This verifies that live diagnostic branch; it does not verify every other startup error branch.                                                                                                                                                                                           |
| Demo application startup                  | Demo emulator, backend and frontend started successfully.                                                                                                                                                                                                                                                                                       |
| HTTP checks                               | Health returned **200**; unsigned incidents returned **401**. These checks alone do not prove authenticated access.                                                                                                                                                                                                                             |
| Owner sign-in and pages                   | Owner login and the checked application pages worked after TideCloak started. This is separate from the unresolved peer fresh-client DPoP login.                                                                                                                                                                                                |
| Recovery of displayed records             | After stopping and restarting application services, owner-reported screenshots confirm the existing **Exposure Evidence** request, **both approvals**, the **cancelled Victim Host** request and matching audit events retained their displayed details. This is verification of the checked UI records, not an exhaustive database comparison. |
| Protected evidence                        | Evidence remained **locked**. No unlock or Tide/Fabric evidence-access verification is claimed.                                                                                                                                                                                                                                                 |

**Interactive shutdown limitation:** export was seen starting, but there was
no completion confirmation, and Ctrl+C was repeated. A backup was saved before
restart. Do not infer that the backup was restored or that graceful export
completed merely because the displayed records recovered. Interactive graceful
shutdown/export completion remains **unverified**; do not mark PEER-21 fully
passed from this run. Keep the backup and existing exports.

The separately completed isolated seed/export/reload test below remains
**PASS, exit 0**, with the actual JDK **23.0.2.0** workaround and both shutdown
gates completed. It does not establish successful keyboard Ctrl+C shutdown in
the interactive run or prove the shim's internal failure mechanism. The two
earlier failed isolated runs remain historical evidence.

Native pnpm.exe remains **Not tested: no native executable found on PATH**.
Peer fresh-client DPoP login remains **unresolved**. Other live startup diagnostic
branches, graceful interactive export completion and Tide/Fabric verification
remain separate pending checks. F1/F3 are not declared fully verified by these
limited successes. Earlier owner backend tests and agent mocks retain their
own attribution.

F10 is now **implemented with automated verification**, as described below.
The approved proposal remains in the triage as historical design context.
Peer fresh-client DPoP login remains unresolved.

### F10 sign-in failure feedback — implementation and verification

The existing sign-in layout now shows one focused, accessible alert beside
the existing button when sign-in fails:

> We couldn’t complete sign-in. Please try again. If it still fails, contact your project administrator.

`frontend/src/components/auth/SignInPanel.tsx` contains the existing sign-in
layout and guards both buttons with one handler. Synchronous throws and rejected
login promises show only this fixed wording. The paragraph has `role="alert"`,
a visible focus outline, light/dark error text and an ID used by each button's
`aria-describedby`. It receives focus once when mounted; ordinary re-renders
do not steal focus. Keyboard Tab reaches the existing primary sign-in button.
The existing unconfigured warning is retained when no failure notice is shown;
unconfigured controls remain disabled and duplicate alerts are avoided.

`AuthRedirect.tsx` still delegates callback processing and validation to
`useAuthCallback`. SDK callback failure and its separate missing-verifier
redirect use only `/auth/signin?signin=failed`. Sign-in recognises exactly one
`signin=failed` value; unknown or duplicate values are ignored, never echoed.
The callback fallback also uses the generic alert while navigation is delayed,
replacing raw SDK error text. The application does not inspect or log rejected
payloads, copy callback values into failure destinations or introduce auth-data
storage. Successful SDK return navigation and the authenticated dashboard
redirect are preserved. The page wraps the search-parameter component in
Suspense, following the installed Next.js guidance.

Retry requires an explicit button action. A new attempt clears the notice and
disables both buttons. A rejected attempt restores the notice and enables
retry. A resolved `login()` promise is treated as navigation requested, not
authenticated success: buttons remain guarded until navigation or SDK state
changes. No automatic login or retry is added. No SDK token exchange, state,
nonce, PKCE, DPoP, account or realm behaviour is replaced.

**Fresh automated checks:**

- `pnpm --filter frontend test`: **120 passed across 13 files**, exit 0.
  The two new component test files contain **22 tests**; with the three
  existing sign-in route tests, the focused run passed **25 tests**.
- `pnpm --filter frontend typecheck`: passed, exit 0, after correcting an
  unsupported query option in one new test. `pnpm --filter frontend lint`:
  passed, exit 0.
- Targeted Prettier formatting/check and `git diff --check`: passed. An initial
  root-cwd formatter invocation could not resolve the existing Tailwind plugin;
  the frontend-cwd invocation worked without installation. A broad initial
  pattern also normalised line endings in two unrelated auth components;
  those changes were restored and later formatting used explicit file paths.
- Tests use mocked SDK/navigation and synthetic failures only. They cover
  callback failure, missing-verifier destination, delayed-navigation fallback,
  explicit retry, both buttons, duplicate submission, focus/keyboard behaviour,
  unchanged loading/authenticated/success paths and non-disclosure of synthetic
  secrets to application DOM, navigation, logging or storage. They do not
  certify third-party SDK internals or a real DPoP login.

**Pending manual/browser verification:** failure arrival and missing-verifier
recovery in an owner-controlled browser, actual keyboard/screen-reader
announcement and focus in light/dark modes, explicit retry and successful
sign-in. Do not copy callback URLs, tokens, error payloads or private data into
reports. Peer fresh-client DPoP login remains **unresolved**. The owner live
results above predate F10 and are not verification of this new UI.

The production build was not run: the standard Next.js build loads private
environment files, which this task forbids accessing. An owner may separately
run `pnpm --filter frontend build` in their normal terminal; this does not
require starting an application service. No production/build or manual-browser
pass is claimed. All seven earlier dependency/documentation changes are
preserved; no dependency, SDK or configuration change is part of F10.

### F10 owner browser results and silent-SSO investigation — 15 October 2026

Record these owner observations separately from the earlier 120-test automated
pass. No browser or service was operated by the agent for this investigation.

| Owner check                                   | Result and limit                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fixed-marker alert preview and keyboard retry | **Passed**, owner-reported. This verifies the presentation and keyboard path, not a real SDK callback failure.                                                                                                                                                                                                       |
| Token-endpoint blocking                       | Sign-in returned to the application's sign-in page. Further explicit Continue clicks repeatedly returned/reloaded that page. The fixed alert was **not confirmed**. Real callback-failure feedback is **not passed / inconclusive**. These were user-triggered repetitions, not evidence of an automatic retry loop. |
| DevTools indication                           | “Request was blocked by DevTools”, “1 affected”; console source referenced `silent-check-sso.html`. This does not identify which application handler ran or prove a top-level callback failure.                                                                                                                      |
| Normal login after removing the rule          | **Passed**, owner-reported, in a new private window; normal login and dashboard functions worked. This does not establish recovery in the same failed tab or resolve the peer fresh-client DPoP blocker.                                                                                                             |

The earlier broad token-blocking recipe was not a reliable isolated test of
the application callback handler: the same token endpoint is used by silent
SSO. Treat that recipe's result as inconclusive unless the failing branch is
identified. Do not repeat it as a purported deterministic callback pass.

**Installed source findings (`@tidecloak/react` and `@tidecloak/js` 0.14.20):**

- The application `silent-check-sso.html` only posts its location to its
  same-origin parent. It does not run `AuthRedirect` or render the F10 notice.
- The SDK's `buildInitOptions` uses `check-sso`. In
  `dist/esm/lib/tidecloak.js`, `_TideCloak_checkSsoSilently` catches failures
  from processing the iframe callback and resolves without authenticating;
  iframe error/load/timeout paths also settle without authentication. A
  failed silent probe need not call the app's `useAuthCallback.onError`.
  Ordinary unauthenticated silent SSO is not itself an application error.
- For a real top-level callback, `useAuthCallback` calls its configured
  `onError` on supported failures or uses the fixed missing-verifier redirect.
  `AuthRedirect` maps these to the safe marker. Its direct-visit effect still
  reparses the current query and redirects to plain sign-in if code/error
  fields are absent. The SDK's `_TideCloak_processInit` can clean callback
  parameters with `history.replaceState`. A competing plain redirect is a
  source-supported possibility, not an established explanation of this run.
- IAMService `_initFrontchannel` catches initialization errors, emits
  `initError` and then reports ready/unauthenticated. The SDK React provider
  stores `initError`, but the application's `AuthBridge` does not expose it.
  `SignInPanel` sees only its fixed marker and locally rejected login calls.
  This is a source-supported feedback coverage gap for provider/init errors;
  a silent failure swallowed by the SDK may expose no error at all.
- Front-channel `IAMService.doLogin` invokes the underlying client's `login`
  without returning its promise. The React wrapper awaits `doLogin`, so a
  later asynchronous failure/navigation outcome is not guaranteed to reject
  the promise awaited by `SignInPanel`. Catching mocked promise rejection
  alone cannot establish coverage of all real SDK failures.

**Conclusion:** the blocked run neither proves nor disproves the top-level
callback handler. It exposes a limitation of the broad test, alongside real
source-level feedback boundaries. No runtime root cause or SDK validation
failure is assigned. Existing automated tests remain valid for their mocked
contracts, not for end-to-end SDK event propagation.

**Historical manual proposal, now superseded by the automated investigation below:** during one owner-controlled
attempt, use non-pausing DevTools Sources logpoints containing only fixed
literal labels at these branches:

1. Application `AuthRedirect` `onError`: `F10_CALLBACK_ERROR`.
2. Its no-code/no-error direct-visit redirect: `F10_PLAIN_CALLBACK_REDIRECT`.
3. SDK `_TideCloak_checkSsoSilently` message-callback catch (and, if needed,
   its `settleNotAuthenticated` helper): `F10_SILENT_SSO_FAILURE`.

Record only which labels fired, the final pathname, whether the exact public
failure marker was present and whether the notice appeared. Do not print
variables, inspect/copy callback payloads, scope values, headers, storage or
raw exceptions; do not export console/network logs. Non-pausing logpoints
avoid introducing breakpoint-induced SSO timeouts. Remove logpoints and the
blocking rule afterwards. This neither patches application/SDK files nor
disables any validation. It may still exercise silent SSO rather than the
top-level callback; report that outcome honestly.

**Smallest correction depends on that trace; none implemented:** if a plain
redirect races a recognized callback, gate direct-visit recovery on the SDK's
callback/processing/error/success state rather than a later mutable query
snapshot. Test SDK URL cleanup and competing redirects. For observable provider
initialization errors, a separate minimal extension can expose only a boolean
failure flag through the auth bridge and reuse the generic alert; never expose
the SDK error object. That boolean would not recover errors intentionally
swallowed by silent SSO. Do not label every unauthenticated session a failure,
change SDK-managed login to force rejection, disable silent SSO/DPoP/PKCE or
add time-based automatic retries to make this check pass.

Current manual status: preview/keyboard and normal successful login **passed**;
real SDK failure-to-alert/retry and missing-verifier browser checks **pending**.
Screen-reader announcement and contrast remain unverified unless separately
reported. No source, SDK, dependency, private configuration, account or realm
change was made. Historical shutdown/export and owner verification evidence
elsewhere in this runbook remains unchanged.

### Focused automated F10 investigation — historical approval proposal

The owner subsequently approved this four-file proposal. It is now implemented;
see **Approved F10 correction — implementation and verification** below. The
investigation findings and earlier results are retained here as history.

No application/authentication code or installed SDK was changed for this
investigation. A new characterization file,
`frontend/tests/unit/investigations/auth-feedback-boundaries.test.tsx`, tests
the current behaviour. Green characterization assertions confirm the presence
of a gap; they are not evidence that a correction has been implemented.

Results distinguish three paths:

| Path                               | Automated finding                                                                                                                                                                                                                                                                                                                                               | Conclusion                                                                                                                                                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider initialization failure    | The exact installed IAMService `_initFrontchannel` method, with initialization/network collaborators mocked, emits `initError` then `ready(false)` after rejection and does not persist a token. A separate test of the real application bridge/panel supplied that SDK state: authentication stays false, but no safe failure state or notice reaches sign-in. | **Confirmed application feedback gap** for observable initialization errors; fail-closed authentication is retained.                                                                                                    |
| Callback query cleanup             | With SDK callback state still processing, failed or successful, a controlled cleanup before the application's effect causes plain `/auth/signin` navigation. A controlled ordering also produces fixed failure navigation followed by plain recovery.                                                                                                           | **Confirmed fallback guard defect under reproduced conditions.** The SDK's actual source removes callback parameters, but the tests model cleanup/order; they do not establish the ordering in the owner's browser run. |
| Silent-SSO exchange/iframe failure | The exact installed `_TideCloak_checkSsoSilently` method resolves unauthenticated after a mocked exchange rejection or iframe error. Its original message-origin/source checks remain active in the harness.                                                                                                                                                    | **Confirmed SDK contract / test limitation.** Ordinary ready-but-unauthenticated sign-in produces no error alert. Do not turn every unsigned session into a failure.                                                    |

The installed SDK methods are parsed from their public installed source and
executed unchanged in an isolated VM; private collaborators, DOM and network
are doubles. No SDK file is patched, real callback is constructed, request is
sent or state/nonce/PKCE validation is replaced in the application. This is not
whole-SDK or browser authentication verification. Captured synthetic SDK logs
stay inside mocks; no raw real error or credential was collected.

Actual checks:

- Initial focused run: **7 passed, 3 failed**. The three failures were a test
  harness parser omission (SDK silent methods are function expressions).
- After correcting only that harness, reran only the three affected silent
  cases: **3 passed, 7 skipped**, exit 0. Across these runs all **10 new cases**
  have passed; there was no new single full-suite run or correction pass.
- Frontend typecheck passed after the new test and after its parser correction.
  Targeted test/document formatting and `git diff --check` passed. Earlier
  120-test/lint results remain historical; unaffected suites were not repeated.

**Concrete correction for approval, four production files only:**

1. `frontend/src/types/auth.ts`: add an optional presentation-only boolean
   `initializationFailed?: boolean` (absent means false for existing consumers).
2. `frontend/src/providers/AuthProvider.tsx`: derive
   `const initializationFailed = Boolean(tc.initError)`, publish only that
   boolean through the existing memoized auth value and include the boolean
   in its dependencies. Do not copy, inspect, log or store the SDK error object.
3. `frontend/src/components/auth/SignInPanel.tsx`: default that flag to false
   and include `(!submitting && initializationFailed)` in the existing generic
   alert condition. Keep one alert, existing focus, explicit retry and guarded
   buttons. Existing submission behaviour and successful navigation stay intact.
4. `frontend/src/components/auth/AuthRedirect.tsx`: use the SDK's callback,
   processing, success and error-presence state for the direct-visit fallback;
   stop inferring a direct visit from a later mutable query string. Keep the
   fixed failure/missing-verifier destination and successful return navigation.

Exact proposed callback guard (not applied):

```tsx
const failed = Boolean(error)
useEffect(() => {
  if (!isCallback && !isProcessing && !isSuccess && !failed) {
    window.location.assign('/auth/signin')
  }
}, [isCallback, isProcessing, isSuccess, failed])
```

After approval, turn the gap characterizations into regression expectations:
observable init failure shows only the approved generic message, ordinary
unauthenticated state stays quiet, recognized callbacks cannot be diverted by
query cleanup, direct visits still recover, and only explicit retry initiates
login. Cover boolean changes after readiness without retaining raw SDK errors.
No SDK/configuration/DPoP/PKCE/state/nonce or evidence access change is proposed.
Silent failures which the SDK exposes only as unauthenticated remain
indistinguishable from a normal unsigned session; this patch will not diagnose
them or fix the separately observed unreturned SDK login promise.

These tests do **not** identify the cause of the owner's inconclusive browser
run. Keep evidence separate: preview/keyboard **passed**; blocked-token
failure-to-alert **inconclusive**; normal login after removing blocking
**passed**; peer fresh-client DPoP **unresolved**. Do not request DevTools
logpoint tracing or repeat broad token blocking. The earlier manual trace
proposal is superseded.

**One short browser checklist, only after an approved correction:** in a fresh
private window, perform one normal owner sign-in, confirm the dashboard works
and evidence remains locked. Private credential entry stays with the owner.
Failure-state/URL-cleanup regression is automated; do not repeat the already
passed preview/keyboard exercise unless the correction affects it.

### Owner verification after the latest correction — 16 October 2026

**Owner-run browser evidence: passed**, after the approved four-file correction:

- Fresh **Edge InPrivate** login with blocking rules removed.
- Dashboard loaded **without the failure alert**.
- Incident pages worked.
- Protected evidence stayed **locked**.

This completes the short normal-login/dashboard/locked-evidence browser
checklist below. It does not verify a newly induced callback failure, identify
the cause of the earlier blocked-token result or prove peer fresh-client DPoP
compatibility. The earlier alert preview/keyboard pass remains separate.
The blocked-token failure-to-alert test stays **inconclusive** and peer
fresh-client DPoP login stays **unresolved**.

**Latest owner emulator shutdown evidence:** the owner observed **“Export
complete” followed by shutdown**. Export completion is now confirmed for that
reported session. This does not retroactively confirm the earlier interactive
run that showed only export starting with repeated Ctrl+C, nor establish every
descendant's exit, free ports or a new reload/exit-code result. Preserve all
earlier failed-run exports and the backup. The separately completed isolated
JDK-workaround seed/export/reload **PASS, exit 0**, remains its own evidence.

**Automated coverage remains separately attributed:** the preceding correction
run passed **49 affected tests across four files**, with four unchanged SDK
characterization cases skipped, plus frontend typecheck/lint and targeted
formatting/diff checks. None of those tests or application checks was rerun for
this documentation-only update. The agent did not operate a browser/service or
inspect screenshots/private configuration to independently repeat owner checks.

**Next highest-priority unresolved item: F8, peer fresh-client DPoP login
(P1 / blocked / Tide integration).** Smallest next action: prepare a read-only,
version-specific compatibility comparison for the pinned SDK **0.14.20** and
the peer's TideCloak image identity, using public guidance, installed source
and existing nonsecret peer records. First identify any missing SDK/image
version in those records; request only that missing version/identity if needed.
Do not start with another login reproduction, logpoints or broad token blocking.
No private adapter/configuration values, headers, authentication payloads,
credentials or security-setting changes are needed for this comparison. Do not
claim a general Tide outage or disable DPoP/change PKCE as a workaround.

### Approved F10 correction — implementation and verification

Implemented exactly within the approved four production files:

- `frontend/src/types/auth.ts`: optional presentation-only
  `initializationFailed?: boolean`; absent means false for existing consumers.
- `frontend/src/providers/AuthProvider.tsx`: derive `Boolean(tc.initError)`,
  publish only that boolean and include it in memo dependencies. Raw error
  properties are not read, copied into the application context, logged or stored.
- `frontend/src/components/auth/SignInPanel.tsx`: reuse the approved generic
  alert for `!submitting && initializationFailed`, retaining the fixed marker
  and local initiation-failure paths. Keep one notice, focus, explicit retry,
  disabled pending controls and the existing authenticated dashboard redirect.
- `frontend/src/components/auth/AuthRedirect.tsx`: direct-visit fallback now
  requires SDK `!isCallback && !isProcessing && !isSuccess && !Boolean(error)`.
  It no longer inspects the live query string to infer a direct visit. SDK
  success, fixed error destination and missing-verifier destination are unchanged.

No SDK authentication validation, PKCE/state/nonce, DPoP, successful login,
backend authorization or locked-evidence behaviour was changed. Ordinary SDK
ready/unauthenticated state with no reported initialization error stays quiet.
Failures swallowed by silent SSO remain indistinguishable from an ordinary
unsigned session; no artificial failure, automatic retry or SDK promise patch
has been added. The cause of the owner's inconclusive blocked-token browser
run remains unknown.

The application cases in `auth-feedback-boundaries.test.tsx` are now regression
tests for corrected behaviour; the four SDK characterization cases are retained
unchanged. `AuthRedirect.test.tsx` now models a plain direct visit as SDK
`isCallback=false` / `isProcessing=false`, rather than incorrectly reporting an
active callback. No other existing tests were edited.

**Fresh checks for the approved correction:**

- Affected test run across auth bridge, sign-in panel, callback and converted
  regressions: **49 passed / four files**, exit 0. **Four unchanged installed
  SDK characterization cases were deliberately skipped** by test-name filter;
  their earlier results were not rerun or promoted to new results.
- New/converted assertions cover failure after readiness and recovery, boolean
  memo updates, one generic notice, no raw-error/property access/logging/storage,
  explicit keyboard retry, pending controls, authenticated success despite a
  stale initialization error, callback URL cleanup, competing navigation and
  direct-visit recovery. Existing affected success and non-disclosure tests pass.
- `pnpm --filter frontend typecheck`: exit 0.
- `pnpm --filter frontend lint`: exit 0.
- Explicit-file Prettier checks and `git diff --check`: passed.

No unrelated frontend/backend/launcher suite, SDK scenario, live login or
service was rerun. The prior 120-test full-suite result stays historical. The
production build remains owner-run/pending because the normal Next build loads
private environment files. The subsequent 16 October owner browser pass is
recorded separately above; no production-build pass is claimed.

**Short final owner browser checklist, using the already-running application:**

1. Open the normal sign-in page in a fresh private window, without a failure
   marker, network-blocking rule or DevTools logpoints.
2. Sign in normally; private credential entry stays with the owner.
3. Confirm the dashboard works and protected evidence remains locked.

Do not repeat broad token blocking or the previously passed preview/keyboard
exercise. Report only pass/fail and safe visible page/notice details. Existing
owner evidence remains separate: preview/keyboard **passed**; blocked-token
failure-to-alert **inconclusive**; normal login after removing blocking
**passed**; peer fresh-client DPoP **unresolved**. Post-correction browser
verification was subsequently supplied on 16 October for the normal-login,
dashboard/incident-page and locked-evidence checks above. Live callback-failure
feedback remains unverified by the inconclusive blocked-token exercise.

All earlier dependency/documentation work and exports are preserved. No
dependency/SDK/configuration/account changes, private-file inspection, Tide MCP,
service operations, commits or pushes occurred.

### Owner-verified JDK workaround — 15 October 2026

**Latest owner-run result: PASS with the existing actual JDK `java.exe`,
version 23.0.2.0, first on a temporary terminal-only PATH.** Seed passed,
export completed, reload passed, both shutdown gates completed, the final
runner PASS appeared and the exit code was **0**. The owner restored the
original PATH in `finally`. This was actual owner-run isolated emulator
verification, separate from agent mocks and the 8 October historical result.

This is a **verified workaround**, not proof of the Oracle shim's internal
failure mechanism or the identity of the failed run's parent process. It
supersedes the pending/failed overall restart status in the historical entries
below only for this JDK workaround. The two earlier failed runs remain valid
historical evidence, and their exports must be retained. The default shim path
has not been shown to shut down successfully.

For a future owner run, select an **existing JDK's actual `bin\java.exe`**.
Use its installation directory in File Explorer; avoid an Oracle `javapath`
shim. No installation or permanent PATH change is required. From the repository
root in normal PowerShell, the following prompts for the executable, checks
the selection, prepends only its directory for this terminal and child
processes, then restores PATH even if the command fails. It does not print PATH
or read private configuration. The existing runner refuses occupied test ports,
creates fresh isolated test data and retains exports; do not delete prior data
or stop unidentified owners to make the check pass. Docker is not required.

```powershell
$socJavaInput = Read-Host 'Full path to an existing JDK bin\java.exe (not a javapath shim)'
if (-not [System.IO.Path]::IsPathRooted($socJavaInput)) {
  throw 'Select an absolute path to the existing JDK java.exe.'
}
$socJava = Get-Item -LiteralPath $socJavaInput -ErrorAction Stop
if ($socJava.PSIsContainer -or $socJava.Name -ine 'java.exe') {
  throw 'Select the existing JDK java.exe file.'
}
$socJdkBin = $socJava.Directory.FullName
if (-not (Test-Path -LiteralPath (Join-Path $socJdkBin 'javac.exe') -PathType Leaf)) {
  throw 'Select java.exe from an existing JDK bin directory containing javac.exe.'
}
if ($socJava.VersionInfo.OriginalFilename -ieq 'shimconsole.exe') {
  throw 'Select the actual JDK java.exe rather than the Oracle launcher shim.'
}
$socOriginalPath = $env:Path
try {
  $env:Path = $socJdkBin + ';' + $socOriginalPath
  $socResolvedJava = (Get-Command java.exe -CommandType Application -ErrorAction Stop).Source
  if ($socResolvedJava -ine $socJava.FullName) {
    throw 'Java lookup did not resolve to the selected JDK executable.'
  }
  & $socJava.FullName -version
  if ($LASTEXITCODE -ne 0) { throw 'Selected Java version check failed.' }
  pnpm run test:emulator
  $socEmulatorExit = $LASTEXITCODE
  Write-Output "isolated probe exit: $socEmulatorExit"
} finally {
  $env:Path = $socOriginalPath
}
```

The successful owner evidence covers **JDK 23.0.2.0**. This portable command
lets another owner select their own existing JDK; it does not claim that all
JDK versions are verified. Confirm seed, export, reload, both shutdown gates,
final runner PASS and exit 0 separately. The agent did not execute this example
or start any service while documenting it.

At the time of this isolated run, separate pending checks were interactive
keyboard **Ctrl+C**, live backend startup diagnostics, peer login and
Tide/Fabric verification. See the latest owner verification above for the
subsequent limited live results and remaining checks. Native
pnpm.exe remains **Not tested: no native executable found on PATH**. The
successful JavaScript pnpm probe, owner-run **135 backend tests across nine
files including 21 startup tests**, and agent-run **39 mocked launcher tests**
retain their own attribution; none substitutes for these pending checks.

### Second owner shutdown failure — 15 October 2026 (historical)

This result supersedes any implication that the bounded gate fixed shutdown.
The owner reran the corrected runner: seed and export passed, but the gate
timed out after 30 seconds. Reload never started. Port 8086 remained held by
Java PID **31000**, started at **13:50:12 on 15 October**, parent PID **27072**.
The owner's command-line classification returned `FirestoreEmulator = True`.
The owner then manually ran `Stop-Process -Id 31000`. This is owner action on
an identified process, not runner cleanup or evidence of successful reload.
Retain both failed runs' exports. The gate detected the problem; it did not
resolve the remaining emulator process. This run's restart verification was
**failed**; see the later verified JDK workaround above.

Read-only inspection of both locally cached `firebase-tools@14.16.0` copies
found identical shutdown code (not execution of the CLI):

- `lib/emulator/commandUtils.js:289–309`: `emulators:exec` awaits the script,
  then export through `controller.onExit`, and calls `cleanShutdown` in `finally`.
- `lib/emulator/downloadableEmulators.js:115–134,254–272`: Firestore uses
  `spawn('java', args)` with `detached: true` and piped output. Firestore's
  command has `shell: false`; the shell used for the fixed probe command is a
  separate process, not the Firestore launcher.
- `downloadableEmulators.js:343–363`: shutdown tests the tracked child with
  `kill(0)`, attaches an `exit` listener and calls that child's `kill('SIGINT')`.
  This path does not enumerate descendants or stop a process tree.
- `lib/emulator/registry.js:25–37`: the “Stopping” message precedes the stop
  attempt, and stop errors are logged and caught. CLI success and shutdown
  wording therefore do not independently prove listener release.
- The repository launcher invokes pnpm directly with `shell: false`. Its
  non-Windows signal forwarding is not used in normal Windows seed completion;
  Firebase CLI performs that shutdown internally. No evidence implicates the
  untested native pnpm.exe path.

The inspected `downloadableEmulators.js` SHA-256 was
`2fea3ea52235b3f3e9cd75e3c14c2e8a948a30cd98958ed2bd2d894823d45a6f`
in each cache copy. The exact cache selected by the failed owner process was
not captured. Current `Get-Command java -All` resolves to
`C:\Program Files\Common Files\Oracle\Java\javapath\java.exe`; its file metadata
identifies **Shim Console Launcher**, original filename **shimconsole.exe**,
version **23.0.2.0**. These are current tool-file observations, not historical
process identity. Node documents that Windows `subprocess.kill('SIGINT')`
forcefully terminates the targeted process; it is not console Ctrl+C:
[Node child-process documentation](https://nodejs.org/api/child_process.html#subprocesskillsignal).

**Working hypothesis, not established cause:** the CLI tracked an Oracle shim,
stopped that shim, and left its actual Java emulator child alive. The observed
parent/child IDs and shim lookup are compatible with this. They do not identify
PID 27072's executable. A genuine JVM or another launcher as parent would
require a different explanation. No automatic kill, timeout increase, Java/PATH
change, dependency patch or speculative lifecycle fix was made.

**Smallest additional diagnostic:** identify parent PID 27072 by executable,
start time and binary original filename. Agent CIM access failed both inside
the sandbox and in one approved retry; it was not retried again. Run this
read-only command in normal PowerShell; no service or Java process is started:

```powershell
$socParent = Get-CimInstance Win32_Process -Filter 'ProcessId = 27072' -Property ProcessId,ParentProcessId,Name,CreationDate,ExecutablePath -ErrorAction Stop
if ($socParent -and $socParent.CreationDate -le [datetime]'2026-10-15T13:50:12') {
  $socParent | Select-Object ProcessId,ParentProcessId,Name,CreationDate,ExecutablePath
  if ($socParent.ExecutablePath) {
    (Get-Item -LiteralPath $socParent.ExecutablePath).VersionInfo |
      Select-Object InternalName,OriginalFilename,FileVersion
  }
} else {
  Write-Output 'Historical parent unavailable or PID reused; current PID cannot identify that parent.'
}
```

If that historical parent is gone, this information cannot be reconstructed
from its PID alone. The next explicitly authorised owner run needs the same
small snapshot **while seed is running**, before the CLI stops the parent.
In a second normal PowerShell terminal, use the live 8086 listener to find its
current owner, then the owner and its parent; do not reuse historical PIDs:

```powershell
$socOwners = @(Get-NetTCPConnection -State Listen -LocalPort 8086 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique)
foreach ($socOwnerId in $socOwners) {
  $socChild = Get-CimInstance Win32_Process -Filter "ProcessId = $socOwnerId" -Property ProcessId,ParentProcessId,Name,CreationDate,ExecutablePath -ErrorAction Stop
  if (-not $socChild) { continue }
  $socParentId = [uint32]$socChild.ParentProcessId
  $socParent = Get-CimInstance Win32_Process -Filter "ProcessId = $socParentId" -Property ProcessId,ParentProcessId,Name,CreationDate,ExecutablePath -ErrorAction Stop
  foreach ($socEntry in @($socChild, $socParent)) {
    if (-not $socEntry) { continue }
    $socEntry | Select-Object ProcessId,ParentProcessId,Name,CreationDate,ExecutablePath
    if ($socEntry.ExecutablePath) {
      (Get-Item -LiteralPath $socEntry.ExecutablePath).VersionInfo |
        Select-Object InternalName,OriginalFilename,FileVersion
    }
  }
}
```

Share only those selected metadata fields, and whether the parent predates its
child. No command lines, environment, debug logs or private configuration are
needed. An empty result means no observation, not a pass. A parent created
after the child means PID reuse, not ancestry evidence. Do not start another
run just to repeat the known timeout without capturing this missing evidence.

No runtime correction or new regression test was added at this investigation
stage because the missing process identity prevents establishing the cause.
Fresh agent verification: `pnpm exec node --test scripts/tests/demo-launchers.test.cjs`
passed all **39** existing mocked tests again. No emulator or real Java process
was started by that test run.
The existing mocked gate tests do not exercise an Oracle shim or actual
Windows Java shutdown. Earlier owner-run 135 backend tests, the successful
JavaScript pnpm probe and native pnpm.exe **Not tested: no native executable
found on PATH** remain separate evidence.

### First isolated shutdown gate correction — 15 October 2026

The owner reports: seed assertions passed, export completed successfully and
the CLI reported emulator shutdown. Before reload could execute, the runner's
port check found 8086 still occupied. PID 1664 was Java, with parent PID 31164;
the owner's read-only command-line classification identified Firestore
emulator use. Reload was **Not run** and the full command exited **1**. These
PIDs describe that historical observation, not current targets for termination.

Source inspection establishes a missing shutdown gate: the runner previously
resolved its phase on the direct pnpm child's `exit` event and immediately made
a single reload-port check. A direct CLI exit or shutdown message does not
establish release of Java descendant listeners. This explains why the runner
could reject a delayed shutdown; it does **not** establish why this Java process
remained alive or whether it would eventually exit. Slow teardown and an
orphaned descendant remain different possibilities. The parent PID's role was
not established. No process-tree change is blamed without evidence.

The recent JavaScript launcher path still uses Node with the CLI entry as its
first argument, inherited stdio and the existing signal policy. Explicit
`shell: false` matches Node's prior default. No evidence ties the lingering
listener to the native-executable path; native pnpm.exe remains Not tested.

The correction in `scripts/test-emulator.cjs`:

- After each successful CLI `exit`, wait up to **30 seconds**, measured with a
  monotonic clock, for the child's `close` event and verified availability of
  **all three** test ports: 8086/4406/4506. Retry at 250 ms intervals; each bind/
  release probe is itself bounded to at most 1 second and the remaining budget.
- Before reload, require export metadata at the fresh current run's
  `export/firebase-export-metadata.json`. A missing file produces
  `SOC_EMULATOR_EXPORT_MISSING`, exit 1 and no reload. File existence alone does
  not prove valid contents; the unchanged reload probe still compares records.
- Keep the initial fail-fast occupied-port checks, unique project/directory,
  pinned tooling, export/import arguments, seed/reload assertions, nonzero child
  failure handling and graceful signal policy. Recheck ports immediately before
  each phase; do not attach to a replacement port owner.
- If closure or port availability is not confirmed in time, report
  `SOC_EMULATOR_SHUTDOWN_TIMEOUT`, exit 1 and retain all data. Before reload this
  prevents reload entirely; after reload it prevents the runner's final PASS.
  It does not kill, classify or adopt a port owner. Closed CLI plus available
  listeners are the checked conditions, not proof that every OS descendant died.

Fresh agent verification: **39 mocked launcher/runner tests passed**, including
delayed release of each required port, delayed/missing CLI close, persistent
occupancy, a stalled port probe, missing export metadata and post-reload timeout.
Timers/sockets/children/filesystem operations are mocked; no services or real
export/reload were run. Focused Prettier and Node syntax checks passed. Backend
TypeScript/source is unchanged, so its earlier owner 135-test pass remains
separate rather than being presented as a new check of this correction.

Owner rerun, from the repository root, once the required ports are free:

```powershell
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in 8086,4406,4506 } |
  Select-Object LocalAddress, LocalPort, OwningProcess
pnpm run test:emulator
Write-Output "isolated probe exit: $LASTEXITCODE"
```

If a listener remains, stop before rerunning and identify its current owner
locally. Do not reuse historical PID 1664 as authority to stop a process, kill
all Java/Node processes or delete the failed run's export. The runner will not
clean up an orphan automatically. A new command creates a fresh isolated run;
it does not resume or overwrite the retained failed-run export. Docker is not
needed. Record seed/export, shutdown wait, reload, final shutdown and final exit
separately. Require real reload PASS, runner final PASS and exit 0 before
claiming successful current persistence. **Corrected live reload is unverified.**

### Owner execution plan — Windows startup and persistence

This plan has not been executed by the agent. Run only the owner's own local
services in normal PowerShell, from the repository root, with the existing
JavaScript pnpm installation. No installation, PATH edit, private configuration
inspection, account/realm/authentication change or data deletion is part of it.

| Check                                                                                   | Docker needed?         | Data and evidence boundary                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend build, 21 mocked startup tests, version-only JavaScript probe                   | No                     | Build/test/probe evidence only. Existing successes remain separately attributed.                                                                                                                             |
| `pnpm run test:emulator`                                                                | No                     | Native Java/Firestore tooling, fresh unique `demo-soc-tests-*` project under `.emulator-tests`, ports 8086/4406/4506. Real persistence/transactions with synthetic verified identities; no live JWT or Tide. |
| Native `demo:emulator`, `demo:backend`, `demo:frontend`, health and unsigned API checks | No for these processes | Dedicated `demo-soc-incident-protection` project, ports 8085/4405/4505, 5001 and 3000. Backend still requires an already valid local adapter. Sign-in and live identity checks are separate.                 |
| Existing local TideCloak container and signed-in browser checks                         | Yes                    | Only the already configured project-owned TideCloak. No new accounts, realm setup, private adapter inspection or security setting changes.                                                                   |
| Optional all-application Docker Compose path in section 8                               | Yes                    | Excluded from this native verification plan; do not mix the two runtime paths.                                                                                                                               |

1. **Record the baseline and check prerequisites.** Keep the current branch,
   dirty worktree and existing data. Record only safe version/status information:

   ```powershell
   git branch --show-current
   git rev-parse HEAD
   git status --short
   node --version
   pnpm --version
   java -version
   pnpm --filter backend build
   Write-Output "backend build exit: $LASTEXITCODE"
   ```

   Stop if compilation fails. No dependency installation or repeated run of the
   already-passed 135-test suite is needed for this plan. If first-use pinned
   Firebase tooling or Java/emulator downloads are unavailable, record Blocked;
   do not bypass build approvals, metadata checks or supply-chain policy.
   Confirm existing approved configuration is already in place without opening,
   printing or synchronising private files. Normal backend startup consumes its
   existing configuration; configuration editing/inspection is not a test step.

2. **Check port ownership without stopping anything.** Use safe listener metadata:

   ```powershell
   Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
     Where-Object { $_.LocalPort -in 3000,5001,8080,8085,4405,4505,8086,4406,4506 } |
     Select-Object LocalAddress, LocalPort, OwningProcess
   ```

   An occupied port requires identifying its known owner. Do not kill arbitrary
   processes, change ports or attach to another project's emulator/identity data.
   If this command is unavailable, the scripts' own port checks still apply;
   record the limitation. Port 8080 is relevant only to the TideCloak part.

3. **Run the isolated real persistence probe first; Docker is not needed.** With
   8086/4406/4506 free:

   ```powershell
   pnpm run test:emulator
   Write-Output "isolated probe exit: $LASTEXITCODE"
   ```

   Let it finish by itself. Require `PASS seed`, successful graceful export,
   `PASS reload`, final `PASS: isolated Firestore...` and exit 0. The wrapper
   creates a unique ignored directory/project, exports and imports in separate
   emulator processes, and compares exact records/history/audit for all six
   collections. It covers synthetic requests, decisions/reasons, cancellation,
   replay and concurrent guards. Do not open or share marker/storage dumps.
   Retain every generated directory, including failed runs; never delete/reset
   demo data to retry. This tests automatic shutdown/reload, not keyboard Ctrl+C
   propagation, a signed-in user or Tide/Fabric authority.
   The corrected runner additionally requires CLI closure and all three ports
   to be available within the bounded post-exit shutdown wait, and checks fresh
   export metadata before reload. The 15 October failed owner run and the still
   unverified correction are recorded in the preceding subsection.

4. **Optionally check the live emulator-unavailable diagnostic.** Only while
   port 8085 has no listener and port 5001 is free, before starting the demo
   emulator:

   ```powershell
   pnpm run demo:backend
   Write-Output "backend unavailable-check exit: $LASTEXITCODE"
   ```

   Expect `[SOC_STARTUP_EMULATOR]`, a short fixed recovery instruction, nonzero
   exit and no backend-ready message. This failure precedes adapter loading and
   app/listener construction. If a demo emulator is already running, skip this
   check rather than stopping an unknown process. Record a different code as
   observed, not as a pass for this case. Do not induce adapter/configuration
   failures by editing, renaming or removing private files.

5. **Start the native demo in separate terminals.** Use the same repository
   root in each. Terminal A:

   ```powershell
   pnpm run demo:emulator
   ```

   Wait for Firestore readiness on 8085. This uses `demo-data/firestore`, not the
   isolated probe's generated data. It imports an existing export if metadata
   exists, otherwise starts empty. Preserve existing records; it is a dedicated
   local demo, not a guaranteed fresh dataset. Do not copy isolated exports into
   this directory. Terminal B, after emulator readiness:

   ```powershell
   pnpm run demo:backend
   ```

   Require `SOC local backend ready; Tide evidence authority unavailable`.
   Terminal C:

   ```powershell
   pnpm run demo:frontend
   ```

   Require frontend readiness on port 3000, not an automatically selected
   alternate port. In a separate check terminal, make only public/unsigned calls:

   ```powershell
   (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5001/api/health).StatusCode
   (Invoke-WebRequest -UseBasicParsing http://localhost:3000/auth/signin).StatusCode
   node -e "fetch('http://127.0.0.1:5001/api/incidents',{redirect:'manual'}).then(r=>console.info(r.status)).catch(()=>{console.error('API unavailable');process.exitCode=1})"
   ```

   Expect 200, 200 and 401 respectively. Do not attach headers, tokens, raw
   response bodies or identity fields. None of these proves successful login.

6. **Optionally check binding diagnostics against the known demo backend.**
   While Terminal B's own backend is healthy on 5001, run this in a new terminal:

   ```powershell
   pnpm run demo:backend
   Write-Output "duplicate backend binding-check exit: $LASTEXITCODE"
   ```

   Expect `[SOC_STARTUP_BIND]` and nonzero exit for the second process, while the
   original backend remains healthy. Do not occupy an unrelated port or terminate
   its owner. Record only the fixed diagnostic code, outcome and exit. The code
   identifies binding/setup failure without claiming a particular errno.
   Configuration, adapter and application-construction failure coverage remains
   the existing 21 mocked tests; do not force these live by changing private
   configuration or application code. An unexpected result stays unresolved.

7. **Add signed-in UI persistence checks only if the existing identity setup
   works.** This is the part that needs Docker for local TideCloak. Check the
   already configured project service using `pnpm run tidecloak:status`; correlate
   the displayed project/service and published port with the intended container,
   since an HTTP 302 alone can come from another server. If its existing container
   is stopped, the owner may use `pnpm run tidecloak:start` only for that same
   configured project. Do not create a realm, alter accounts/roles, or change
   DPoP/PKCE to make login work. If unavailable, mark signed-in checks Blocked;
   the isolated probe and public readiness checks remain separate results.

   With an already working test identity, record safe synthetic request counts,
   status/history and audit outcomes before shutdown. A single new pending
   request on an unused scope with a non-identifying synthetic reason is enough
   for a UI round-trip check; retain all earlier records and do not approve your
   own request. No new account or evidence-unlock attempt is required. If no
   records can be observed, do not claim persistence from an empty restart.

8. **Test actual keyboard shutdown and export.** In Terminal C press Ctrl+C and
   wait for return; then do the same in Terminal B. Finally press Ctrl+C **once**
   in Terminal A. Keep that terminal open until successful emulator export
   completion and return to the prompt. After each process returns, record:

   ```powershell
   Write-Output "observed shutdown exit: $LASTEXITCODE"
   ```

   Do not send repeated interrupts, force-kill Java/Node, close the terminal
   during export or delete data. Record actual Windows Ctrl+C exit values;
   manual interrupt exit codes need not be the isolated probe's required zero.
   Export success and subsequent reload/record comparison are the persistence
   evidence. Export metadata existence alone is insufficient because it may
   predate this run. If export hangs/fails, stop the plan and retain data/logs
   privately; report only safe stage/result information.

9. **Restart and compare.** Repeat Terminal A, then B, then C from step 5. Require
   the emulator to import `demo-data/firestore`, repeat public readiness checks,
   and compare the recorded synthetic request/history/audit state through the
   existing UI if step 7 was available. No duplicate requests, cleared history or
   unlocked evidence should appear. Record partial results honestly: successful
   import is not itself proof of every saved record. Stop frontend/backend and
   emulator again in the same graceful order. Stop TideCloak with
   `pnpm run tidecloak:stop` only if the owner started this project's container
   for the check and intends to stop it; leave unrelated services and all data
   untouched. Do not use the optional application Docker path for this run.

10. **Report each result separately.** Record date/time/timezone, branch/HEAD,
    JavaScript pnpm version, safe phase/result and actual command exit. Keep
    the isolated probe, interactive Ctrl+C, UI persistence and diagnostic checks
    as distinct evidence. Preserve the owner-run 135-test pass and prior
    JavaScript version probe separately. Native pnpm.exe remains **Not tested:
    no native executable found on PATH**. These steps do not pass live JWT or
    genuine Tide encryption/quorum/expiry acceptance. Finish with safe Git
    status and `git diff --check`, without staging, committing or pushing.

## 7. Safe recovery

| Symptom                                                             | Smallest safe next step                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Port 3000/5001/8080/8085/4405/4505 occupied                         | Identify the owner locally; gracefully stop only the tester's known process with permission, or pause. Do not kill arbitrary processes or silently change ports. Alternate native ports need coordinated script/config/client changes and separate approval |
| Missing configuration / disabled login                              | Tester privately completes required names, runs env:sync and restarts/rebuilds frontend. Do not print environment or borrow owner values                                                                                                                    |
| Missing backend output                                              | Run pnpm --filter backend build in clone root, then start emulator before backend                                                                                                                                                                           |
| Backend startup fails                                               | Use the fixed SOC_STARTUP_* stage/recovery table above. Record only the code and outcome; never attach raw errors/configuration. Failure remains closed; no cloud fallback or auth bypass                                                                   |
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

## 8. Approved local Docker — owner verification passed, 22 October 2026

Owner builds and Compose startup passed (exit 0); all three app services Healthy.
Frontend http://localhost:3000/auth/signin returned 200; backend health
http://localhost:5001/api/health returned 200; unsigned incidents returned 401.
Existing TideCloak at local port 8080 was started without recreation; private
login and application functions passed. This is local only, not public hosting.

Owner graceful export completed at 2026-10-21T04:42:23Z; all three app containers
Exited (0). A stopped-export backup was copied outside the repo before restart.
After the final rules-file correction and restart, owner confirmed the same
synthetic request, both decisions, history and audit remain. Internal unsigned
Firestore GET returned 403. Host 8085 was not reachable; use the internal check.
Final release review removed the Firestore Compose host mapping explicitly;
no service restarted. This static correction is separate from earlier owner passes.
Deny-client rules and backend Admin SDK behaviour remain unchanged. Evidence
stays locked; approvals/audit are not a genuine Tide grant.

Current HEAD: `44ea6254a95e72b761929809a95e894146700244`, containing local deployment commits
4143ad8 and 44ea625. Original owner tests covered the prior 8d55ac3-based working
tree, not a separately rerun immutable release. Current docs-only reconciliation
is uncommitted. No remote publication/image identity/independent peer result is
inferred. Agent Docker execution remains denied.

Use the [existing deployment guide](SOC-WEEK9-DEPLOYMENT.md) for startup, stop,
export gate, backup and internal-client verification commands. It retains both
failed rules-path attempts and the final COPY correction under `/app/docker`.
No repeat checks are needed for this documentation update. Independent peer
retest and final release/handoff approval remain pending. F8, genuine Tide
authority/expiry, Braces and uuid remain unresolved. Cloud Run remains unapproved.
Never run `down -v`, delete data, recreate TideCloak or publish the emulator.

## 9. Dependencies and full-PoC limitations

Current evidence (17 October): **local qs verification complete**. Owner audit
reports 0 Critical, 1 High and 1 Moderate; both qs advisories are absent. Owner
backend units passed 135 tests/nine files; coverage passed 135 tests with report
generated and 79.24% lines. Agent resolved-path/parsing/typecheck/lint/build and
frozen-install checks are separately recorded in the triage. No checks repeated
for this documentation update; no new hosted result is inferred.

Braces and uuid remain unresolved. Preserve historical Braces local >=3.0.4
versus hosted patched_versions <0.0.0 disagreement; neither proves a fix. Vitest
migration remains complete. The earlier compatible patch was already applied:
**do not apply it again**. Historical counts/preparation below are retained as
evidence, not current installation instructions. Exact qs evidence is maintained
in the triage; F8, genuine authority and expiry remain unresolved.

### Historical dependency preparation — 8 October 2026 (do not reapply)

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

### Current completion checklist and controlled phases — updated 17 October 2026

Review HEAD: 19399aeb77b81af1a6fd9bf9dee235778ebbb871. Existing learning-log
edits are preserved. These status classes replace stale completion claims in
the dated sections below; no tests or services were rerun for this update.

| Requirement                                                                                                                  | Status class                                          | Evidence / next gate                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard, one-field/read request, 15/30/60-minute choices, distinct non-requester SOC approvals, cancellation/history/audit | **Implemented and verified** at the application layer | Existing unit/owner/emulator evidence; no cryptographic endorsement or active grant inferred. Demo-only 60 seconds stays opt-in.                                            |
| Evidence stays locked after quorum or tampered active flag                                                                   | **Implemented and verified**                          | Source/tests and owner observations; no Tide completion verifier exists.                                                                                                    |
| F1 JavaScript launcher, F3 safe diagnostics, F10 feedback and normal owner login                                             | **Implemented and verified**, within recorded limits  | Existing focused/full tests, owner Edge InPrivate and one live diagnostic branch; do not merge mocks and live results.                                                      |
| Other live diagnostic branches, actual native pnpm.exe path, real induced callback failure and full accessibility matrix     | **Implemented but unverified** for those paths        | Native executable unavailable; blocked-token alert remains inconclusive. No broad blocking/logpoints or passed-test repetition requested.                                   |
| Genuine encryption, same-intent cryptographic endorsements, requester-scoped decryption and Fabric deadline enforcement      | **Blocked by missing external guidance**              | Six exact contract/API questions in SOC-TIDE-CAPABILITIES.md; TIDE-01/02/03 remain blocked.                                                                                 |
| F8 DPoP migration                                                                                                            | **Deferred with a reason**                            | Requires separate coordinated approval; matching relay artifact, validator/token-profile/audience and shared replay/nonce semantics remain gates. Peer cause not confirmed. |
| Approved Vitest migration                                                                                                    | **Implemented and verified**                          | Version/lock consistency, local unit/coverage/build/frozen evidence and hosted f8a05a2 tests/lint/typecheck; exact hosted Node patch was not supplied.                      |
| Compatible qs remediation                                                                                                    | **Implemented and locally verified**                  | Owner 17 October units/coverage/audit and agent path/parsing/typecheck/lint/build/frozen-install results; no new hosted CI claim.                                           |
| Braces/uuid remediation                                                                                                      | **Deferred with a reason**                            | No supported Braces patch or compatible uuid parent migration established. Security checks remain enabled.                                                                  |
| Clean-clone four-identity setup and full live PoC acceptance                                                                 | **Deferred with a reason**                            | Private owner sign-in/onboarding and genuine Tide capabilities are not available to this agent; existing owner success does not prove peer portability.                     |

Minimum future verification, only after a relevant approved implementation:

1. For documentation now: parse the repaired PowerShell SHA block without
   executing it, format changed sections and run git diff --check. No browser,
   emulator, login or application-suite repeat.
2. For genuine authority: real-library/contract fixtures and denial tests for
   self/duplicate/unrecognised endorsers, differing intent/ciphertext/policy/
   requester/field, replay and completion races. Then owner-only four-identity
   live TIDE-01/02/03, each duration and direct cached-ciphertext/authority
   attempts at/after trusted expiry, refresh and reconnect. Already copied
   plaintext cannot be revoked. No live test is requested before implementation.
3. For DPoP: the complete route matrix, real-validator synthetic negative
   tests and multi-instance atomic replay/nonce tests; then one owner-private
   login/refresh/reload/logout and one synthetic read/write/replay rejection
   sequence. No endpoint/header payload capture or generic token-blocking test.
4. For approved dependencies: targeted parser/consumer tests, affected suites,
   typecheck/lint, builds, frozen install and fresh audit; no emulator/browser
   repeat unless that change introduces a specific need.

Keep owner observations, mocked unit checks, isolated emulator persistence and
live Tide/Fabric checks in separate result fields. Hosted passing tests are
not live Fabric verification. No manual action is requested by this review.

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

## F8 local integration boundary — 16 October 2026

The current application supports a Bearer-token integration. Public-client mode
and PKCE S256 do not enable DPoP. SDK 0.14.20 already supports explicit DPoP
opt-in, but the application does not supply it. Its incident/access API calls
send Bearer tokens and the backend has JWT verification without DPoP proof
verification. A client that requires DPoP is **blocked pending coordinated
integration**. Do not weaken that requirement or turn on just a browser flag.
The public template now states this boundary; no template values were changed.

The peer used the mutable `tideorg/tidecloak-dev:latest` tag in a pre-existing
`mytidecloak` container; exact software version and digest were not recorded.
No confirmed SDK/server version incompatibility follows from that evidence.
No teammate action is needed for this local investigation. Do not collect private
adapter data, request bodies, callback URLs, headers or authentication storage.

Smallest next action: review/approve the coordinated DPoP scope in the triage's
16 October F8 investigation. It covers strict SDK opt-in, a reviewed verification
page matching the pin with issuer/client checks and scoped framing rules,
proof-aware API transport, backend proof/key-binding/freshness/replay validation,
CORS/nonce handling and positive/negative tests. Runtime implementation and any
live verification require separate approval. No client/realm policy change or
SDK upgrade is proposed as a shortcut.

Sources checked: [official DPoP guidance](https://docs.tide.org/Core-Concepts/dpop),
[Next.js guide](https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-how-to-guide),
and installed SDK 0.14.20. Current guidance is not a version compatibility matrix.
The new focused installed-source tests use synthetic collaborators only. Their
results are separate from owner browser evidence and will be recorded below.

Keep existing evidence separate: preview and keyboard retry passed; broad
blocked-token failure-to-alert remains inconclusive; owner normal login passed,
including fresh Edge InPrivate on 16 October with evidence locked; peer F8 remains
unresolved. No login reproduction or service operation was performed here.

### F8 local check results — 16 October 2026

- `pnpm --filter frontend test -- tests/unit/investigations/dpop-integration-contract.test.ts`:
  **5 passed, 1 file**, exit 0. Initial run had 2 passed/3 failed because the test
  helper searched only function declarations. Correcting it to locate named
  function expressions made the five checks pass. This was a harness correction,
  not an SDK or application runtime fix.
- `pnpm --filter frontend typecheck`: **passed**, exit 0.
- From `frontend`, `pnpm exec eslint src/lib/tidecloak/config.ts tests/unit/investigations/dpop-integration-contract.test.ts`:
  **passed**, exit 0 (focused lint only).
- Targeted Prettier write completed for the config comment, new test, triage and
  runbook. No unrelated suite or production build was run: runtime behaviour is
  unchanged and private environment files must not be consumed.
- `git diff --check`: **passed**, with existing LF/CRLF notices only.

No check was permission-blocked. No live DPoP request or browser login was tested.
No new manual browser checklist is needed before the proposed scope is approved.
