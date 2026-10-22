# SOC PoC implementation handoff

## Week 9 local Docker handoff — 22 October 2026

Owner local Docker verification passed: build/start exit 0, Healthy services,
frontend/health 200, unsigned API 401, private login/application workflow,
completed graceful export/shutdown, internal unauthenticated Firestore 403 and
retained synthetic request/both decisions/history/audit after restart. Evidence
remains locked; application approvals do not establish Tide authority.

Current HEAD: `44ea6254a95e72b761929809a95e894146700244`; local runtime fix and deployment
record are committed in 4143ad8/44ea625. Owner evidence originally tested the
8d55ac3-based working tree with those fixes; no independent exact-HEAD rerun or
remote publication/image identity is claimed. Current reconciliation is docs-only
and uncommitted. Local app http://localhost:3000; API http://localhost:5001;
existing Tide entry http://localhost:8080. No public URL. Agent Docker remains
denied. See [deployment record](SOC-WEEK9-DEPLOYMENT.md) for exact commands,
export/backup/restart evidence and historical errors; do not repeat passed checks.

Remaining: record release/image identity and publication only if approved, retain
a durable export backup, independent local peer retest and PM/Planner final
acceptance. PM accepted local Docker as a delivery approach, not full PoC security.
Five parked Cloud Run files remain excluded/untracked. Braces, uuid, F8/DPoP and
genuine encryption/authority/expiry remain unresolved; evidence stays locked.

## Approved qs update — 17 October 2026; local verification complete

Owner fresh audit: **0 Critical, 1 High, 1 Moderate**. Neither qs advisory appears;
Braces GHSA-vfj7-8cjw-p6xm and uuid GHSA-w5hq-g745-h8pq remain. This is owner-run
evidence, separate from agent checks, historical audit counts and hosted CI.

Agent review confirms workspace/lockfile agreement and actual installed Express
4.22.3, body-parser 1.20.8 and qs 6.16.0 on all five affected edges. Only approved
package/edge changes appear; Firebase Functions, Tide and unrelated versions and
supply-chain protections are preserved. Ten focused synthetic dependency parsing
assertions passed, and git diff --check passed. No install or audit was repeated.

The earlier installation blocker is superseded. Agent backend typecheck, lint,
build and frozen-lockfile install all passed with exit 0; frozen install reported
Already up to date using pnpm 11.20.0. Units and coverage each exited 1 before
execution because sandbox EPERM denied a temporary-cache rename: zero tests ran.
No retry or configuration bypass. Owner subsequently reports, on 17 October for
the same dependency state: backend units 135 passed/nine files; coverage 135
passed/report generated, **79.24% line coverage**. These owner results are
separate from agent sandbox failures; raw owner exit codes were not supplied.
**Local qs verification is COMPLETE**, together with the agent passes and owner
audit. No tests or audit repeated. Exact state hash, paths and results are in the
existing triage qs section. A future hosted result remains separate; Braces,
uuid and F8 remain unresolved, DPoP deferred and evidence locked.

## Blocker handoff — 16 October 2026

**Expected:** the authorised tide_dpop_asset({}) read-only lookup supplies a
versioned verification relay, provenance/hash and integration requirements for
review against SDK 0.14.20. **Observed:** isError: true, with exactly:

```text
tide_dpop_auth.html not found in any pack template. Expected e.g. templates/nextjs-customer-portal/public/tide_dpop_auth.html.
```

No artifact or hash was returned. Delivery root cause and the original peer F8
cause are unconfirmed. No lookup was repeated or relay/authority invented.
Two requests are prepared for Tide, **not sent**:

1. **Supported DPoP integration:** versioned relay bytes, source commit,
   verifiable SHA-256 and declared SDK 0.14.20/server-image compatibility;
   exact route/CSP/framing/message-origin requirements; supported token profile,
   proof-aware requests, refresh/logout/silent-SSO and backend nonce semantics.
   Identify any required version changes. The file/13-route/validator/replay
   change map and remaining gates are in [the triage](SOC-WEEK8-TRIAGE.md).
2. **SOC authority and expiry:** one versioned worked example answering the six
   contracts and unsent question in [the capability assessment](SOC-TIDE-CAPABILITIES.md):
   intent/ciphertext/policy binding, identity eligibility, distinct non-requester
   endorsements, verified completion, trusted expiry and compatible versions.

**Independent work:** public dependency metadata/parent review and separately
approved compatible fixes; documentation and publication review of completed
Week 8 work. The new qs proposal is maintained only in the triage. Keep the
existing workflow and evidence locked. No extra browser/emulator or service run
is needed for this handoff; ordinary dependency findings are not Tide defects.

Historical npm preflight on 17 October (superseded by the completed 1.20.8 migration above) confirms Express 4.22.3 and qs 6.16.0 metadata,
but finds no matching body-parser 1.20.7. The full qs proposal is blocked; see
the triage owner-preflight section. Do not apply the seven overrides as written.

**Acceptance after Tide responds:** review provenance, independently hash bytes
and confirm exact compatible contracts before separately approving runtime,
dependency or configuration work. DPoP requires relay origin/source/route/CSP
negative tests, real-validator signature/binding/hash/method/URL/freshness tests,
shared replay/nonce race and idempotent retry checks, all 13 protected routes,
Bearer downgrade rejection and login/callback/refresh/logout/silent-SSO checks.
Authority requires supported endorsement/receipt fixtures rejecting self,
duplicate/unknown signers, changed intent/ciphertext/policy/scope and replay;
verify requester-only read access and Fabric denial of new decryption at the
15/30/60-minute deadline even with cached ciphertext, old authority or direct SDK.
Then run only the minimum owner-private login and TIDE-01/02/03 sequence already
in the runbook. Keep mocks, owner browser observations and live Fabric results
separate. One owner's login cannot resolve peer F8. No request was sent or test
repeated for this handoff.

## Controlled continuation — 16 October 2026

Historical controlled-review evidence below predates the single authorised relay lookup; the DPoP paragraph records that subsequent result. Learning-log preservation claims describe that earlier pass; ISSUE 010 now also records the lookup failure.

Reviewed HEAD **19399aeb77b81af1a6fd9bf9dee235778ebbb871** on the requested feature
branch. Only docs/tide-mcp-learning.txt was dirty at entry; its uncommitted update
is preserved byte-for-byte. Since hosted f8a05a2 only the three status documents
changed; runtime tests were not repeated. No new remote/hosted result is claimed.

The application dashboard/request/review/history/audit and locked-evidence flow
remain intact. Quorum and time checks are application controls; no verified Tide
completion receipt, cryptographic intent endorsements or Fabric expiry exists.
Do not add a mock provider or unlock from database approval counts/deadlines.

**Current completion checklist:** runbook section 10 now classifies implemented
and verified, implemented but unverified, missing-external-guidance blocks and
reasoned deferrals. Historical passing unit/owner/isolated-emulator/hosted results
remain separate from live Tide evidence. Approved Vitest migration stays complete;
overall PoC acceptance, Braces and F8 stay unresolved.

