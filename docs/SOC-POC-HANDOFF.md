# SOC PoC implementation handoff

Date: 8 October 2026 (Australia/Sydney). Branch: feature/soc-emergency-access-poc.
Original candidate baseline: 27b09cbc52b6fb6ed69803b38c55e7f29c6699ee.

## Unapplied dependency proposal repair — 8 October 2026

At this repair's start, HEAD is 8d59f4009c626e828216c792417b8b28533061bf on
feature/soc-emergency-access-poc. The existing 15-file staged documentation group
is preserved. Only docs/SOC-DEPENDENCY-PATCH-PLAN.patch, this handoff and
SOC-POC-RUNBOOK.md change in the working tree; their repaired versions are not
staged. Earlier Git status and baseline statements below are historical snapshots.

The confirmed applicability failure was a line-ending mismatch: the public
pnpm-workspace.yaml has 39 LF endings, while the restored proposal had 26 CRLF
endings. Both files contain valid UTF-8 em dashes; the terminal's display did not
establish saved-file corruption. The original read-only applicability check
returned exit 1. Changing only line endings in a temporary copy outside the
repository made that same context patch pass (exit 0). Its single-space blank
context marker also produced the staged whitespace warning (exit 2, line 24).

The same proposed edits were regenerated from temporary before/after workspace
copies outside the repository. The replacement is a **zero-context unified patch,
UTF-8 without BOM, with LF endings** and no blank context markers. The temporary
copies were removed. Proposed versions and scoped overrides are unchanged.
Validate it without applying, using the required option:

```powershell
git apply --check --unidiff-zero -- docs/SOC-DEPENDENCY-PATCH-PLAN.patch
```

This check passed (exit 0). The proposal remains **unapplied**: the real workspace,
lockfile, manifests and installed dependency state are unchanged. The staged
original proposal still has its whitespace warning because the index was not
altered; the three repaired working-tree files need owner review before any
separate staging action. No application tests or audit were rerun for this
format-only repair, and no vulnerability is claimed resolved.

Owner verification remains passed. Independent laptop startup and live
Tide/JWT/Fabric verification remain unverified. Genuine Tide encryption, scoped
authority and expiry remain unfinished; evidence stays locked after two
application approvals. All **3 Critical, 5 High and 10 Moderate** audit findings
remain unresolved. Nothing was staged, committed or pushed during this repair.

## Owner-observed setup steps and remaining limits — 8 October 2026

Only this handoff and SOC-POC-RUNBOOK.md change in this follow-up. The following
facts are owner observations; the agent did not inspect screenshots, adapters,
environment files or credentials, or perform setup/account/configuration changes.

### Adapter download control and private destination

The working Tide console shows **Apps → soc-incident-report-protection-app →
Credentials → Tide adapter → Download tidecloak.json**. The screenshot confirms
the download control exists, not the downloaded contents or independent setup.
Teammates must export their own realm's application adapter and save it as
**data/tidecloak.json**, relative to the project root. **Do not overwrite an
existing working adapter**; preserve it and resolve the realm/clone choice first.
Do not transfer the owner's adapter or inspect its contents. The runbook gives
the observed action path and the existing Tide installation-provider reference.

### Current application Capability Config

| Setting                   | Owner-observed value |
| ------------------------- | -------------------- |
| Require DPoP bound tokens | Off                  |
| Require PKCE              | On                   |
| PKCE Method               | S256                 |

These are current owner-observed settings, not a verified fresh-laptop procedure
or an instruction to change an existing working configuration. The historical
missing-DPoP-proof/fresh-client compatibility limitation remains open.

### Local Docker image identity

```text
sha256:0d0f1009548bae5f8a3c9c7bd0df59ca0edaa25e89ea8dc6390b5e4593f68a5e
```

This is a **local image ID**, not a registry pull digest or software version.
It does not establish a reproducible image pin or the teammate's image identity.

### Account creation, Tide linking and role assignment

Owner-observed path: **Users → Add user → Credentials → Credential Reset →
Link Tide Account**. Open the enrollment link privately, select **Create account**,
and enter and confirm the account owner's own credentials. The owner skipped
the email step; this is an observation, not a universal enrollment requirement.
Return to **Users → select user → Role mapping → Assign realm role**.

Approved Change Requests and successful sign-ins for all four owner accounts
were observed. **Exact approval/commit button sequence remains unconfirmed.**
Approved is the displayed status and does not prove a separate commit step.

Teammates need their own local realm, four distinct linked test accounts,
passwords and adapter. Owner accounts are local runtime state and are not
transferred by Git. Preserve the owner's existing accounts and configuration.

### Preserved results and remaining limits

The owner normal-terminal typecheck/lint passes, 114 backend tests, 98 frontend
tests (including 14 incident-detail cases) and both production builds below remain
valid owner evidence. Earlier isolated real-Firestore seed/export/reload remains
VERIFIED for that probe; neither category establishes fresh-laptop startup.

Independent startup and interactive/Docker restart remain unverified. Live
Tide/JWT/Fabric verification remains unverified; genuine encryption, scoped
authority, decryption and expiry remain unfinished. Evidence stays locked after
two application approvals. All 3 Critical, 5 High and 10 Moderate dependency
findings remain unresolved. **The complete PoC remains incomplete.**

The runbook now credits the image ID, settings, account action names and adapter
download control instead of asking for those again. Remaining setup questions
cover image software version/registry provenance if safely available, exact
current redirect/web-origin/post-logout settings, and the governance approval/
commit sequence. Fresh-laptop execution is still required.

## Historical partial owner setup evidence — earlier 8 October 2026

The owner reports a partial TideCloak Change Requests view with Approved entries
for creating the four SOC roles and four test users, granting roles to users,
setting tideInvitable to true, setting the application DPoP attribute to false,
and updating client redirect URIs and web origins. The owner also confirms that
all four existing accounts can sign in. This is an owner report; the agent did
not inspect the screenshot or record identities, IDs or other identifiers.

Approved is recorded only as the displayed change-request status. The excerpt
does not establish the complete history, exact submission/approval button order
or whether a separate commit action was performed. At that time, the reported
DPoP attribute change alone did not establish the current Capability Config
field; later owner screenshot values are recorded above. No redirect/origin
values were supplied, so none are inferred.

The runbook credited this partial evidence at that stage. The later owner facts
above now establish action names, current Capability Config values, a local image
ID and the adapter download control; remaining questions are narrowed accordingly. Existing accounts/configuration remain unchanged. Independent startup
and live Tide/JWT/Fabric checks remain unverified; genuine scoped authority and
expiry remain unfinished and evidence stays locked. The audit findings remain
unresolved. This update changes only this handoff and the runbook.

## Owner post-correction verification — 8 October 2026

**R-01 is corrected and its regression tests passed in the owner's normal
PowerShell terminal. Ready for review; publication/security review and independent
startup remain pending. The full Tide PoC is incomplete and evidence stays locked.**

Evidence source: the newly supplied owner terminal transcript. These are owner
results, not an agent rerun or independent-laptop execution. The transcript shows:

| Command                       | Actual owner result                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| pnpm run typecheck            | PASS: frontend and backend                                                                         |
| pnpm run lint                 | PASS: frontend and backend                                                                         |
| pnpm run test:all — backend   | PASS: 114 tests in 8 files                                                                         |
| pnpm run test:all — frontend  | PASS: 98 tests in 11 files, including all 14 incident-detail tests                                 |
| pnpm run build                | PASS: frontend production compilation/typecheck/prerender and the chained backend TypeScript build |
| pnpm audit --audit-level=high | Completed and returned 18 unresolved findings: 3 Critical, 5 High, 10 Moderate; not a clean audit  |
| git diff --check              | PASS: explicitly reported exit code 0; line-ending warnings only                                   |

The transcript prints the numeric exit code only for git diff --check. Other
numeric exits were not captured; the check outcomes above use the displayed
completion/test summaries. No numeric audit exit is invented.

All six new incident recovery regressions executed within the 14-case suite:
recovery from not-found and API errors, consistent replacement of failure states,
and late old success/not-found/API-error responses failing to overwrite the current
incident. The frontend tests mock authentication, API calls and framework surfaces;
backend units use mocked verification/store fixtures and generated test-key JWTs.
These results do not establish live JWT, Tide/Fabric authority or browser recovery
on the teammate's laptop. PEER results remain blank; TIDE-01..03 remain Blocked.

The fresh owner audit reports the same eight High/Critical advisory IDs as the
earlier JSON reconciliation below: @fastify/busboy (GHSA-xjh9-v7x6-24jw,
GHSA-x8mw-p69m-v3mx), braces (GHSA-vfj7-8cjw-p6xm), source-map-js
(GHSA-68fv-2mgg-jv7q), proxy-addr (GHSA-jqcg-44mw-7w3h), tinypool
(GHSA-5gmw-xhrv-c9v3, GHSA-85c8-ppgw-ccpr) and sharp (GHSA-wq5f-xc86-pv6w).
Its table abbreviates longer path lists; the earlier JSON-based exact-path
reconciliation remains the recorded inventory. The audit lists braces >=3.0.4 as
patched, as did the earlier JSON; a published compatible fix was not established
by the earlier official-source review. No new package/advisory research,
dependency change, lockfile update or Tide SDK change was performed here.
All 18 findings remain unresolved. Audit presence alone does not prove
application exploitability.

The owner's earlier isolated Firestore seed/export/reload remains VERIFIED for
that real emulator probe; it was not rerun in this follow-up. Interactive/Docker
restart, fresh-laptop startup and live Tide/JWT/Fabric checks remain unverified.
Application request/review/history/audit behaviour is implemented. Genuine Tide
encryption, scoped authority, decryption and expiry remain unfinished; two
application approvals still leave evidence locked. The command transcript did
not answer the non-secret setup questions; the additional owner evidence above
now supplies approved change categories plus current Capability Config values,
account action names, local image ID and adapter download control. The exact
governance approval/commit sequence, remaining client redirect/logout settings,
image version/registry provenance and fresh-laptop execution remain open. Do not
recreate or change the four existing owner accounts.