Useful work completed in this pass: repaired the runbook's unterminated SHA
validation and added a fail-closed exact-SHA comparison; corrected stale baseline,
Node/pnpm/Next and already-applied dependency-patch instructions. The SHA snippet
is parsed, not executed. No new UI or runtime behavior is introduced.

Protected phase proposals, with dependent work stopped:

1. **Authority:** SOC-TIDE-CAPABILITIES.md consolidates six missing versioned
   contracts: intent/ciphertext/policy binding; identity/eligibility; exact
   endorsement APIs; completion/activation verification; trusted Fabric expiry;
   tested compatible versions/failures. Obtain one worked SOC fixture answering
   them, not another generic overview. Existing completed Tide lookups are reused.
2. **DPoP:** the new controlled-phase triage section maps browser/config/relay,
   all 13 protected routes, server token/proof binding and shared replay/nonce
   controls. Runtime migration is NOT approved. The subsequently authorised
   single read-only tide_dpop_asset({}) call returned isError: true: the HTML
   was not found in any pack template. No artifact, provenance, hash, wiring or
   0.14.20 compatibility was supplied; no implementation gate closed. No retry
   or further Tide call is authorised. Root cause of delivery failure and F8
   remain unknown. See the triage's single-lookup section for the unchanged
   file/dependency/security/test gates. Obtain versioned bytes and independent
   hash/provenance through an approved channel before proposing integration.
3. **Dependencies:** Braces has no verified fix. qs 6.16.0 fits Express 5,
   body-parser 2 and Superagent but NOT Express 4.22.2/body-parser 1.20.6
   ~6.15.1. uuid 11.1.1 is outside all three uuid 9 parent ranges. No global
   incompatible overrides or guessed parent upgrades. Registry metadata failed
   in sandbox and one bounded outside-sandbox retry; exact publication/integrity
   remains unverified. The triage separates an optional three-edge partial qs
   candidate from full remediation, which needs supported parent versions.

Minimum next verification is conditional on actual approved changes: contract
negative fixtures then owner-private TIDE-01/02/03; DPoP real-validator/all-route
and multi-instance replay tests then minimal owner sign-in; affected dependency
checks and fresh audit after approved changes. No new manual check is requested
for this documentation work. See runbook section 10 for the exact scope.

Checks passed: SHA-block static parsing (not execution), targeted document
formatting and git diff --check. Learning-log content is byte-identical to the
initial uncommitted update.

No dependencies, authentication, SDK, account/realm, configuration, service,
cryptographic authority or data changes; no Tide MCP, commit, push or deployment.
Evidence stays locked; the original F8 cause remains unconfirmed.

## Hosted CI confirms migration complete — f8a05a2, 16 October 2026

**Approved Vitest migration: COMPLETE.** Owner-supplied hosted CI for f8a05a2
confirms Backend Tests, Frontend Tests, and Lint & Typecheck passed. Security
Scan reports **0 Critical, 1 High, 3 Moderate**; it is not claimed green. This
hosted evidence is separate from prior local owner results and agent sandbox
failures. No tests, builds, audit or CI job were repeated for this update.
Exact hosted Node patch, test counts and raw exit codes were not supplied.

Local HEAD is **f8a05a2f1e556c7cb54f91f46f39578f9595bf93**, matching the supplied
hosted SHA, on feature/soc-emergency-access-poc. The worktree was initially clean;
only the three existing status documents are edited here. Earlier pending-CI,
HEAD and commit-readiness statements below describe their dated phases. No
commit, push, branch movement or remote refresh was performed by this agent.

**Preserved advisory discrepancy:** earlier local audit suggested Braces
patched >=3.0.4, while this hosted CI reports patched_versions **<0.0.0**.
The owner registry lookup found no matching 3.0.4 and the previously checked
official advisory lists no patched version. Neither audit value proves a
supported fix; <0.0.0 is not an installable remediation. Cause of the discrepancy
is unconfirmed. Braces 3.0.3 / **GHSA-vfj7-8cjw-p6xm** remains the unresolved
High through Next ESLint > fast-glob > micromatch. Retain the audit threshold;
no suppression or clean-audit claim. Local and hosted counts match, but that
does not prove all advisory metadata or Moderate identities match.

Earlier local owner audit identified the three Moderates as uuid
**GHSA-w5hq-g745-h8pq**, and qs **GHSA-x5fp-wj9c-mxmx** /
**GHSA-4mjr-xmp4-gh2g**. Keep their separate proposed remediation review deferred;
no further dependency change is made. Older audit counts and sandbox fetch
failures retain their original attribution.

Completed scoped Week 8 fixes: **F1** safe launcher invocation with JavaScript
Windows probe; **F3** safe stage-specific diagnostics and focused tests;
**emulator safeguards** with owner isolated JDK-workaround export/reload pass;
**F10** accessible fixed sign-in feedback, explicit retry and callback/init guards;
and the approved **Vitest/coverage-v8 4.1.11 / Vite 7.3.6 migration**, now verified
by prior local checks and hosted tests/lint/typecheck. SDK authentication
validation and locked evidence are preserved.

Remaining limits: native pnpm.exe was not tested because none was found on PATH;
other live startup-diagnostic branches and accessibility/real SDK failure paths
are not all verified. The blocked-token failure-to-alert test remains
inconclusive. The JDK workaround does not establish the Java shim's internal
failure mechanism; successful recovery alone never proved export completion.
Later owner Export complete evidence remains separate from earlier failures.

**F8 peer fresh-client DPoP login remains unresolved; end-to-end DPoP migration
is deferred; evidence remains locked.** Genuine Tide/Fabric authority/unlocking
and full PoC acceptance remain outside this completion claim. Scoped approved
migration/testing-fix completion does not mean all dependencies/findings are
resolved. The triage's **Hosted CI completion — f8a05a2, 16 October 2026** section
contains the detailed evidence and completed/deferred summary.

Only documentation formatting and git diff --check were checked after editing.
No new Tide-specific learning entry, private-file access, dependency/code/
configuration/account change, check disabling, services, Tide MCP, staging,
commit or push.

## Owner completion and commit readiness — 16 October 2026

**Local Vitest migration checks complete; the remaining documentation update is
ready for commit review. Security Scan remains non-clean.** This supersedes the
pending owner commands and local execution blockers below while preserving their
historical attribution. No passed application check was repeated in this update.

New owner-reported evidence, separate from all agent/sandbox results:

- Backend units: **135 passed / nine files**, Vitest **4.1.11**.
- Backend coverage: **135 passed; report generated**. No fresh numeric coverage
  percentages or shell exit codes were supplied, so none are invented.
- Frontend production build: **passed**, Next.js **16.3.8**.
- Fresh audit: **0 Critical, 1 High, 3 Moderate**.