This follow-up changes only the handoff, runbook, build status, peer plan and the
narrow audit-status paragraph in SECURITY.md. Application source/tests,
dependencies, user configuration and existing guardrails are preserved. The
earlier agent failures below remain historical evidence. No blocked app command
was repeated. Agent checks for this documentation follow-up: targeted Prettier
check and git diff --check passed (exit 0); content/inventory checks confirmed
blank peer results and only these five intended documentation changes.

## Historical focused incident recovery correction — earlier 8 October 2026

**R-01 was corrected in this agent task; its regression cases did not execute
in that environment. The later owner transcript above verifies all 14 cases.**

Changed in this focused task:

- frontend/src/app/(dashboard)/incidents/[id]/page.tsx
- frontend/tests/unit/app/incident-detail.test.tsx
- docs/SOC-POC-RUNBOOK.md
- docs/SOC-POC-HANDOFF.md
- docs/SOC-POC-BUILD-STATUS.md (narrow R-01 status correction)
- docs/SOC-PEER-TEST-PLAN.md (narrow R-01 status correction; case IDs/results preserved)

Earlier implementation and documentation remain in place. Application changes
are limited to the incident page and its existing tests. No dependency, lockfile,
authentication, backend, account, role, realm or evidence-authority change was made.
Existing four owner-created accounts were not recreated, inspected or changed.

### Root cause, smallest correction and regression coverage

A successful fetch set incident but left the previous notFound/error values.
When the incident ID changed without unmounting, the new incident loaded but
render conditions could still show the old failure. The page now clears both
failure states on success. On failure it clears stale incident data; not-found
clears the other error, and other errors clear notFound. This adds five state-reset
lines. The ignore checks in success, catch and finally, and cleanup that marks
the old effect ignored, remain unchanged. Authentication, request-status rendering,
request links and locked evidence are preserved.

Six cases were added to the existing eight-case incident suite:

1. Same-instance recovery from not-found to a valid incident.
2. Same-instance recovery from an API error to a valid incident.
3. A current API error replaces an earlier not-found state.
4. A late older success cannot replace the current incident.
5. A late older not-found response cannot replace the current incident.
6. A late older API error cannot replace the current incident.

These assert current content/loading state and retained locked evidence/request
links. They are mocked component tests, not browser, live JWT or Fabric proof.
**None of the 14 incident-suite cases executed in this task.**

### Actual focused verification

| Check                                                                      | Exit / execution                  | Result                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pnpm --filter frontend run typecheck                                       | 0                                 | Frontend source and existing test TypeScript pass                                                                                                                                                                                    |
| pnpm --filter frontend run test -- tests/unit/app/incident-detail.test.tsx | 1                                 | The separator was forwarded literally, so Vitest selected the broader frontend suite: 37 tests passed in four files; seven suites failed to load Next imports. Incident suite failed resolving next/navigation before any assertions |
| Corrected single-file command with normal-terminal access                  | Not started; no process exit code | Automatic approval review missed its deadline, including the single permitted retry. No successful targeted run or permission change                                                                                                 |
| Frontend Prettier write/check from frontend directory                      | 0                                 | Test formatting and page/test checks pass. Initial root-directory attempt exited 1 because the Tailwind plugin did not resolve; no file changed in that failed attempt                                                               |
| git diff --check                                                           | 0                                 | Final whitespace check passes                                                                                                                                                                                                        |

The 37 executed tests were utils (6), access API (10), AuthProvider (13) and
useAccessData (8). They are existing mocked units and do not verify this correction.
Known lint/build installed-file EPERM failures were not repeated. Backend tests,
emulator persistence and dependency audit were not rerun for this page-only fix.
The earlier 92-test owner pass did not cover the six new cases at that time.
The later 98-test owner transcript above does cover them. No interactive services, logins, external accounts or Tide MCP calls ran.

### Historical manual checks and still-open onboarding answers

These commands were supplied at the time of the correction. The later owner
transcript above completes the application checks, including all 14 incident
cases within test:all. Retain this sequence as a rerun reference after a future
change. The targeted command has **no extra -- separator**; record each exit
separately:

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

The unchanged real-emulator probe remains verified by the owner's earlier isolated
seed/export/reload. Interactive restart and another laptop's first launch remain
separate and unverified. If repeating the emulator probe separately, retain its
port/isolation guards and existing data as documented in the runbook.

At that stage the runbook questionnaire asked for image identity/version,
current DPoP/client settings, creation/linking actions, governance and export
actions. It is now narrowed by the owner observations above; the local image ID,
DPoP/PKCE values, account action names and adapter download control are credited. Do not recreate the owner's four existing accounts or transfer them,
private configuration, keys, adapter contents or TideCloak data to the teammate.

Application request/review/history/audit workflow is implemented. Two distinct
other application approvals still reach authorising/unavailable with locked
evidence. Genuine Tide encryption, scoped authority, decryption and expiry are
unfinished. Policy v4 or an SDK upgrade is not a confirmed solution. Independent
startup is unverified. The supplied **3 Critical, 5 High and 10 Moderate** findings
remain unresolved. This agent correction did not complete an audit or change
dependencies; the later owner audit above returned those same totals.

### Git safety

Branch remains feature/soc-emergency-access-poc at full HEAD
27b09cbc52b6fb6ed69803b38c55e7f29c6699ee. The complete candidate is still uncommitted.
There are 33 modified tracked files and 40 new task files plus the separate
excluded user configuration. The 73-path manifest below remains the complete task
proposal, not a count of this correction's six files. The index is empty.
No environment or credential files or private user configuration were inspected.
Nothing was staged, committed, pushed, merged, deployed or discarded.

## Historical peer preparation and review — earlier 8 October 2026

**Ready for review: yes. Ready for publication: no. Independent startup: not
verified and blocked by missing fresh-setup instructions. Full Tide PoC:
incomplete. Evidence remains locked.**

Repository: https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git.
Current full HEAD: `27b09cbc52b6fb6ed69803b38c55e7f29c6699ee`.
**This baseline does not contain the complete uncommitted implementation.**
The source/demo scripts and required new files remain in the worktree. No feature
remote-tracking ref was found locally; remote availability was not checked. No
complete published test SHA exists in this handoff yet.

Read the [runbook](SOC-POC-RUNBOOK.md), [build status](SOC-POC-BUILD-STATUS.md),
[capability assessment](SOC-TIDE-CAPABILITIES.md), [peer plan](SOC-PEER-TEST-PLAN.md),
[results template](SOC-PEER-TEST-RESULTS-TEMPLATE.md) and
[learning log](tide-mcp-learning.txt). The requested reviewed Word guide and other
review-reference attachments were not accessible among the supplied reference
files; no content from them was assumed.

### Changes made by this task

Nine documentation files changed: this handoff, the runbook, build status,
capabilities, peer plan, results template, learning log, TESTING.md and SECURITY.md.
The last two received narrow corrections to stale persistence/audit statements.
All implementation, scripts, manifests, dependencies, lockfile, authentication,
guardrails and private/user configuration were preserved.

The expanded change set has **73 individual task files: 33 modified tracked files
and 40 new task files**. The separate untracked .claude/settings.local.json is
user configuration and is excluded from the publication proposal. The index is
empty. The exact manifest and proposed commit groups below cover all 73 paths,
including these documentation edits. Directory status entries are not files.

### Current executed checks and evidence sources

| Command                         | Exit code | Actual agent result / evidence category                                                                                                            |
| ------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm run typecheck              | 0         | Both packages pass; static checks                                                                                                                  |
| pnpm run lint                   | 1         | Child ESLint exit 2; EPERM opening installed brace-expansion@1.1.21/index.js before source linting                                                 |
| pnpm run test:all               | 1         | Backend 114 tests in 8 files pass; frontend 37 tests in 4 files pass, 7 suites fail to load next/link or next/navigation                           |
| pnpm run build                  | 1         | EPERM opening installed next/dist/bin/next before frontend compilation; chained backend build not reached                                          |
| pnpm --filter backend run build | 0         | Separate backend production compilation passes                                                                                                     |
| pnpm run test:emulator          | 1         | Backend compilation passes; Firebase CLI EPERM resolving the user profile before emulator startup; no transactions/export/reload executed by agent |
| pnpm audit --audit-level=high   | 1         | EACCES/fetch failed; no new severity totals returned                                                                                               |
| git diff --check                | 0         | Final whitespace check passes; not application execution                                                                                           |

Frontend units mock authentication/network/framework surfaces. Backend units use
mocked verified identities and MemoryStore, plus local generated test-key JWT
checks. Those checks do not prove live TideCloak/JWT/Fabric integration. No test
suite was removed, assertion weakened, permission changed or blocked check marked
as passed.

Before the isolated probe, its guards were inspected: a dedicated demo-prefixed
project, a unique ignored .emulator-tests directory, synthetic identities, no
cloud fallback and no import of owner demo data. Ports 8086/4406/4506 were available.
The failed run did not start Firestore or delete existing data.

### Other evidence — keep attribution separate