Prior agent frontend units/coverage (145 passed), both typechecks, lint, backend
build, formatting and frozen installation remain valid separate evidence. Keep
the earlier backend loopback EACCES, frontend protected-file/Turbopack failure
and audit fetch failures recorded as agent-environment results, not owner failures
or fresh passes. No root cause for those sandbox failures is claimed from the
owner successes. Exact hosted Node patch/hosted CI execution remain unverified;
local completion does not imply hosted verification or permission to publish.

Current HEAD is **ba50ff09e9af3c5225b4ed20b5df4be2e99745a2**, not c6abb57.
Fresh Git inspection confirms lineage c6abb57 -> **357a387** (migration) ->
**ba50ff0** (documentation). Both commits were already present at the previous
verification's start; this agent did not create them or move HEAD. The earlier
report should have highlighted that transition. The branch is two commits ahead
of the locally recorded remote-tracking ref; no remote refresh was performed.

Final migration diff review against c6abb57 found only the intended direct tool
upgrades and reviewed config/override changes across six implementation paths.
The lockfile has no Tinypool, adds 18/removes 47 related toolchain records, and
has no unexpected direct production upgrade. No application authentication or
SDK change, test suppression or weakened coverage/security setting was found.
The migration is already in 357a387; do not recommit its implementation.

Current unstaged/uncommitted paths are exactly:

```text
docs/SOC-POC-BUILD-STATUS.md
docs/SOC-POC-HANDOFF.md
docs/SOC-WEEK8-TRIAGE.md
```

Nothing is staged; private/generated files are excluded. A future documentation
commit may use `docs: record owner verification and remaining dependency advisories`.
No staging, commit or push occurs here. Existing verification-document edits are
preserved and supplemented with the new owner results.

Separate remaining remediation, not part of the completed Vitest migration:

- **Braces 3.0.3 — High GHSA-vfj7-8cjw-p6xm:** Next ESLint > fast-glob >
  micromatch chain. Still no authoritative supported patched release; keep
  unresolved and retain the high-severity audit gate.
- **uuid 9.0.1 — Moderate GHSA-w5hq-g745-h8pq:** Firebase/Google client chains.
  Review supported parent upgrades toward the advisory's patched 11.1.1 line;
  no incompatible override into uuid 9 parents.
- **qs 6.15.3 — Moderate GHSA-x5fp-wj9c-mxmx and GHSA-4mjr-xmp4-gh2g:**
  Express/body-parser and Supertest/Superagent chains. Separately prepare a
  **6.16.0** patch proposal after publication/all-parent compatibility checks.

The triage records official advisory links and current dependency families.
These are separate future-review candidates, not dependency changes or promises
of a clean audit. No rerun of passed tests, coverage, builds or audit is needed
for this documentation-only update. New-section formatting and git diff --check
were checked after editing. Overall security remediation/full PoC acceptance
remain incomplete; F8 unresolved, DPoP deferred, evidence locked. No new Tide-
specific finding warranted a learning-log edit. No private configuration, accounts,
services, dependency changes, Tide MCP, commits or pushes.

## Migration verification after owner installation — 16 October 2026

**Installed and lockfile-consistent; remaining checks blocked, not fully verified.**
This supersedes the failed-install summary below, which remains historical.
Owner normal Command Prompt: pnpm install, Already up to date, pnpm 11.20.0,
exit 0. That owner report is separate from the following fresh agent checks.

The agent resolved both packages' installed Vitest and coverage-v8 to 4.1.11,
and each Vitest's Vite to 7.3.6. All manifest specifiers match lockfile importers.
Agent frozen-lockfile installation passed, exit 0. Compared with c6abb57, only
the four approved direct test-tool pins change; no direct production versions
change. Lockfile adds 18/removes 47 toolchain records and removes Tinypool.
Retained React-plugin 4.7.0 version/integrity is unchanged; its recorded Vite
peer is narrowed to the reviewed 7.3.6 by the override. No unexpected runtime
upgrade was identified. The dependency tree is no longer described as unusable.

Current existing local HEAD is ba50ff09e9af3c5225b4ed20b5df4be2e99745a2, with
migration 357a387 and documentation ba50ff0 already present at follow-up start;
working tree initially clean, branch two commits ahead of tracked remote. This
agent created no commit or push. Older HEAD and uncommitted-state statements
below describe their dated attempts.

Fresh agent evidence on Node 24.19.0 / pnpm 11.20.0:

- Frontend units: **145 passed / 15 files**, exit 0 after one retry for sandbox
  cache-rename EPERM. Frontend V8 coverage: the same 145 tests passed; statements
  72.91%, branches 64.44%, functions 65.35%, lines 73.42%.
- Backend units and backend coverage: each **82 passed / 53 failed / 135 total**,
  exit 1; failures report loopback connect EACCES. Initial sandbox units had also
  stopped before execution on cache renames. No tests were skipped or altered.
- Both typechecks, source lint, backend production build and frozen installation:
  **passed**. Targeted implementation formatting passed from frontend context;
  the first root-context formatter invocation had a plugin-resolution error.
- Frontend build: **blocked**, exit 1; denied opening the protected local
  environment file plus Turbopack worker-connection failure. No private file,
  panic log or report link was read, and no permission/configuration bypass used.
- Fresh audit: **unavailable**, fetch failed, exit 1 in sandbox and one approved
  outside-sandbox retry. No new counts/advisory IDs are claimed.

Tinypool is absent from the current lockfile, but no green Security Scan or
aggregate clean-audit result is claimed. Braces GHSA-vfj7-8cjw-p6xm remains at
3.0.3 through Next ESLint > fast-glob > micromatch with no verified supported fix.
Last owner-hosted 2 Critical / 1 High / 7 Moderate totals remain separately dated
historical evidence, not a new audit. Moderate IDs/paths await successful audit.
CI still selects Node 22 / pnpm 10 and audit-level high; Node 22 requires >=22.12.
Exact hosted Node patch and hosted verification of this migration remain pending.

Remaining normal-terminal commands only:

```powershell
pnpm --filter backend test
pnpm --filter backend test:coverage
pnpm --filter frontend build
pnpm audit --json
pnpm audit --audit-level=high
```

Full migration verification is **not complete** until remaining checks and audit
reconciliation finish. Do not repeat already-passed checks for this documentation
update. The triage's **Owner installation and agent migration verification —
16 October 2026** section holds detailed attribution, lockfile review and results.
Only the three status documents change in this follow-up; targeted documentation
formatting and git diff --check were checked after editing. No Tide-specific
learning entry was warranted. F8 unresolved, DPoP deferred, evidence locked;
no service operations, authentication/dependency/configuration/account changes,
Tide MCP calls, commits or pushes.

## Approved Vitest migration — blocked installation, 16 October 2026

This is the current migration status; older readiness, baseline-SHA, build and
approval statements below retain their dated historical attribution. Current
branch is feature/soc-emergency-access-poc at c6abb57. Existing triage edits are
preserved. The owner approved exact Vitest/coverage-v8 4.1.11 in both packages,
compatible Vite 7.3.6, the reviewed config migrations and normal regeneration.