| Area                                                                                                | Evidence source                                                                       | Result and limit                                                                                                                                              |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend typecheck/lint, all 92 frontend tests, both production builds                              | Earlier owner normal-terminal report                                                  | Reported Pass; not this agent run or peer execution                                                                                                           |
| Isolated Firestore seed/export/reload                                                               | Owner execution report, unchanged real FirestoreStore probe with synthetic identities | Persistence VERIFIED for this probe, including requests, approvals/rejection reasons, cancellation/history/audit, duplicate/self-review rules and concurrency |
| Interactive native/Docker restart and independent laptop startup                                    | No completed independent execution                                                    | Unverified; isolated probe success does not establish these paths                                                                                             |
| Four distinct local identities and equal application actions                                        | Owner report plus source/unit review                                                  | Local application testing reported; peer case fields stay blank                                                                                               |
| Two distinct other approvals then authority.failed; evidence locked                                 | Owner report plus service source/units                                                | Expected unavailable-authority boundary; no Fabric authorisation established                                                                                  |
| setup-forseti-e2ee, custom-contracts and version-policy lookups                                     | User reports authorised calls completed                                               | No longer pending approval; sources did not establish complete network-tested SOC endorsements, scope or expiry                                               |
| Live JWT negative checks, genuine encryption/decryption, scoped authority, cached-ciphertext expiry | No complete live acceptance evidence                                                  | Unverified/Blocked; TIDE-01..03 remain Blocked                                                                                                                |
| Chrome failure, Edge success, voucher and ORK observations                                          | Historical owner observations                                                         | Workaround only; root cause not confirmed; no demonstrated cause of later token HTTP 502                                                                      |

The earlier read-only login diagnosis could not retrieve Docker logs because
access was denied. It did not confirm the token-failure cause. No login attempt,
interactive service startup, account change, browser verification, Tide research
or MCP call was made in this task. No raw logs or private session data were copied.
Policy v4 and an SDK upgrade are **not confirmed solutions**. Minimum compatible
SDK/enclave/ORK versions and exact contract/endorsement/completion semantics
remain unresolved.

### Focused implementation review and confirmed defect

The complete 73-path task set, including new source, tests, scripts, templates,
Docker files and documentation, was reviewed for the requested boundaries.

- Existing TideCloak verification remains the backend default. Workflow routes
  require authentication and recognised SOC membership; /api/me stays
  authentication-only. Browsers use backend APIs, not Firestore.
- Stable verified issuer/subject references and transactions enforce distinct
  reviewers, requester exclusion, duplicate decisions, immutable input and
  operation replay. Rejection needs a reason. Only the requester cancels a pending
  request. My Requests filters by that requester; other recognised members may
  read safe review/audit details.
- All four roles have equal request/review rights. The backend requires two
  distinct other recognised users; it does not hard-code a four-person roster.
  The peer setup must provide four distinct users as specified.
- The second approval creates authorising/unavailable metadata, one blocked
  authority job and authority.failed. There is no authority activation endpoint
  or evidence-unlocking fallback. Evidence projection remains unavailable.
- Ordinary incident/request/audit responses use safe allow-lists. No genuine
  protected evidence values were found in ordinary fixtures/responses/logging.
  Test tampering sentinels are artificial denial fixtures, not evidence data.
- Proposed publication excludes private configuration, adapters, keys, runtime
  databases, exports, caches and temporary probe/build output. Filename/category
  scanning is bounded to the safe task manifest; real private files were not read.

**Historical finding R-01 — corrected and owner regression tests verified above; peer browser checks pending.**
Source: frontend/src/app/(dashboard)/incidents/[id]/page.tsx, lines 59–86 and
104–110. Success updates incident but does not clear notFound/error; the render
conditions continue to hide a successfully loaded incident. If a failed ID is
replaced by a valid ID without unmounting, loadedForId advances but the prior
failure remains. This affects route/context recovery (PEER-17/18). It is an
existing state-handling defect, not introduced by the new request-status insert;
the relevant effect is unchanged from HEAD.

Evidence is source review, not a browser reproduction. Smallest proposed
correction: clear notFound/error on successful loading and make failed-load states
mutually exclusive; retain the current cancellation guard. Add bad-ID-to-valid-ID
and error-to-valid-ID same-instance regression tests. No code or tests were edited.
A full page reload may work around it but does not fix it. No other confirmed
application defect was established by this focused review.

### Independent setup blockers and manual information needed

Existing owner accounts, private configuration, adapter and TideCloak database
are local runtime state, absent from Git. The teammate needs their own fresh
instance, realm/client, four distinct Tide-linked identities and governed
soc-analyst, soc-supervisor, soc-team-leader and soc-manager assignments. Use
separate browser profiles; roles do not create separate identities.

Permitted evidence establishes the realm wizard and one linked administrator,
but not the full fresh public-client settings with DPoP preserved, four-user
linking and governed assignment sequence, actual governance review/recovery
steps, or a reproducible current provider-adapter export walkthrough. Historical
DPoP disabling and broad redirects must not be repeated. Administrative governance
approvals are different from SOC incident decisions. Do not invent UI labels,
thresholds, enrollment endpoints, SDK methods or formats.

The owner must supply a **sanitized successful setup walkthrough**: action/setting
names, ordering, the actual governance process and recovery steps, compatible
client proof support, and the installation-provider export location. Include the
TideCloak image version/digest used if safely available. Exclude identity values,
enrollment/action links, adapter/key material, tokens and secrets. No reviewed Word
guide was accessible to close these gaps. The mutable image tag is not a verified
compatible version pin.

Source confirms the native flow: own configuration from .env.example, explicit
env:sync, compiled backend, emulator 127.0.0.1:8085, backend 5001, frontend 3000.
The three demo commands do not perform complete identity/client provisioning.
The runbook contains installation, readiness/unsigned API, graceful export/restart
and safe recovery instructions. Those instructions do not establish first launch.

### Short owner checklist

- [ ] Review R-01 and authorise its separate minimal correction, or explicitly
      document acceptance for limited testing. Review all proposed publication files.
- [ ] Run the exact normal-PowerShell checks in runbook section 10; record each exit
      code and stage. Preserve the lockfile, policies and data. Do not apply the patch.
- [ ] Review the unresolved 3 Critical, 5 High and 10 Moderate findings and decide
      whether limited local synthetic-data testing is acceptable. No exploitability
      or remediation claim is made.
- [ ] Supply the minimum non-secret fresh-client/linking/governance/export walkthrough
      described above, preserving DPoP, redirects and existing governance.
- [ ] In a separately authorised Git step, publish the approved complete task version,
      grant repository access and give the teammate its full 40-character SHA.
      Do not give the baseline SHA as the complete candidate.
- [ ] Review returned peer results; keep Tide acceptance Blocked until supported
      integration is implemented and exercised separately.

### Short teammate checklist

- [ ] Use a new laptop clone; verify branch and exact published SHA before installation.
- [ ] Install the specified tools/frozen lockfile; create only your own private
      configuration, TideCloak data, realm/client, adapter and four linked identities.
- [ ] Complete governed matching roles using the validated walkthrough. Use four
      separate browser profiles. Stop at any unresolved essential setup step.
- [ ] Run env:sync and checks/build; start emulator, backend and frontend separately;
      record readiness, unsigned API 401 and the first successful manual login.
- [ ] Execute PEER-01..24 and the isolated real-emulator probe; separately execute
      native graceful export/restart. Fill only actually executed case fields.
- [ ] Return redacted results and developer-experience feedback for the exact SHA.
      TIDE-01..03 stay Blocked; never copy the owner's private state.

### Readiness and proposed draft PR

Ready for review: **yes**, with the full change set and this review finding.
Ready for publication: **no** in this task; owner review, R-01 decision, unresolved
dependency risk and blocked-check follow-up remain. Independent startup: **no**;
essential fresh-client/onboarding steps are missing, the complete version is
unpublished and no teammate launch has been executed. No new deadline is set.

Proposed draft PR title: **Add SOC request, review and audit demo with peer test handoff**

Proposed description:

> SOC members can submit read-only requests for one incident resource, review
> other members' requests, reject with a reason, cancel their own pending requests
> and inspect retained history/audit. Two distinct other application approvals
> reach authorising/unavailable and evidence remains locked. Native/Docker demo
> recipes and 27 peer cases document the independent testing path and its gaps.
>
> Validation: agent typechecks, 114 backend units, 37 frontend units and separate
> backend build passed; full units exit 1 because seven frontend suites fail to
> load Next imports. Lint/production build/emulator startup are blocked by installed
> file/profile EPERM; audit fetch fails. Owner separately reports passing all 92
> frontend tests, frontend lint/build and isolated real-emulator seed/export/reload.
>
> Limitations: R-01 incident recovery defect; unresolved 3 Critical/5 High/10
> Moderate findings; missing reproducible fresh-client/four-account setup; no
> independent startup/browser/JWT-negative verification. Genuine Tide encryption,
> scope/quorum, decryption and expiry are unfinished; TIDE cases remain Blocked.
> No dependency/Tide SDK upgrade, authentication or evidence-unlocking change.

### Full test SHA after publication — owner action only

After the approved commits are published in a separately authorised step, run:

```powershell
git branch --show-current
git rev-parse HEAD
git ls-remote origin refs/heads/feature/soc-emergency-access-poc
```

Confirm the local full SHA equals the published branch tip, then give that SHA,
branch and repository access to the teammate. If more commits were published,
choose and explicitly record the approved candidate; never use a short hash or
copy working-directory state as a substitute. The runbook's fresh-clone check
stops on a mismatched full SHA. No remote/Git write was performed here.

### Historical documentation-only preparation — earlier 8 October 2026

The earlier task changed five peer-handoff documents, compared 154 permitted
baseline files and ran document checks without app checks. Its directory-level
Git status count and 71-path manifest are superseded by the expanded 73-path
manifest below. Its original owner/agent evidence remains separately attributed
in this report; the current task reran the authorised application checks.

## Local audit reconciliation and verified persistence — 8 October 2026

This records the earlier JSON-based supplied-audit reconciliation and patch
attempt. The later owner threshold audit above confirms the same severity totals
and High/Critical advisory IDs. Earlier agent-session results below are historical;
current checks and attribution are recorded above.
The supplied local audit JSON is now available and reports **3 Critical, 5 High
and 10 Moderate findings**. All eight High/Critical entries were reconciled with
their exact advisory IDs, every reported dependency path, the current root
lockfile, installed pnpm lockfile and installed target package manifests.
All 40 advisory/path occurrences match; they represent 34 distinct dependency
paths. The audit, locked and installed target versions agree on every path.
Sharp has two installed peer instances, both 0.35.4. No finding was dismissed
because it is a development or optional dependency, or assumed exploitable.

### Firestore persistence: VERIFIED — user-executed isolated seed and reload

On 8 October 2026 the user confirmed that both isolated Firestore seed and reload
tests passed in their normal terminal. This verifies the current probe's real
AccessService/FirestoreStore transactions and graceful export/import persistence:
pending requests, decisions and rejection reasons, cancellation/replacement
history, all six collections, audit records and operation replay. The seed phase also
asserts duplicate-request/approval rejection, requester exclusion, equal recognised
roles and concurrent-operation consistency; duplicate/self-approval guards and
operation replay are checked again after restart.

Evidence source: the user's successful execution report, not an agent rerun or
independently captured transcript. The emulator scripts and storage implementation
are unchanged in this follow-up. Mocked MemoryStore unit tests are separate.
**Live Tide, JWT middleware/account verification and Fabric authority/decryption/
expiry remain UNVERIFIED.** Synthetic verified-identity fixtures do not establish
those results. Evidence stays locked. The isolated pass does not establish Docker
retention, interactive demo Ctrl+C handling, crash durability or production index
readiness. Recheck persistence after installing any future dependency patch.

### All High/Critical findings and official patch evidence

Path groups P1–P6 below enumerate every reported path and actual parent version.
The Locked/Installed columns are the current versions after the failed patch
attempt; proposed versions are not installed. Severity follows the supplied audit.
The two Tinypool maintainer pages label severity High; the audit's Critical
classification is retained rather than silently downgraded.