The five manifest/config/workspace files are edited as approved. Both configs
retain envDir: false, backend isolation stays enabled, and frontend source
coverage is explicit. Only the two development pins changed in each manifest.
No application/test/authentication/SDK file or supply-chain approval was changed.

**Installation did not complete.** The initial install hit a sandbox store-symlink
EPERM. One outside-sandbox attempt required a TTY. The terminal-enabled retry
accepted pnpm's normal reinstall prompt and began recreating dependency
directories, then produced no further result for roughly ten minutes; the agent
interrupted only that installer. Cause of the stall is not established. Old
dependency links were removed, so the installed tree must not be assumed usable.
No additional install retry, manual lockfile edit or policy bypass was made.

**pnpm-lock.yaml is unchanged** and still resolves Vitest/coverage 3.2.7 and
Tinypool 1.1.1. The working manifests request 4.1.11: this is an inconsistent,
uncommitted intermediate state, **not ready to stage or commit**. Run normal
`pnpm install` in a working normal Windows terminal before frozen verification;
review the complete lockfile diff before accepting unrelated upgrades.

No new unit/coverage, typecheck, lint, production-build or frozen-install pass is
claimed. Those checks are blocked by installation. A targeted formatter attempt
was blocked by pnpm's automatic install preflight; formatting is not verified.
Static manifest checks and unit-file inventory (15 frontend / nine backend)
passed. `git diff --check` passed after editing. Prior hosted and owner passes
are separate historical evidence, not verification of this migration.

Fresh standard `pnpm audit --json` failed with fetch failed and returned no
advisory data. The last owner-hosted result remains 2 Critical, 1 High, 7 Moderate.
Both Tinypool Critical IDs and the Braces High remain reachable in the unchanged
lockfile. No fresh Moderate IDs were obtained; none are invented or suppressed.
Braces GHSA-vfj7-8cjw-p6xm still has no verified supported fix.

Local Node 24.19.0 / pnpm 11.20.0 were rechecked. CI selects Node 22 / pnpm 10;
Node must be >=22.12.0 within the 22 line. GitHub lookup failed in the sandbox and
on one approved retry, so no actual hosted Node patch was obtained. No new CI
was triggered and no unpublished edit is claimed CI-verified.

The triage's **Approved Vitest migration attempt — 16 October 2026** records the
full timeline, outstanding commands, advisory paths and commit gate. The task
is **not complete within the approved migration scope** until normal install,
lockfile review, both suites/coverage, typecheck/lint, both builds, frozen install
and audit reconciliation succeed. Security Scan may still fail for unresolved
Braces and other findings; no clean-audit promise is made.

No Tide-specific learning entry was warranted. F8 remains unresolved, DPoP
migration deferred, evidence locked. No private configuration/adapters, accounts,
data, services, Tide MCP, commits, pushes, merges or deployment were touched.

## Current Week 8 review candidate — 16 October 2026

**Scoped fixes ready for final commit review; recorded execution gate passed.**
Branch: `feature/soc-emergency-access-poc`; HEAD:
`bc2f22bae66b6283c0acef0841cecfea28157a3c`. Fixes are uncommitted and unstaged;
this HEAD does not identify their contents. The current triage's **Week 8
publication review — 16 October 2026** is the authoritative evidence summary.

The earlier compatible dependency patch was already applied and installed by
the owner. Preserve it; do not reapply it. The older 8 October dependency/audit
sections below describe their own attempts and remain historical. Their totals,
failures and owner successes are not fresh checks of this worktree.

Reviewed fixes: F1 shell-free JavaScript/native pnpm invocation; F3 fixed safe
startup-stage diagnostics; bounded emulator shutdown/free-port/export-metadata
gates; F10 fixed accessible feedback plus the approved initialization boolean
and callback-state guard. No publication-blocking code defect was established
by this source review. No runtime code changed in this preparation.

Owner evidence, distinct from mocks and earlier 8 October results:

- 15 October normal Windows backend suite: **135 tests / nine files passed**,
  including all 21 startup tests. Agent loopback EACCES failures remain separate.
- Actual Windows JavaScript pnpm version probe passed. Native pnpm.exe remains
  **Not tested: no native executable found on PATH**; no installation/PATH change
  is needed. Its mocked selection tests do not establish real native startup.
- 15 October isolated emulator run using existing actual JDK 23.0.2.0 temporarily
  first on terminal PATH: seed/export/reload, both gates and final PASS; exit 0;
  original PATH restored in finally. Two prior failed runs stay historical.
  This is a verified workaround, not proof of the shim's internal mechanism.
- Live emulator-unavailable diagnostic: **SOC_STARTUP_EMULATOR**, exit 1, no ready
  message. Demo services started; health 200 and unsigned incidents 401.
- Owner login/pages and displayed request/approval/cancellation/audit retention
  after restart passed; backup existed. Recovery alone does not prove export.
  The earlier repeated Ctrl+C session had no completion confirmation. A later
  16 October shutdown separately showed **Export complete**, then shutdown.
- F10 preview and keyboard retry passed. Latest corrected flow on 16 October:
  fresh Edge InPrivate, no blocking rules, dashboard without failure alert,
  incident pages working, evidence locked. Real blocked-token failure-to-alert
  remains **inconclusive**. Peer fresh-client DPoP remains **unresolved**.

Automated evidence: latest 39 mocked launcher/runner tests passed; F3 focused
21 startup cases and backend typecheck/lint/build passed; F10 original full
frontend suite 120/13 files passed before the final correction; final correction
49 affected tests/four files passed with four unchanged SDK cases skipped,
plus frontend typecheck/lint/format. Later F8's five installed-function tests
use synthetic collaborators, not live Tide; typecheck/targeted lint/format passed.
No already-passed unchanged tests were rerun for this documentation review.

**Owner production-build verification — 16 October 2026:**
`pnpm --filter frontend build` **passed, exit 0, using Next.js 16.3.8**.
Source: the owner's normal-terminal report in this conversation, not an agent
rerun or inspection of private configuration/build output. This closes the
post-F10 frontend production-build gate for the reported current candidate.
It does not prove all dependency vulnerabilities are fixed or verify peer F8.
Agent documentation checks remain separately attributed. No passed test/build
needs repeating for these documentation-only updates.

**Remaining publication procedure:** review the exact file/hunk groups below;
staging and commits require later owner approval. Associate the eventual
published SHA with the recorded evidence. No service/login repetition, audit,
installation or dependency implementation is part of this preparation.

This is a scoped review publication, not full fresh-client, Windows-native,
live diagnostic matrix, screen-reader/contrast or Tide/Fabric acceptance.
Evidence stays locked. F8 migration is explicitly **deferred, not approved**;
its proposal and unresolved gates are retained in the triage. No Tide security
setting, SDK, account, realm or authentication change is authorized.

### Exact future commit groups — proposal only, nothing staged

These groups partition all 32 current changed paths, with two explicitly shared
files: this handoff and SOC-POC-BUILD-STATUS.md. Old dependency hunks and new
owner/build/Week 8 summaries must be
separated if commit preparation is later approved. Do not stage whole directories
or stage a whole shared file. No commands below imply staging authorization.

**A. Earlier dependency work — `fix(deps): apply compatible security patches`**

```text
docs/SOC-DEPENDENCY-PATCH-PLAN.patch
docs/SOC-POC-BUILD-STATUS.md             [pre-existing dependency hunks only]
docs/SOC-POC-HANDOFF.md                  [pre-existing dependency hunks only]
frontend/package.json
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
```

These seven pre-existing paths are not Week 8 implementation files. This review
only adds new handoff hunks; existing dependency content is retained. Build
approval policy and supply-chain protections remain unchanged. Audit totals
retain their original source/date; no fresh audit is claimed.

**B. F1 and emulator safeguards — `fix(demo): support pnpm executables and gate emulator reload`**

```text
scripts/demo.cjs
scripts/test-emulator.cjs
scripts/pnpm-launcher.cjs
scripts/check-pnpm-launcher.cjs
scripts/tests/demo-launchers.test.cjs
```

**C. F3 — `fix(backend): report safe startup stage diagnostics`**

```text
backend/src/server.ts
backend/tests/unit/server.test.ts
```

**D. F10 — `fix(auth): show safe sign-in failures and guard callback recovery`**

```text
frontend/src/app/(auth)/auth/redirect/page.tsx
frontend/src/app/(auth)/auth/signin/page.tsx
frontend/src/components/auth/AuthRedirect.tsx
frontend/src/components/auth/SignInFailureAlert.tsx
frontend/src/components/auth/SignInPanel.tsx
frontend/src/lib/tidecloak/signin-feedback.ts
frontend/src/providers/AuthProvider.tsx
frontend/src/types/auth.ts
frontend/tests/unit/app/signin.test.tsx
frontend/tests/unit/components/AuthRedirect.test.tsx
frontend/tests/unit/components/SignInPanel.test.tsx
frontend/tests/unit/investigations/auth-feedback-boundaries.test.tsx
```

**E. Evidence and setup limits — `docs(soc): reconcile Week 8 fixes and verification limits`**

```text
.env.example                           [public comments only]
frontend/src/lib/tidecloak/config.ts    [comments only; no DPoP opt-in]
frontend/tests/unit/investigations/dpop-integration-contract.test.ts
docs/SOC-WEEK8-TRIAGE.md
docs/SOC-POC-RUNBOOK.md
docs/tide-mcp-learning.txt
docs/SOC-POC-BUILD-STATUS.md             [new owner-build summary only]
docs/SOC-POC-HANDOFF.md                  [new Week 8 summary/procedure only]
```

The installed-source contract test is an investigation test, not a DPoP migration.
The group preserves peer attribution, historical failures and the future design;
it does not approve or resolve F8. Do not add ignored exports, demo databases,
backup data, private adapters, environment files, build artifacts or SDK files.
The public `.env.example` is the sole environment-template path in these lists.

### Final PowerShell commit procedure — future owner execution only

No staging or commit was performed while preparing these commands. Run one group
at a time only after approval. Group 1 must be committed before group 5 stages
the shared documents' remaining changes. Do not apply the dependency patch again,
install packages, operate services, rerun passed suites or push from this procedure.

**Shared hunk selection for group 1:**

| File                           | Stage in group 1                                                                                                                                             | Leave for group 5                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/SOC-POC-HANDOFF.md`      | All pre-existing dependency edits in the dated 8 October body: dependency-security/audit/proposal changes and historical heading rename.                     | Entire inserted `Current Week 8 review candidate — 16 October 2026` section, through `Everything following this current summary is retained historical handoff content.`            |
| `docs/SOC-POC-BUILD-STATUS.md` | Original 8 October intro change, `Latest dependency-security attempt — 8 October 2026` addition and rename to `Earlier owner verification — 8 October 2026`. | Entire inserted `Owner production-build verification — 16 October 2026` section, through `Historical build-status content begins below; retain its original dates and attribution.` |

Git's default context can combine old and new changes. At `git add -p`, press
`s` to split a mixed hunk, then `n` for the new 16 October summaries and `y` for
the old dependency changes. Do not answer `y` to a mixed hunk or use `a` for all.
If a mixed hunk cannot be split, quit with `q` and stop for review rather than
stage the combined changes. Review the staged diff before each commit.

The helper validates each staged path list and requests explicit confirmation.
It does not verify semantic hunk selection: the group 1 diff review is required.
Existing hooks must remain enabled; stop on failure or unexpected file changes.
No reset, automatic cleanup, hook bypass or automatic push is included.

```powershell
Set-Location -LiteralPath 'C:\Users\Xnami\Tide MCP\soc-incident-report-protection'
if ((git branch --show-current) -ne 'feature/soc-emergency-access-poc') {
  throw 'Unexpected branch; stop'
}
if ((git rev-parse HEAD) -ne 'bc2f22bae66b6283c0acef0841cecfea28157a3c') {
  throw 'Baseline changed; review the procedure before staging'
}
if (@(git diff --cached --name-only).Count -ne 0) {
  throw 'Index is not empty; preserve it and stop'
}

function Confirm-SocCommit {
  param([string]$Message, [string[]]$ExpectedFiles)
  $socStaged = @(git diff --cached --name-only)
  if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect the index' }
  if (@(Compare-Object ($ExpectedFiles | Sort-Object -Unique) ($socStaged | Sort-Object -Unique)).Count -ne 0) {
    throw 'Unexpected staged paths; preserve work and stop'
  }
  git diff --cached --check
  if ($LASTEXITCODE -ne 0) { throw 'Staged whitespace check failed' }
  git diff --cached --stat
  git diff --cached
  if ((Read-Host 'Review this group, including shared hunks. Type COMMIT to proceed') -cne 'COMMIT') {
    throw 'Stopped for review; index left untouched'
  }
  git commit -m $Message
  if ($LASTEXITCODE -ne 0) { throw 'Commit/hook failed; inspect changes and stop' }
  if (@(git diff --cached --name-only).Count -ne 0) {
    throw 'Unexpected staged changes remain; stop'
  }
  git status --short
}

# 1. Earlier compatible dependency patches: five full files and two partial files.
$socDeps = @(
  'docs/SOC-DEPENDENCY-PATCH-PLAN.patch'
  'frontend/package.json'
  'package.json'
  'pnpm-lock.yaml'
  'pnpm-workspace.yaml'
)
$socShared = @('docs/SOC-POC-HANDOFF.md', 'docs/SOC-POC-BUILD-STATUS.md')
git add -- $socDeps
if ($LASTEXITCODE -ne 0) { throw 'Dependency staging failed' }
git add -p -- $socShared
if ($LASTEXITCODE -ne 0) { throw 'Partial staging failed' }
# Use s/n/y as described above. Neither new 16 October summary belongs here.
Confirm-SocCommit -Message 'fix(deps): apply compatible security patches' -ExpectedFiles ($socDeps + $socShared)