| Audit ID / severity | Package / path group | Advisory                                                                                            | Locked | Installed | Official evidence and action                                                                                                                                                                                |
| ------------------- | -------------------- | --------------------------------------------------------------------------------------------------- | ------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1240981 / High      | @fastify/busboy / P1 | [GHSA-xjh9-v7x6-24jw](https://github.com/fastify/busboy/security/advisories/GHSA-xjh9-v7x6-24jw)    | 3.2.0  | 3.2.0     | Affected >=3.1.0, <3.2.1; fixed 3.2.1. Propose 3.2.2 to cover the additional Moderate finding as well. Installation blocked.                                                                                |
| 1240982 / High      | @fastify/busboy / P1 | [GHSA-x8mw-p69m-v3mx](https://github.com/fastify/busboy/security/advisories/GHSA-x8mw-p69m-v3mx)    | 3.2.0  | 3.2.0     | Affected >=1.0.0, <3.2.1; fixed 3.2.1. Same proposed 3.2.2 resolution. Installation blocked.                                                                                                                |
| 1240992 / High      | braces / P2          | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)                            | 3.0.3  | 3.0.3     | Official advisory affects <=3.0.3 and says Patched versions: None. The pasted audit recommends >=3.0.4, but an official fixed release was not established. Do not install an assumed 3.0.4 fix. Unresolved. |
| 1241209 / High      | source-map-js / P3   | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)                            | 1.2.1  | 1.2.1     | Affected >=1.0.0, <1.2.2; fixed 1.2.2. Propose scoped parent-child resolutions to 1.2.2. Installation blocked.                                                                                              |
| 1241210 / Critical  | proxy-addr / P4      | [GHSA-jqcg-44mw-7w3h](https://github.com/jshttp/proxy-addr/security/advisories/GHSA-jqcg-44mw-7w3h) | 2.0.7  | 2.0.7     | Affected >=1.1.0, <2.0.8; fixed 2.0.8. Propose the compatible patch for both Express 4 and Express 5 consumers. Installation blocked.                                                                       |
| 1241260 / Critical  | tinypool / P5        | [GHSA-5gmw-xhrv-c9v3](https://github.com/tinylibs/tinypool/security/advisories/GHSA-5gmw-xhrv-c9v3) | 1.1.1  | 1.1.1     | Affected <=2.1.0; fixed 2.1.1. The current Vitest parent accepts ^1.1.1, which excludes 2.x. No major override applied. Requires a reviewed parent migration.                                               |
| 1241261 / Critical  | tinypool / P5        | [GHSA-85c8-ppgw-ccpr](https://github.com/tinylibs/tinypool/security/advisories/GHSA-85c8-ppgw-ccpr) | 1.1.1  | 1.1.1     | Audit affects <2.1.2; maintainer page lists <=2.1.0 and fixed 2.1.2. Use a parent release that removes these paths or supports >=2.1.2 to cover both reports. Requires a reviewed parent migration.         |
| 1241331 / High      | sharp / P6           | [GHSA-wq5f-xc86-pv6w](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w)      | 0.35.4 | 0.35.4    | Affected <0.35.5; fixed >=0.35.5. The maintainer identifies librsvg 2.63.2 in the prebuilt fix. Propose 0.35.5 on the existing 0.35 release line. Installation blocked.                                     |

### Smallest supported compatible patch — prepared, not applied

The reviewable artifact is docs/SOC-DEPENDENCY-PATCH-PLAN.patch. It proposes only
root security overrides and remains unapplied. Its repaired format is zero-context
unified diff, UTF-8 without BOM, with LF endings. The required read-only command is
`git apply --check --unidiff-zero -- docs/SOC-DEPENDENCY-PATCH-PLAN.patch`;
it passes (exit 0). It is not an active dependency change and contains no fabricated
lockfile or integrity values.

| Target          | Installed parent range / release evidence                                                                                                                                                                                           | Proposed change                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| @fastify/busboy | firebase-admin@13.10.0 accepts ^3.0.0. [3.2.2 manifest](https://raw.githubusercontent.com/fastify/busboy/v3.2.2/package.json); [additional Moderate fix](https://github.com/fastify/busboy/security/advisories/GHSA-gxm5-99cw-xjw9) | Pin firebase-admin@13 > @fastify/busboy to 3.2.2; covers both High findings and Moderate 1241276 |
| source-map-js   | postcss@8.5.25/8.5.28 and @tailwindcss/node@4.3.3 accept ^1.2.1; magicast@0.3.5 accepts ^1.2.0. [1.2.2 manifest](https://raw.githubusercontent.com/7rulnik/source-map-js/v1.2.2/package.json), Node >=0.10.0                        | Three scoped overrides resolve every P3 path to 1.2.2                                            |
| proxy-addr      | express@4.22.2 accepts ~2.0.7; express@5.2.1 accepts ^2.0.7. [2.0.8 manifest](https://raw.githubusercontent.com/jshttp/proxy-addr/v2.0.8/package.json), Node >=0.10                                                                 | Separate Express 4/5 overrides resolve every P4 path to 2.0.8                                    |
| sharp           | Existing override already selects ^0.35.0 and installed 0.35.4. [0.35.5 manifest](https://raw.githubusercontent.com/lovell/sharp/v0.35.5/package.json), Node >=20.9.0; this checkout runs Node 24.19.0                              | Pin the existing override to 0.35.5; retain the current release line                             |

These compatibility checks establish accepted version ranges and engine support,
not a passing build with updated packages. No direct production dependency is
added. Root/frontend Next pins and Tide SDK versions are unchanged.

Actual patch execution: anonymous official registry reads returned EACCES, both
normally and on a reviewed retry. pnpm install --lockfile-only --ignore-scripts
reached the existing supply-chain policy checks but metadata/attestation requests
were denied; that attempt was interrupted after repeated EACCES responses. The
reviewed retry with --fetch-retries=0 failed the same policy check on 898 entries
with ERR_PNPM_META_FETCH_FAIL. No security policy was disabled. The lockfile was
never rewritten and dependencies were never installed. Only the provisional
workspace override edits were restored, preserving the exact prior workspace
file and lockfile. The proposed artifact remains available for review and a normal-
terminal retry using the runbook.

Consequently **all 18 findings in the supplied audit remain unresolved**. No
reduced count or clean audit is claimed. A new threshold audit also returned
fetch failed; current registry totals cannot be independently confirmed.

### Required major migration: proposal only, needs approval

Do not force Tinypool 2.x into Vitest 3.2.7. A concrete candidate is coordinated
Vitest and @vitest/coverage-v8 4.1.11 updates in both packages, followed by the
[official migration guide](https://vitest.dev/guide/migration/), full tests/builds
and a resolved-graph/audit check. The [Vitest 4.1.11 manifest](https://raw.githubusercontent.com/vitest-dev/vitest/v4.1.11/packages/vitest/package.json)
no longer declares Tinypool directly. Verify the complete new graph before claiming
its removal. Its Node range is ^20.0.0 || ^22.0.0 || >=24.0.0, compatible with this
checkout's runtime. The [coverage manifest](https://raw.githubusercontent.com/vitest-dev/vitest/v4.1.11/packages/coverage-v8/package.json)
is from the same release. [GHSA-82fw-gwwq-j7x9](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9)
also names 4.1.11 as the fix for the two supplied Moderate Vitest/mocker entries.
This is a required major upgrade outside the previously authorised patch scope;
it was not applied. No new Tide guidance or SDK upgrade is proposed.

The other supplied Moderate findings (uuid, qs and ip-address) remain recorded
without claiming remediation. Braces needs a published, verified fix or a supported
parent solution. Counts and advisory text do not establish application exposure.

### Historical agent verification — earlier audit reconciliation

The context-patch applicability result below is historical. The later CRLF
checkout failure and its replacement zero-context check are recorded above; use
the required --unidiff-zero option for the current artifact.

| Check                                                  | Actual result                                                                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm run typecheck                                     | PASS: frontend and backend                                                                                                                |
| pnpm run lint                                          | FAIL before source linting: installed brace-expansion@1.1.21/index.js EPERM in both packages                                              |
| pnpm run test:all                                      | Backend PASS: 114 tests / 8 files. Frontend overall FAIL: 37 tests / 4 files pass; seven suites fail loading next/link or next/navigation |
| pnpm run build                                         | BLOCKED before frontend compilation: installed Next executable EPERM; chained backend build skipped                                       |
| pnpm --filter backend build                            | PASS separately                                                                                                                           |
| pnpm audit --audit-level=high --json --fetch-retries=0 | FAIL: fetch failed; no new advisory counts                                                                                                |
| git apply --check docs/SOC-DEPENDENCY-PATCH-PLAN.patch | PASS: read-only applicability check; patch not applied                                                                                    |
| Isolated Firestore seed and reload                     | VERIFIED: user executed both successfully; not rerun by the agent                                                                         |
| Live Tide / JWT / Fabric verification                  | UNVERIFIED; evidence locked                                                                                                               |

The user's earlier frontend typecheck/lint, 92 frontend tests and both production
build passes remain separate normal-terminal evidence. Current agent failures
are not evidence that those user runs failed, or a substitute for testing patched
packages. Final targeted Prettier, git diff --check, credential-shaped artifact/conflict
and patch-applicability checks pass. A 76-file SHA-256 comparison confirms that
only the two reports changed among baseline files; the proposed patch is the only
new intentional artifact. Active workspace overrides match the unchanged lockfile.
Git status is 33 modified tracked files and 39 untracked files, including the
preserved user configuration; the index remains empty. The new local cache index
from the failed resolver was removed without reading it or deleting existing data.

### Historical changes and blockers — earlier audit reconciliation

Changed in that follow-up: docs/SOC-POC-HANDOFF.md, docs/SOC-POC-RUNBOOK.md and
new docs/SOC-DEPENDENCY-PATCH-PLAN.patch. No application/emulator source,
manifests, active overrides, installed dependencies or lockfile changed. Prior
work, user configuration, authentication, equal-role checks and guardrails remain
intact. No credentials, realm/account/policy settings or Docker volumes were
inspected or changed. No Tide MCP call, staging, commit, push or deployment.

Remaining work: run the compatible patch installation where registry metadata
and attestation checks can complete; obtain a supported Braces fix; separately
approve/review the Vitest major migration; rerun checks and audit after changes.
The isolated persistence blocker is resolved by the user's passing execution.
Live Tide/JWT/Fabric, Docker and interactive demo shutdown checks remain open.

### Complete reconciled dependency paths

#### P1: @fastify/busboy (2 paths)

Locked and installed chains agree for all paths below.

```text
backend > firebase-admin@13.10.0 > @fastify/busboy@3.2.0
backend > firebase-functions@6.6.0 > firebase-admin@13.10.0 > @fastify/busboy@3.2.0
```

#### P2: braces (1 paths)

Locked and installed chains agree for all paths below.

```text
frontend > eslint-config-next@16.2.12 > @next/eslint-plugin-next@16.2.12 > fast-glob@3.3.1 > micromatch@4.0.8 > braces@3.0.3
```

#### P3: source-map-js (20 paths)

Locked and installed chains agree for all paths below.

```text
. > next@16.3.6 > postcss@8.5.28 > source-map-js@1.2.1
backend > @vitest/coverage-v8@3.2.7 > magicast@0.3.5 > source-map-js@1.2.1
backend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > @vitest/mocker@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
backend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
backend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > vite-node@3.2.4 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
backend > vitest@3.2.7 > @vitest/mocker@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
backend > vitest@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
backend > vitest@3.2.7 > vite-node@3.2.4 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > @tidecloak/nextjs@0.14.20 > next@16.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > next@16.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > @tailwindcss/postcss@4.3.3 > @tailwindcss/node@4.3.3 > source-map-js@1.2.1
frontend > @tailwindcss/postcss@4.3.3 > postcss@8.5.25 > source-map-js@1.2.1
frontend > @vitejs/plugin-react@4.7.0 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > @vitest/coverage-v8@3.2.7 > magicast@0.3.5 > source-map-js@1.2.1
frontend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > @vitest/mocker@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > vite-node@3.2.4 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > vitest@3.2.7 > @vitest/mocker@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > vitest@3.2.7 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
frontend > vitest@3.2.7 > vite-node@3.2.4 > vite@7.3.6 > postcss@8.5.28 > source-map-js@1.2.1
```

#### P4: proxy-addr (4 paths)

Locked and installed chains agree for all paths below.

```text
backend > express@5.2.1 > proxy-addr@2.0.7
backend > express-rate-limit@8.6.1 > express@5.2.1 > proxy-addr@2.0.7
backend > firebase-functions@6.6.0 > express@4.22.2 > proxy-addr@2.0.7
backend > @types/express-rate-limit@6.0.2 > express-rate-limit@8.6.1 > express@5.2.1 > proxy-addr@2.0.7
```

#### P5: tinypool (4 paths)

Locked and installed chains agree for all paths below.

```text
backend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > tinypool@1.1.1
backend > vitest@3.2.7 > tinypool@1.1.1
frontend > @vitest/coverage-v8@3.2.7 > vitest@3.2.7 > tinypool@1.1.1
frontend > vitest@3.2.7 > tinypool@1.1.1
```

#### P6: sharp (3 paths)

Locked and installed chains agree for all paths below.

```text
. > next@16.3.6 > sharp@0.35.4
frontend > @tidecloak/nextjs@0.14.20 > next@16.3.6 > sharp@0.35.4
frontend > next@16.3.6 > sharp@0.35.4
```

## Historical agent verification attempts — earlier 8 October 2026

This section records the earlier restricted agent run. The current audit and
user-verified persistence results appear above and supersede its blockers.
Work remains on feature/soc-emergency-access-poc at HEAD 27b09cb. Tide evidence
access stays blocked pending tested guidance. No Tide research or call was made.

### Phase 1: dependency security — blocked, no updates applied

The reported **3 Critical, 5 High and 10 Moderate findings remain unresolved**.
The referenced audit attachment is absent from the accessible chat attachments;
the available original pasted request contains no advisory output. Both a fresh
pnpm audit --json and a reviewed pnpm audit --audit-level=high --json failed with
fetch failed. Neither returned advisory IDs, paths or a current count. Exact
mapping and patch targets for all 18 findings cannot be established from counts.
Counts do not prove that a vulnerability is exploitable in this application.

The current lockfile paths below were independently traversed again. The linked
maintainer advisories' Affected/Patched versions sections establish these fixes.
These are examples checked against this lockfile, **not a mapping of the missing
18 findings**. Peer suffixes are omitted for readability; versions are exact.

| Current locked path                                                                                        | Official advisory and compatible patched release                                                                                                                    | Action on this checkout                                   |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Root development and frontend runtime: next@16.3.6                                                         | [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j): affected >=16.2.0, <16.3.6; patched 16.3.6                        | Retain the existing pin                                   |
| Backend: firebase-admin@13.10.0 → @google-cloud/firestore@7.11.6 → google-gax@4.6.1 → @grpc/grpc-js@1.14.5 | [GHSA-m9gg-hp2v-232j](https://github.com/grpc/grpc-node/security/advisories/GHSA-m9gg-hp2v-232j): affected >=1.14.0, <1.14.5 on this release line; patched 1.14.5   | Retain the existing parent-child override                 |
| Backend: firebase-functions@6.6.0 → protobufjs@7.6.5                                                       | [GHSA-j3f2-48v5-ccww](https://github.com/protobufjs/protobuf.js/security/advisories/GHSA-j3f2-48v5-ccww): affected >=7.5.0, <=7.6.4 on 7.x; patched 7.6.5           | Retain current resolution; an 8.x override is unnecessary |
| Backend: firebase-admin@13.10.0 → @google-cloud/storage@7.21.0 → fast-xml-parser@5.10.1                    | [GHSA-8r6m-32jq-jx6q](https://github.com/NaturalIntelligence/fast-xml-parser/security/advisories/GHSA-8r6m-32jq-jx6q): Patched versions and Workarounds name 5.10.1 | Retain current resolution                                 |

Smallest remaining patch plan: obtain audit JSON for this lockfile, match its
exact advisory IDs and all importing paths, then choose the lowest official fixed
release accepted by the existing parent range, engines and peers. Prefer normal
targeted resolution within the existing major. Use a narrow parent-child override
only where compatibility is established; preserve separate brace-expansion
consumer majors. Review the focused manifest/lockfile diff and rerun every required
check after a justified update. Do not apply forced audit fixes or suppress findings.
A required major upgrade or new production dependency needs user approval; a Tide
SDK change is outside this task.

No dependencies, manifests, security overrides or lockfile were changed. Locked
@tidecloak/nextjs, @tidecloak/react and @tidecloak/js versions remain 0.14.20.
The earlier locked-path inventory below remains valid. No further change is
supported by these four advisories; other targets remain unknown pending the
missing report or a successful registry audit.

### Phase 2: emulator persistence — probe expanded, execution blocked

Only the isolated test scripts changed. The demo runner, existing demo data,
authentication, production storage/service code and role equality were preserved.
Each run creates an exclusive timestamp/UUID demo-soc-tests-* directory under
ignored .emulator-tests/. It checks Firestore 8086, hub 4406 and logging 4506
before both phases, refuses occupied ports and never stops their owners. The probe
validates project, loopback host, demo flags, phase and exact marker path before
importing the Admin SDK. It never imports demo-data/.

The expanded real-Firestore probe is designed to verify:

- Four concurrent submissions produce one pending request; duplicates return 409.
- Concurrent approvals from one person produce one approval. Three other people
  can produce only two distinct approvals, reaching authorising with authority
  blocked and evidence locked. The requester cannot approve/reject themselves,
  including a self-approval concurrent with another person's valid approval.
- All four recognised SOC roles can request and review another person's request.
- Rejection reasons persist in requests, decisions and audit. Cancellation retains
  the old request while a replacement stays in history. A cancellation/approval
  race leaves a consistent terminal record, decisions and audit.
- A second emulator process imports the graceful export and compares all six
  collections, all four users' request/review history and audit with the saved
  snapshot. Pending requests, approvals, reasons, cancellations, operation ledgers
  and blocked authority jobs must match exactly.
- After restart, concurrent duplicate requests/approvals and self-approvals remain
  rejected. Original operation-ID replay adds no decisions or audit events.

**Persistence has not passed here.** Both actual pnpm run test:emulator attempts
built the backend, passed port preflight and reached the seed CLI launch, then
pnpm dlx failed with EPERM resolving C:\Users\Xnami. Firestore never started;
neither seed assertions nor export/import ran. Java 23.0.2 is available. The
reviewed retry reproduced the same failure. An earlier review attempt timed out
before launching the retry.

Executed safety checks passed: the probe rejects the existing demo project before
Admin SDK imports; an occupied hub port makes the runner exit before Firebase
startup and leaves the port owner running. These prove only isolation guards.

The probe uses synthetic verified-identity fixtures and the real FirestoreStore.
A successful execution would be a database/service integration result, distinct
from mocked MemoryStore unit tests. It does not verify browser/HTTP authentication,
live Tide approvals or Fabric expiry. Graceful export/import does not prove crash
durability, Docker restart behaviour or production composite-index readiness.

### Actual verification in this agent session

| Command/check                                   | Actual result                                                                                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pnpm run typecheck                              | PASS: frontend and backend                                                                                                                             |
| pnpm run lint                                   | BLOCKED before source linting: both packages fail reading installed brace-expansion@1.1.21/index.js with EPERM; reviewed retry is identical            |
| pnpm run test:all                               | Backend PASS: 8 files, 114 tests. Frontend overall FAIL: 4 files, 37 tests pass; 7 suites fail resolving next/link or next/navigation before tests run |
| pnpm run build                                  | BLOCKED before frontend compilation: EPERM reading next@16.3.6/dist/bin/next; chained backend build is skipped                                         |
| pnpm --filter backend build                     | PASS separately, and again during each emulator attempt                                                                                                |
| pnpm audit --audit-level=high --json            | FAILED: fetch failed; no current findings or clean-audit result                                                                                        |
| pnpm run test:emulator                          | BLOCKED before Firestore starts: pnpm dlx realpath EPERM; no persistence result                                                                        |
| node --check on both test scripts               | PASS                                                                                                                                                   |
| Isolation guard subprocess/occupied-port checks | PASS, without Firestore                                                                                                                                |
| Targeted Prettier check                         | PASS: both scripts and both updated reports                                                                                                            |
| git diff --check and four-file source review    | PASS: no whitespace/conflict errors or credential-shaped artifacts in the four changed files                                                           |

The user separately reported passing frontend typecheck/lint, all 92 frontend
unit tests, and both production builds in their normal terminal before this
follow-up. This is retained as user-reported evidence, not a passing rerun from
this agent session. Frontend test/build reviewed retry requests timed out before
execution. No rule, package configuration or permission was weakened to hide a
failure. Targeted formatting and final source/diff safety results are included above.

### Files changed in this follow-up (4) and remaining work

- scripts/test-emulator.cjs: exclusive project/data directory, occupied-port
  refusal before each phase, child-listener cleanup and precise result wording.
- scripts/emulator-probe.cjs: validation before SDK import, expanded lifecycle/
  concurrency assertions and exact restart/replay comparison.
- docs/SOC-POC-HANDOFF.md: current audit evidence, patch plan and actual results.
- docs/SOC-POC-RUNBOOK.md: normal-terminal commands, test scope and pass criteria.

A SHA-256 comparison of 76 safe baseline files confirms that only these four
files changed during this follow-up. Production code, guardrails, manifests,
lockfile and Tide SDK versions are unchanged. Git status retains the prior
33 modified tracked files and 38 untracked files (including the untouched user
configuration); the index is empty. Failed test starts left only ignored isolated
test directories and backend build output, with no new temporary source files.

Remaining blockers: missing audit IDs/paths and registry fetch failure; installed
local-tool access failures; unexecuted Firestore seed/restart assertions;
unverified native/Docker retention; genuine Tide authority/expiry remains blocked.
Use the exact normal-terminal commands in the runbook. Supply the resulting audit
JSON before selecting updates for the 18 unresolved findings. Stop for review.
No credentials or user configuration were inspected; no account/realm/policy,
Docker volume, Git index, commit, push, merge or deployment change was made.

## Historical frontend verification follow-up — 7 October 2026

This follow-up fixes the three reported frontend issues on the existing branch.
It preserves the previous implementation and user configuration. No dependency,
authentication, evidence-unlocking or guardrail changes were made. No Tide MCP
call was made.

### Files changed by this follow-up (6)

- `frontend/src/features/access-requests/components/AccessRequestView.tsx`:
  defer `handleSubmit(submit)` to the submit event. The callback reads/writes
  the in-flight, mounted and operation-ID refs; passing it to a helper during
  render propagates ref usage into render-time analysis. Event-time invocation
  retains validation, duplicate-write protection and mounted checks, with no
  rule suppression. [React refs guidance](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs).
- `frontend/src/features/access-requests/hooks/useAccessData.ts`: replace the
  shared generation ref with a cancellation flag local to each effect setup.
  Cleanup cancels exactly that setup; both late success and late failure are
  ignored. The context/session/revision key still hides old data immediately.
  Strict Mode replay, refresh, changed paths/users, logout and unmount retain
  their protection. [React effect cleanup guidance](https://react.dev/reference/react/useEffect).
- `frontend/tests/unit/app/dashboard.test.tsx`: select the incident table,
  then the row for INC-1001, then its exact High severity cell. The severity,
  threat, status and incident-link assertions remain meaningful.
- `frontend/tests/unit/features/access-requests/AccessRequestView.test.tsx`:
  dispatch repeated submit events during a pending write and retain the
  one-write assertion.
- `frontend/tests/unit/features/access-requests/useAccessData.test.tsx`:
  add regressions for discarded Strict Mode setup, stale refresh failure and
  pending response after unmount. Reset mock implementations between tests.
- `docs/SOC-POC-HANDOFF.md`: record this follow-up and the dependency plan.

### Verification after these fixes

| Command/check                      | Result                                                                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter frontend typecheck` | PASS: TypeScript emits no errors                                                                                                   |
| `pnpm --filter frontend lint`      | BLOCKED before source linting: EPERM reading installed brace-expansion@1.1.21/index.js                                             |
| `pnpm --filter frontend test`      | FAILED overall: 4 files/37 tests pass; 7 suites fail during next/link or next/navigation import resolution, before their tests run |
| Focused useAccessData unit suite   | PASS: all 8 tests, including the three new cancellation regressions                                                                |
| `pnpm --filter frontend build`     | BLOCKED before production compilation: EPERM reading installed next@16.3.6/dist/bin/next                                           |
| Targeted Prettier check            | PASS: all five frontend files and this report                                                                                      |
| `git diff --check`                 | PASS: final tracked diff; changed/new text files also checked                                                                      |
| `pnpm audit --json`                | FAILED: registry fetch failed; no current advisory result obtained                                                                 |
| `pnpm why --recursive ...`         | BLOCKED: EPERM creating the user pnpm store; locked paths were read directly from pnpm-lock.yaml instead                           |

The seven non-executing suites are dashboard, incident-detail, signin,
LockedField, Navbar, RoleGuard and AccessRequestView. Consequently, the revised
dashboard assertion and repeated-submit regression are **not verified by a
passing component run**, and neither reported lint fix is confirmed by ESLint.
Typecheck and passing hook tests do not establish a passing lint or production
build. Narrow reviewed retries returned the same tooling failures. No package,
test configuration, permission or rule was changed to hide these blockers.

A SHA-256 comparison of 76 safe baseline files confirms that only the six
files listed above changed during this follow-up. Prior implementation files,
manifests, lockfile, pnpm security overrides and the checked root/frontend
instructions are otherwise unchanged. The unrelated user-owned Codex settings
file was not opened or modified. The six files have no conflict markers, trailing
whitespace, embedded private keys, service-account key fields or signed JWTs
in the scoped source check; no temporary source file was added.

The older validation table below is historical evidence from the initial PoC
work. Backend checks were not rerun for this frontend-only follow-up.

### Dependency patch plan — provisional, no changes made

The user reports 3 Critical, 5 High and 10 Moderate findings. The audit attachment
is not available among this chat's accessible files, and the fresh audit request
failed. These counts are therefore user-reported, not independently verified.
Advisory IDs, affected paths, audit date and lockfile correspondence are needed
to produce an exact plan for all 18 findings. Counts do not prove exploitation
in this application.

The current manifests, security overrides and lockfile were inspected. The
following are actual shortest locked paths; the table is an inventory, **not a
claim that each package is vulnerable**. Runtime/development labels describe
the importing dependency group, not proof of live reachability.

| Importer/group                     | Locked dependency path                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Frontend runtime; root development | next@16.3.6 (direct in both importers); react/react-dom@19.2.4                                         |
| Frontend runtime                   | next@16.3.6 → sharp@0.35.4                                                                             |
| Frontend runtime                   | next@16.3.6 → postcss@8.5.28 → nanoid@3.3.18                                                           |
| Frontend runtime                   | @tidecloak/nextjs@0.14.20 → @tidecloak/react@0.14.20 → @tidecloak/js@0.14.20                           |
| Frontend development               | eslint-config-next@16.2.12 (direct)                                                                    |
| Frontend/backend development       | eslint@9.39.5 → minimatch@3.1.5 → brace-expansion@1.1.21                                               |
| Frontend/backend development       | eslint@9.39.5 → @eslint/eslintrc@3.3.6 → js-yaml@4.3.2                                                 |
| Frontend development               | @vitest/coverage-v8@3.2.7 → test-exclude@7.0.2 → minimatch@10.2.6 → brace-expansion@5.0.12             |
| Frontend/backend development       | @vitest/coverage-v8@3.2.7 → test-exclude@7.0.2 → glob@10.5.0 → minimatch@9.0.9 → brace-expansion@2.1.7 |
| Frontend development               | @tailwindcss/postcss@4.3.3 → postcss@8.5.25 → nanoid@3.3.18                                            |
| Frontend/backend development       | vitest@3.2.7 → vite@7.3.6 → postcss@8.5.28; jsdom@26.1.0                                               |
| Backend runtime                    | firebase-admin@13.10.0 → @google-cloud/firestore@7.11.6 → google-gax@4.6.1 → @grpc/grpc-js@1.14.5      |
| Backend runtime                    | firebase-admin@13.10.0 → @google-cloud/storage@7.21.0 → fast-xml-parser@5.10.1                         |
| Backend runtime                    | firebase-functions@6.6.0 → protobufjs@7.6.5                                                            |

Three independently checked official Next Critical advisories illustrate why
the audit must be reconciled against the current lockfile. They are **not
assumed to be the three Critical findings in the unavailable report**.

| Official advisory                                                                                        | Affected Next 16 range | First patched Next 16 release | Smallest action for the locked 16.3.6                |
| -------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------- | ---------------------------------------------------- |
| [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j), Node next/og ImageResponse RCE | >=16.2.0, <16.3.6      | 16.3.6                        | Retain current pin; it is outside the affected range |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), AVIF image optimization RCE    | >=16.0.0, <16.3.3      | 16.3.3                        | Retain current pin and existing sharp override       |
| [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36), Windows server RCE             | >=16.0.0, <16.3.3      | 16.3.3                        | Retain current pin                                   |

The ImageResponse advisory requires attacker-controlled SVG inputs on Node;
the AVIF issue concerns image optimization; the Windows advisory concerns
Windows-hosted router applications without Cache Component. A scoped search
found no next/og, ImageResponse or next/image imports in frontend/src. This is
limited source evidence, not an exploitability assessment or proof about all
framework routes, builds or deployments. The patched version comparison is the
basis for retaining the current Next pin.

Proposed patch order once the audit details are available:

1. Match each advisory and full path to this lockfile, then read its official
   affected/fixed ranges and release compatibility requirements. Record whether
   the path is shipped at runtime, used in development, or optional, and check
   the actual entry point/configuration before making any exposure claim.
2. For the three Next advisories above, propose **no additional version change**
   on this checkout. Do not downgrade 16.3.6 to 16.3.3. No eslint-config-next
   bump is justified by these Next runtime advisories alone.
3. For a confirmed affected direct dependency, select the lowest official
   patched release compatible with its existing supported major, peers and
   Node runtime. Coordinate the root/frontend Next pins only if another matched
   advisory requires it. Keep the Tide SDK/authentication integration unchanged.
4. For a confirmed affected transitive dependency, prefer a targeted lockfile
   update within the existing parent range. If that cannot resolve the fix,
   compare the smallest compatible parent release with a narrow parent-child
   override. Keep brace-expansion's separate 1.x/2.x/5.x consumers and the existing
   google-gax > @grpc/grpc-js scope. Do not force one major across all paths.
   [Official pnpm override documentation](https://pnpm.io/settings/dependency-resolution#overrides)
   supports parent-child selectors at the workspace root.
5. Preserve the existing postcss, sharp, js-yaml, nanoid, brace-expansion and
   grpc security overrides until matched advisories justify a specific change.
   Do not use an automatic audit fix or ignore entries as a substitute for review.
   Exact targets for the report's High/Moderate and any unmatched Critical
   findings remain blocked by the missing advisory data.
6. A later authorised dependency patch must validate peers/engines, frozen
   installation, frontend/backend checks, production builds and a new audit.
   Review the focused manifest/lockfile diff before applying it. No dependencies
   or lockfile were changed in this task.

## Historical initial milestone results — 7 October 2026

| Milestone                          | Implemented                                                                                                       | Verified                                                                                                                  | Blocked / remaining                                                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Inspection and Tide feasibility | Baseline, source/SDK review and capability table                                                                  | Installed 0.14.20 helper signatures/runtime; focused official documentation                                               | Exact SOC contract, endorsements, completion validation and Fabric expiry are unresolved                                                    |
| 2. Local runtime/storage           | Repository listener; explicit demo Admin SDK; native import/export scripts                                        | Typecheck/build; configuration safety and HTTP unit tests                                                                 | Actual emulator startup, transactions and graceful restart persistence                                                                      |
| 3. Request/approval backend        | Transactional creation, history, review, rejection, cancellation, stable identity/idempotency and bounded queries | 36 workflow/HTTP tests, plus retained backend tests                                                                       | Real Firestore integration; authority completion depends on milestone 4                                                                     |
| 4. Genuine Tide evidence/expiry    | Fail-closed evidence boundary; trusted optional 60-second demo configuration                                      | Unit tests deny wrong scope, tampered active flags and server-time expiry                                                 | Real encryption/ciphertext storage, scoped authority, activation, decrypt flow and cached-ciphertext expiry are not implemented or verified |
| 5. Agreed frontend                 | Submission, request details/history, review, audit, incident state, navigation and real-count filters/cards       | Typecheck; 18 new API/state tests                                                                                         | Seven component suites cannot resolve Next imports; production/browser checks; evidence panel/countdown await real Tide                     |
| 6. Audit                           | Atomic request/decision/cancel/failure/denial events; reserved expiry reconciliation; append-only API             | Unit tests cover idempotency, consistency, expiry and mutation denial                                                     | Real authority-activation/successful-access events cannot exist yet                                                                         |
| 7. Docker/group handoff            | Three Dockerfiles, safe build context, demo Compose and runbook                                                   | Source/JSON/YAML formatting checks; official image/tool listings                                                          | Docker build, readiness, browser access and graceful restart unverified                                                                     |
| 8. Validation/handoff              | Unit tests, isolated emulator probe, docs and manual checklist                                                    | Both typechecks; backend build; 114 backend tests; 37 frontend tests that loaded; formatting, placeholder and diff checks | Full frontend suite, lint, frontend build, advisory audit, actual emulator/Docker and live four-account Fabric tests                        |

## Scoped diff

Backend adds a Firestore transaction store, stable issuer/subject references,
strict request/decision validation, atomic scope uniqueness, operation ledgers,
retained safe audit, membership-gated routes and an explicit native demo listener.
Authentication and incident allow-lists remain in place; /api/me remains
authentication-only. Unknown/provider errors do not expose raw payloads.

Frontend connects the existing form to real backend submission and adds request,
approval and audit views, incident status, mobile navigation, actual incident
counts/search/filters, no-store metadata fetches, safe errors/timeouts and stale
response guards. It retains the existing layout and Profile/Settings behaviour.
Evidence display/decryption/countdown remains unavailable.

Runtime adds dedicated ignored emulator data, isolated integration/persistence
probes, pinned CLI/base images, Docker source-only build stages and demo Compose.
Documentation describes current APIs/schema/security, exact manual prerequisites
and all unverified behaviour. Only .env.example and the sync source changed;
real configuration and sync outputs were not opened or modified.

## Initial PoC validation (historical; follow-up results above)

| Command/check                                                                                                              | Result                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `pnpm run typecheck`                                                                                                       | PASS: backend and frontend, after final behaviour changes                                                     |
| `pnpm run test`                                                                                                            | PASS: 8 files, 114 tests, including 36 new workflow/HTTP tests                                                |
| `pnpm --filter frontend test tests/unit/features/access-requests/useAccessData.test.tsx tests/unit/lib/access-api.test.ts` | PASS: 2 files, 15 tests                                                                                       |
| `pnpm run test:component`                                                                                                  | FAILED overall: 4 files/34 tests pass; 7 suites fail before tests due unresolved next/link or next/navigation |
| `pnpm --filter backend build`                                                                                              | PASS: actual backend production TypeScript compilation                                                        |
| `pnpm run build`                                                                                                           | BLOCKED before frontend compilation: EPERM reading installed next/dist/bin/next                               |
| `pnpm run lint`                                                                                                            | BLOCKED before source linting in both packages: EPERM reading installed brace-expansion/index.js              |
| Targeted Prettier write/check                                                                                              | PASS for all changed TS/TSX/JS/CJS/JSON/YAML files; run root CLI from root and frontend package respectively  |
| `pnpm run validate`                                                                                                        | PASS: no unreplaced placeholders                                                                              |
| `git diff --check`                                                                                                         | PASS; also checked new text files for conflict markers/trailing whitespace                                    |
| Changed-file secret/artifact review                                                                                        | No embedded private keys, service-account material or signed tokens detected; no temporary source artifacts   |
| `pnpm audit --audit-level=high`                                                                                            | BLOCKED: registry advisory request/fetch fails with EACCES; no advisory result obtained                       |
| `pnpm dlx firebase-tools@14.16.0 --version`                                                                                | BLOCKED: EPERM resolving the user profile path; no emulator CLI startup                                       |
| `pnpm run test:emulator`                                                                                                   | Backend build passes, then CLI startup fails; actual Firestore transactions/export/import NOT verified        |
| `pnpm run demo:backend`                                                                                                    | Attempted, fails closed before readiness because emulator/private configuration is unavailable                |
| `docker version`                                                                                                           | BLOCKED: Docker config/daemon named-pipe access denied                                                        |
| Container builds/readiness/restart                                                                                         | NOT RUN to completion; Docker prerequisite access is blocked                                                  |
| Playwright/browser/Fabric tests                                                                                            | NOT RUN: frontend/runtime and real authority prerequisites are unavailable                                    |

The first unit runner failed during esbuild config bundling. Both Vitest packages
now use the supported configLoader runner with ESM-safe aliases and envDir false;
unit tests do not load private configuration. No suite was excluded to conceal a
failure. Frontend form/component tests were updated but their seven suites did
not execute. The unresolved Next imports remain a validation failure; build/lint
permission errors do not establish that source lint/production checks would pass.

Normal reviewed retries for blocked tooling returned the same EPERM/EACCES
errors. No permission setting, ACL, guardrail or authentication check was weakened.
No environment-free snapshot or mocked build was used as runtime proof. Unit
MemoryStore/verified-user fixtures are explicitly tests only; production has no
memory fallback. Expiry tests with manually altered records prove denial at the
application boundary, not real Tide revocation or authorised active access.

## Native startup and shutdown — source instructions, execution unverified

After the user's private configuration/manual realm setup described in the runbook,
run from the root in three PowerShell terminals:

```powershell
pnpm install --frozen-lockfile
pnpm run env:sync
pnpm --filter backend build
pnpm run demo:emulator
# Second terminal
pnpm run demo:backend
# Third terminal
pnpm run demo:frontend
```

Check `Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5001/api/health`, then
open http://localhost:3000/auth/signin and sign in manually. Port 8080 remains
reserved for the existing TideCloak. Demo Firestore uses 8085; tests use 8086.

Stop frontend/backend with Ctrl+C, then Ctrl+C once for the emulator and wait for
the export to finish. Restart the same commands to import demo-data/firestore.
Do not force-stop Java or delete exports. Windows console signals are allowed to
reach inherited children; the wrapper avoids Node's forceful Windows kill method.
Interactive native graceful retention is unverified; the owner's isolated probe
passed separately. Crashes can lose changes since the last successful export.

## Docker startup and shutdown

After manual public configuration and the read-only data/tidecloak.json adapter
mount are available:

```powershell
docker compose -f docker-compose.soc-demo.yml config --quiet
docker compose -f docker-compose.soc-demo.yml build
docker compose -f docker-compose.soc-demo.yml up -d
docker compose -f docker-compose.soc-demo.yml ps
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5001/api/health
# Graceful stop, retaining data
docker compose -f docker-compose.soc-demo.yml stop -t 60
# Restart
docker compose -f docker-compose.soc-demo.yml up -d
```

Do not print resolved Compose configuration, use down -v, delete data, recreate
Tide realms or change its image/digest. Browser public URLs are baked into the
frontend image; Firestore uses the internal service address. Existing issuer/JWKS
verification is preserved. Containers are **unverified** in this session.

## Current manual setup and integration gaps

- Four distinct authorised Tide-linked test accounts with recognised SOC membership.
  Each account may request and review other users; the requester never self-approves.
- User-owned public client/origin/redirect configuration, server-only private
  adapter and normal local runtime configuration. No agent login/admin-token grant.
- Exact official Forseti/E2EE setup and integration evidence remain unresolved.
  The specifically authorised setup-forseti-e2ee, custom-contracts and
  version-policy lookups were reported completed. They did not establish the
  required tested SOC flow. No call was repeated or account/realm/role/policy
  change performed in this task.
- Reviewed SOC-specific contract requiring two distinct other endorsers, immutable
  requester/incident/resource/read/duration binding, verified completion, compatible
  enclave/SDK and signed expiry against old ciphertext. Administrative QEA alone
  does not prove this workflow. Any required SDK/image change needs separate approval.
- Restore local dependency/CLI/network/Docker access and rerun blocked checks.
- Manually sign in for real requester plus two-other-user verification after genuine
  authority exists. Do not mark direct SDK expiry as passed from UI/API denial.

Exact tags/policy bytes and synthetic encrypted-data setup cannot be supplied
safely until the supported contract/SDK integration is verified. The runbook
documents the intended transient browser encryption flow and why no fake seed
endpoint is present. No real evidence should be used.

## Group test checklist and limits

This checklist preserves earlier intended acceptance coverage. Independent live
items remain unchecked; use the current PEER/TIDE cases for execution records.
The old 9/10 October schedule is obsolete; no current deadline is assigned.

- [ ] Four accounts log in; non-members are denied workflow APIs.
- [ ] Pending request survives reload; simultaneous submissions leave one open scope.
- [ ] Self/duplicate approval is denied; one approval leaves evidence locked.
- [ ] Two other approvals are recorded; Tide unavailable stays authorising/locked.
- [ ] Rejection/cancellation never grant access; history is retained and terminal
      scope permits a new request.
- [ ] After genuine Tide integration, only requester/selected field is available;
      other resources, incidents and users remain denied.
- [ ] Authority retries do not mint another grant or restart server time.
- [ ] Reload/context/visibility/reconnection recheck authority; stale decrypt
      responses cannot restore cleared evidence after logout/expiry/error.
- [ ] Server and direct SDK deny old authority/ciphertext at now >= expiresAt.
- [ ] Ciphertext at rest remains unreadable; a database status edit cannot grant
      Tide authority. Current tampered active records always remain locked.
- [ ] Native and Docker graceful restart retain request, decisions and audit.
- [ ] Keyboard/mobile/loading/empty/error/retry states are checked in a real browser;
      no plaintext/tokens are cached, logged, stored or put in URLs.

Current approval counts are business metadata only. There is no authority
activation, genuine evidence storage, decrypt UI, countdown or successful-access
audit yet. Authorising requests remain open while authority is unavailable;
do not invent an active window or reset/delete those records to work around it.
Normal database audit is application append-only, not cryptographically tamper-proof.
Expiry cannot erase information already copied or photographed.

## Exact task manifest and proposed commit groups (73 files)

Paths are repository-relative and are a proposal for later owner review only.
M = modified tracked file; A = new untracked task file. No group was staged or
committed. The groups are logical and share runtime/source dependencies; verify
the complete approved candidate rather than assuming each group runs alone.

Exclude .claude/settings.local.json and all ignored private/runtime/generated
files. The dependency proposal is retained as documentation and is unapplied;
review it as a proposal, not an installed security fix. pnpm-lock.yaml is unchanged
and is not a task change. Do not use git add . or git add -A.

### Proposed group 1 — Backend request, review and audit workflow with unit boundaries (14 files)

```text
M backend/package.json
A backend/src/access/service.ts
A backend/src/access/store.ts
A backend/src/access/types.ts
M backend/src/app.ts
A backend/src/lib/demoConfig.ts
M backend/src/lib/errors.ts
M backend/src/lib/firebase.ts
M backend/src/middleware/errorHandler.ts
A backend/src/routes/access.ts
A backend/src/server.ts
A backend/tests/support/MemoryStore.ts
A backend/tests/unit/access.test.ts
M backend/vitest.config.ts
```

### Proposed group 2 — Frontend workflow screens, navigation and unit coverage (27 files)

```text
M frontend/next.config.ts
M frontend/package.json
A frontend/src/app/(dashboard)/approvals/page.tsx
A frontend/src/app/(dashboard)/audit/page.tsx
M frontend/src/app/(dashboard)/dashboard/page.tsx
M frontend/src/app/(dashboard)/incidents/[id]/page.tsx
A frontend/src/app/(dashboard)/requests/[id]/page.tsx
A frontend/src/app/(dashboard)/requests/page.tsx
M frontend/src/components/incidents/IncidentTable.tsx
M frontend/src/components/layout/DashboardShell.tsx
A frontend/src/components/layout/MobileNavigation.tsx
M frontend/src/components/layout/Sidebar.tsx
A frontend/src/components/layout/navigation.ts
M frontend/src/features/access-requests/components/AccessRequestView.tsx
A frontend/src/features/access-requests/components/RequestHistory.tsx
A frontend/src/features/access-requests/format.ts
A frontend/src/features/access-requests/hooks/useAccessData.ts
M frontend/src/features/access-requests/validation.ts
A frontend/src/lib/api/access.ts
M frontend/src/lib/api/incidents.ts
A frontend/src/types/access.ts
M frontend/tests/unit/app/dashboard.test.tsx
M frontend/tests/unit/app/incident-detail.test.tsx
M frontend/tests/unit/features/access-requests/AccessRequestView.test.tsx
A frontend/tests/unit/features/access-requests/useAccessData.test.tsx
A frontend/tests/unit/lib/access-api.test.ts
M frontend/vitest.config.ts
```

### Proposed group 3 — Native and Docker demo, emulator isolation and public templates (17 files)

```text
A .dockerignore
M .env.example
M .gitignore
A backend/Dockerfile
A docker-compose.soc-demo.yml
A docker/emulator-entrypoint.sh
A docker/firebase.container.json
A docker/firestore.Dockerfile
A firebase.demo.json
A firebase.test.json
M firebase/firestore.indexes.json
A frontend/Dockerfile
M package.json
A scripts/demo.cjs
A scripts/emulator-probe.cjs
M scripts/sync-env.js
A scripts/test-emulator.cjs
```

### Proposed group 4 — Documentation, peer test package and unapplied dependency proposal (15 files)

```text
M docs/ARCHITECTURE.md
M docs/BACKEND.md
M docs/ENV-VARS.md
M docs/FIRESTORE-SCHEMA.md
M docs/FRONTEND.md
M docs/SECURITY.md
A docs/SOC-DEPENDENCY-PATCH-PLAN.patch
A docs/SOC-PEER-TEST-PLAN.md
A docs/SOC-PEER-TEST-RESULTS-TEMPLATE.md
A docs/SOC-POC-BUILD-STATUS.md
A docs/SOC-POC-HANDOFF.md
A docs/SOC-POC-RUNBOOK.md
A docs/SOC-TIDE-CAPABILITIES.md
M docs/TESTING.md
M docs/tide-mcp-learning.txt
```

## Git and source safety

Working branch remains feature/soc-emergency-access-poc at baseline 27b09cb.
The worktree contains only the listed task edits plus the preserved user-owned
untracked .claude/settings.local.json. The index is empty. Nothing was staged,
committed, pushed, merged, deployed, reset, rebased or force-operated. No volumes,
realm data or existing demo data were deleted. Root/directory guardrails and
user Codex configuration are unchanged. Production dependencies and pnpm-lock.yaml
are unchanged. Ignored backend build output and the isolated probe directory are
local runtime artifacts, excluded from Git and Docker builds.