# 2. F1 launcher and emulator safeguards.
$socLaunchers = @(
  'scripts/demo.cjs'
  'scripts/test-emulator.cjs'
  'scripts/pnpm-launcher.cjs'
  'scripts/check-pnpm-launcher.cjs'
  'scripts/tests/demo-launchers.test.cjs'
)
git add -- $socLaunchers
if ($LASTEXITCODE -ne 0) { throw 'Launcher staging failed' }
Confirm-SocCommit -Message 'fix(demo): support pnpm executables and gate emulator reload' -ExpectedFiles $socLaunchers

# 3. F3 startup diagnostics.
$socStartup = @('backend/src/server.ts', 'backend/tests/unit/server.test.ts')
git add -- $socStartup
if ($LASTEXITCODE -ne 0) { throw 'Startup staging failed' }
Confirm-SocCommit -Message 'fix(backend): report safe startup stage diagnostics' -ExpectedFiles $socStartup

# 4. F10 authentication feedback and approved follow-up correction.
$socAuth = @(
  'frontend/src/app/(auth)/auth/redirect/page.tsx'
  'frontend/src/app/(auth)/auth/signin/page.tsx'
  'frontend/src/components/auth/AuthRedirect.tsx'
  'frontend/src/components/auth/SignInFailureAlert.tsx'
  'frontend/src/components/auth/SignInPanel.tsx'
  'frontend/src/lib/tidecloak/signin-feedback.ts'
  'frontend/src/providers/AuthProvider.tsx'
  'frontend/src/types/auth.ts'
  'frontend/tests/unit/app/signin.test.tsx'
  'frontend/tests/unit/components/AuthRedirect.test.tsx'
  'frontend/tests/unit/components/SignInPanel.test.tsx'
  'frontend/tests/unit/investigations/auth-feedback-boundaries.test.tsx'
)
git add -- $socAuth
if ($LASTEXITCODE -ne 0) { throw 'Auth staging failed' }
Confirm-SocCommit -Message 'fix(auth): show safe sign-in failures and guard callback recovery' -ExpectedFiles $socAuth

# 5. Documentation/setup limitations; shared documents now have only group 5 changes.
$socDocs = @(
  '.env.example'
  'frontend/src/lib/tidecloak/config.ts'
  'frontend/tests/unit/investigations/dpop-integration-contract.test.ts'
  'docs/SOC-WEEK8-TRIAGE.md'
  'docs/SOC-POC-RUNBOOK.md'
  'docs/tide-mcp-learning.txt'
  'docs/SOC-POC-BUILD-STATUS.md'
  'docs/SOC-POC-HANDOFF.md'
)
git add -- $socDocs
if ($LASTEXITCODE -ne 0) { throw 'Documentation staging failed' }
Confirm-SocCommit -Message 'docs(soc): reconcile Week 8 fixes and verification limits' -ExpectedFiles $socDocs

# Read-only final review; do not push or merge.
git log -5 --oneline
git status --short --untracked-files=all
git diff --cached --name-only
```

Coverage: 7/5/2/12/8 file memberships respectively, **32 unique files** because
handoff and build status appear in groups 1 and 5. Whole-file staging of either
shared document is appropriate in group 5 only after group 1 has committed the
correct dependency hunks. Any unexpected residual path stops publication review;
do not add it automatically.

These explicit lists exclude actual environment files, credentials, private
adapters, keys, SDK/node_modules, build output, exports, emulator databases,
backups and other generated files. `.env.example` contains public comments only;
its actual private counterpart is excluded. No clean-audit or full PoC/F8/Tide
acceptance is implied by the commit messages or owner production-build pass.

Earlier documentation-review checks passed: targeted new-section formatting,
`git diff --check`, exact group coverage of all 32 paths, preservation of the
other 29 files and byte-for-byte retention of pre-existing handoff content.
The document scan found no private-key blocks or access-key identifiers; it is
not a general security audit. That preparation changed triage, handoff and
existing learning-log entries. This owner-build update changes handoff, build
status and triage only. Same branch/HEAD, 19 tracked modifications and
13 untracked files; index empty. No tests or services rerun, dependencies changed,
or staging/commits/pushes performed.

Everything following this current summary is retained historical handoff content.

Date: 8 October 2026 (Australia/Sydney). Branch: feature/soc-emergency-access-poc.
Original candidate baseline: 27b09cbc52b6fb6ed69803b38c55e7f29c6699ee.

## Current dependency-security attempt — 8 October 2026

HEAD is bc2f22bae66b6283c0acef0841cecfea28157a3c on
feature/soc-emergency-access-poc and remains unchanged. **No dependency fix was
installed or resolved in this attempt.** Normal lockfile regeneration was blocked
by registry access during pnpm's supply-chain policy check. Only the expanded
unapplied proposal, this handoff and SOC-POC-BUILD-STATUS.md change.

### Separate audit results and evidence limits

| Source                                                                     | Command / options                                        | Actual recorded result                                                                                 |
| -------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Owner-reported GitHub CI                                                   | pnpm audit --audit-level=high                            | Exit 1; 33 findings: 3 Critical, 8 High, 20 Moderate, 2 Low                                            |
| Owner-provided local JSON, outside Git at $env:TEMP/soc-current-audit.json | pnpm audit --json, saved by Out-File with UTF-8 encoding | 24 findings: 3 Critical, 6 High, 14 Moderate, 1 Low; this file does not record the shell exit code     |
| Fresh final agent audit in this attempt                                    | pnpm audit --audit-level=high                            | Exit 1; EACCES calling the public advisory endpoint, then fetch failed; no JSON or new counts obtained |

The owner cannot confirm the order of the CI and local results. The lower local
count is not evidence of remediation. The earlier 18-finding total is historical.
The local JSON was read from the explicitly supplied temporary path and preserved
outside the repository; it is not part of the publication candidate.

The nine visible CI advisory blocks all match local JSON entries by package and
GHSA. Every local audit finding version matches this lockfile. Both direct Next
pins are 16.3.6; its locked root and frontend paths match the visible CI paths.
The local JSON additionally includes frontend > @tidecloak/nextjs > next, which
cannot be classified as local-only because the CI listing is incomplete. Installed Next manifest reads fail with EPERM, so its installed
version is explicitly unverified. Other installed versions below were read from
their public package manifests.

| Package         | Shared advisory                                                          | Local severity | Locked | Installed        | Local path count |
| --------------- | ------------------------------------------------------------------------ | -------------- | ------ | ---------------- | ---------------- |
| @fastify/busboy | [GHSA-xjh9-v7x6-24jw](https://github.com/advisories/GHSA-xjh9-v7x6-24jw) | high           | 3.2.0  | 3.2.0            | 2                |
| @fastify/busboy | [GHSA-x8mw-p69m-v3mx](https://github.com/advisories/GHSA-x8mw-p69m-v3mx) | high           | 3.2.0  | 3.2.0            | 2                |
| braces          | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | high           | 3.0.3  | 3.0.3            | 1                |
| source-map-js   | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | high           | 1.2.1  | 1.2.1            | 20               |
| proxy-addr      | [GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) | critical       | 2.0.7  | 2.0.7            | 4                |
| tinypool        | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) | critical       | 1.1.1  | 1.1.1            | 4                |
| tinypool        | [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) | critical       | 1.1.1  | 1.1.1            | 4                |
| sharp           | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | high           | 0.35.4 | 0.35.4           | 3                |
| next            | [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) | high           | 16.3.6 | unreadable EPERM | 3                |

P1–P6 in the retained complete path catalogue below still match the local JSON:
Busboy has both direct and firebase-functions > firebase-admin paths; Proxy-addr
has all four Express consumers; Tinypool has direct Vitest and coverage-provider
paths in both packages; Source-map-js has all 20 PostCSS, Magicast and Tailwind
paths. The current Next paths are:

```text
.>next
frontend>@tidecloak/nextjs>next
frontend>next
```

The following 15 local entries are not among the nine supplied CI blocks. They
cannot be called local-only findings because the CI listing is incomplete.

| Package         | Local advisory                                                           | Severity | Locked | Installed        |
| --------------- | ------------------------------------------------------------------------ | -------- | ------ | ---------------- |
| uuid            | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) | moderate | 9.0.1  | 9.0.1            |
| qs              | [GHSA-x5fp-wj9c-mxmx](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx) | moderate | 6.15.3 | 6.15.3           |
| qs              | [GHSA-4mjr-xmp4-gh2g](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g) | moderate | 6.15.3 | 6.15.3           |
| vitest          | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) | moderate | 3.2.7  | 3.2.7            |
| @vitest/mocker  | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) | moderate | 3.2.7  | 3.2.7            |
| ip-address      | [GHSA-rpw4-54j3-4h4q](https://github.com/advisories/GHSA-rpw4-54j3-4h4q) | moderate | 10.3.1 | 10.3.1           |
| ip-address      | [GHSA-2vr4-cq9g-pvrc](https://github.com/advisories/GHSA-2vr4-cq9g-pvrc) | moderate | 10.3.1 | 10.3.1           |
| ip-address      | [GHSA-j6r3-76f7-8jcv](https://github.com/advisories/GHSA-j6r3-76f7-8jcv) | moderate | 10.3.1 | 10.3.1           |
| ip-address      | [GHSA-h3mg-xc3c-68pw](https://github.com/advisories/GHSA-h3mg-xc3c-68pw) | moderate | 10.3.1 | 10.3.1           |
| @fastify/busboy | [GHSA-gxm5-99cw-xjw9](https://github.com/advisories/GHSA-gxm5-99cw-xjw9) | moderate | 3.2.0  | 3.2.0            |
| next            | [GHSA-3w37-wq28-93x7](https://github.com/advisories/GHSA-3w37-wq28-93x7) | moderate | 16.3.6 | unreadable EPERM |
| next            | [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) | moderate | 16.3.6 | unreadable EPERM |
| next            | [GHSA-39w2-rjm5-chcv](https://github.com/advisories/GHSA-39w2-rjm5-chcv) | low      | 16.3.6 | unreadable EPERM |
| next            | [GHSA-f87g-xv8r-7p7x](https://github.com/advisories/GHSA-f87g-xv8r-7p7x) | moderate | 16.3.6 | unreadable EPERM |
| next            | [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p) | moderate | 16.3.6 | unreadable EPERM |

**No finding is confirmed to occur only in CI or only locally.** The remaining
CI blocks, CI lockfile/commit identity and pnpm version, and its installation
options for development/optional dependencies were not supplied. The threshold
option and JSON output format are known; they do not establish why totals differ.
A complete CI JSON is needed to finish that comparison. Do not invent the missing
advisories, versions, chronology or cause.

### Verified compatible candidates — expanded proposal, still unapplied

The old proposal was reviewed rather than applied blindly. The replacement
docs/SOC-DEPENDENCY-PATCH-PLAN.patch retains its compatible security edits and adds
the two Next pins and the scoped ip-address fix. It remains a zero-context unified
patch, UTF-8 without BOM, with LF endings. No lockfile integrity values were
fabricated. The following versions are candidates, not installed fixes:

| Target          | Proposed change                                                            | Official evidence and compatibility                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next            | Root and frontend 16.3.6 → 16.3.8                                          | [Advisory](https://github.com/advisories/GHSA-cjq9-62q9-8jv4), [release](https://github.com/vercel/next.js/releases/tag/v16.3.8), [manifest](https://raw.githubusercontent.com/vercel/next.js/v16.3.8/packages/next/package.json). Same patch line; Node >=20.9.0, compatible React 19 peers and TideCloak's existing Next >=13.5.0 peer.                                                                                   |
| proxy-addr      | Existing Express 4 and 5 consumers → 2.0.8                                 | [Advisory](https://github.com/jshttp/proxy-addr/security/advisories/GHSA-jqcg-44mw-7w3h), [2.0.8 manifest](https://raw.githubusercontent.com/jshttp/proxy-addr/v2.0.8/package.json). Accepted by installed parent ~2.0.7 and ^2.0.7 ranges.                                                                                                                                                                                 |
| @fastify/busboy | firebase-admin@13 > @fastify/busboy → 3.2.2                                | [Boundary advisory](https://github.com/advisories/GHSA-xjh9-v7x6-24jw), [header advisory](https://github.com/advisories/GHSA-x8mw-p69m-v3mx), [3.2.2 manifest](https://raw.githubusercontent.com/fastify/busboy/v3.2.2/package.json). Satisfies ^3.0.0; also includes the separately recorded Moderate fix.                                                                                                                 |
| source-map-js   | Three existing PostCSS 8, Magicast 0.3.5 and Tailwind node 4 edges → 1.2.2 | [Advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), [manifest](https://raw.githubusercontent.com/7rulnik/source-map-js/v1.2.2/package.json). Satisfies all installed ^1.2.0/^1.2.1 parent ranges.                                                                                                                                                                                                                |
| Sharp           | Existing override → 0.35.5                                                 | [Advisory](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w), [manifest](https://raw.githubusercontent.com/lovell/sharp/v0.35.5/package.json). Same 0.35 release line; Node >=20.9.0.                                                                                                                                                                                                                |
| ip-address      | express-rate-limit@8 > ip-address → 10.7.1                                 | [Subnet advisory](https://github.com/advisories/GHSA-j6r3-76f7-8jcv), [input-length advisory](https://github.com/advisories/GHSA-h3mg-xc3c-68pw), [manifest](https://raw.githubusercontent.com/beaugunderson/ip-address/v10.7.1/package.json). Satisfies installed ^10.2.0; the exact two paths remain backend > express-rate-limit > ip-address and backend > @types/express-rate-limit > express-rate-limit > ip-address. |

Installed parent ranges were checked with SemVer before the provisional edits.
No new direct production dependency, Tide SDK update, unsupported major override,
advisory ignore or audit-threshold reduction was introduced. A successful updated
graph, installation, full checks and fresh audit are still required.

### Blocked execution and actual checks

The provisional root/frontend Next pins and workspace overrides were written,
then **pnpm install --lockfile-only --ignore-scripts --fetch-retries=0 returned
exit 1**: its supply-chain policy check could not fetch public registry metadata
for the existing 898 entries (ERR_PNPM_META_FETCH_FAIL). Scripts were suppressed
for this lockfile-only attempt; the package security policy was retained.
No lockfile rewrite or dependency installation completed. Only those provisional
edits were restored to their exact starting bytes, after verifying no concurrent
changes. The active manifests, workspace and lockfile match the starting state.

The new untracked .pnpm-store/v11/index.db created during this attempt was removed
without reading its contents; no existing user cache, configuration or demo data
was discarded. No further registry retry was made after the final audit failure.

| Check                                                                    | Actual exit / result                                                                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| pnpm run typecheck                                                       | 0; both packages pass                                                                                                            |
| pnpm run lint                                                            | 1; both ESLint processes fail before source linting with EPERM opening installed brace-expansion@1.1.21/index.js                 |
| pnpm run test:all                                                        | 1; backend 114 tests / 8 files pass; frontend 37 tests / 4 files pass, seven suites fail to resolve next/link or next/navigation |
| pnpm run build                                                           | 1; frontend Next executable read fails with EPERM before compilation; chained backend build is not reached                       |
| pnpm --filter backend run build                                          | 0; backend production compilation passes separately                                                                              |
| pnpm audit --audit-level=high                                            | 1; EACCES/fetch failed, no current counts                                                                                        |
| git apply --check --unidiff-zero -- docs/SOC-DEPENDENCY-PATCH-PLAN.patch | 0; applicability only, not an applied dependency fix                                                                             |
| git diff --check                                                         | 0; whitespace check, not runtime verification                                                                                    |

These checks ran against the unchanged installed dependencies. They do not verify
the proposed updated packages. Previous owner passes remain valid owner evidence
and are separate from this attempt's failures.

### Remaining findings and approval needed

**Resolved findings: none.** Both supplied audit results remain unresolved:
CI 33 (3 Critical, 8 High, 20 Moderate, 2 Low) and local JSON 24
(3 Critical, 6 High, 14 Moderate, 1 Low). A failed fresh audit does not establish
reduced counts or exploitability in this application.

Tinypool 1.1.1 remains on all four P5 paths. Vitest 3.2.7 declares ^1.1.1, which
excludes the published 2.1.1/2.1.2 fixes. Under the owner's major-upgrade restriction,
approval is needed to change **vitest and @vitest/coverage-v8 to 4.1.11 in both
frontend/package.json and backend/package.json**, migrate the existing backend
poolOptions.forks.singleFork configuration using the [official migration guide](https://vitest.dev/guide/migration/),
and normally regenerate the lockfile. Preserve envDir: false, mocked unit boundaries
and the existing backend fork/isolation intent. The [Vitest manifest](https://raw.githubusercontent.com/vitest-dev/vitest/v4.1.11/packages/vitest/package.json)
has no direct Tinypool dependency and supports Node 24; the
[coverage manifest](https://raw.githubusercontent.com/vitest-dev/vitest/v4.1.11/packages/coverage-v8/package.json)
is from the same release. The [Vitest/mocker advisory](https://github.com/advisories/GHSA-82fw-gwwq-j7x9)
also identifies 4.1.11 as the fix. Verify the complete graph and both unit/coverage
runs before claiming Tinypool removal or compatibility. This migration was not
applied, and no incompatible Tinypool override is proposed.

Braces 3.0.3 remains on frontend > eslint-config-next > @next/eslint-plugin-next >
fast-glob > micromatch > braces. The local audit's >=3.0.4 suggestion is not a
verified published fix: the [official advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
lists patched versions as None and the [maintainer manifest](https://raw.githubusercontent.com/micromatch/braces/master/package.json)
still names 3.0.3. Even the [Next ESLint plugin 16.3.8 manifest](https://raw.githubusercontent.com/vercel/next.js/v16.3.8/packages/eslint-plugin-next/package.json)
retains fast-glob 3.3.1. Supported routes are an upstream verified fixed release
accepted by the existing parents, or a documented parent migration that removes
this chain and preserves lint coverage. No such replacement is established here;
no guessed Braces version, package alias, dropped lint rule or local patch was used.

The current official [qs advisory](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx)
lists 6.16.0 as fixed, while this local JSON suggests >=6.15.4. Installed Express 4
and body-parser 1.x ranges stay on ~6.15.x, so no unsupported 6.16 override was
applied. uuid 9→11 also needs a supported parent migration; missing CI-only details
and all remaining Moderate/Low entries remain unresolved.

### Normal PowerShell completion path after owner review

Use the already-authorised compatible proposal in a normal terminal with registry
access. This does not authorise the separate major migration above. Do not bypass
supply-chain policy failures. Capture exits immediately and stop application
validation if dependency installation fails.

```powershell
git apply --check --unidiff-zero -- docs/SOC-DEPENDENCY-PATCH-PLAN.patch
if ($LASTEXITCODE -ne 0) { throw 'Proposal applicability failed' }
git apply --unidiff-zero -- docs/SOC-DEPENDENCY-PATCH-PLAN.patch
if ($LASTEXITCODE -ne 0) { throw 'Proposal application failed' }
pnpm install --lockfile-only --ignore-scripts --fetch-retries=0
if ($LASTEXITCODE -ne 0) { throw 'Lockfile generation failed; preserve security policy' }
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed' }
pnpm run typecheck
Write-Output "typecheck exit: $LASTEXITCODE"
pnpm run lint
Write-Output "lint exit: $LASTEXITCODE"
pnpm run test:all
Write-Output "unit tests exit: $LASTEXITCODE"
pnpm run build
Write-Output "production build exit: $LASTEXITCODE"
pnpm audit --audit-level=high --json --fetch-retries=0 |
  Out-File -FilePath (Join-Path $env:TEMP 'soc-after-security-audit.json') -Encoding utf8
Write-Output "audit exit: $LASTEXITCODE"
git diff --check
Write-Output "diff check exit: $LASTEXITCODE"
```

Keep audit output outside Git. No commits or pushes are authorised.
Authentication, equal SOC roles and locked evidence remain unchanged. Owner
Firestore persistence verification is preserved; independent laptop startup and
live Tide/JWT/Fabric checks remain unverified. Genuine Tide encryption, scoped
authority and expiry remain unfinished; two application approvals still do not
unlock evidence.

## Historical unapplied dependency proposal repair — earlier 8 October 2026

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
