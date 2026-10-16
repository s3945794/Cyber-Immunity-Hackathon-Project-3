# SOC PoC build status

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

## Owner production-build verification — 16 October 2026

**Owner-reported PASS:** `pnpm --filter frontend build`, exit **0**, using
**Next.js 16.3.8**, on 16 October 2026. This is the owner's normal-terminal
verification of the current candidate after the latest F10 correction, not an
agent rerun. Private configuration and build output were not inspected.

The previously missing production frontend build is now recorded. The scoped
Week 8 fixes are ready for final file/hunk and commit-procedure review; no
already-passed checks need repeating for these documentation-only updates.
No staging, commits or publication have occurred. HEAD remains
`bc2f22bae66b6283c0acef0841cecfea28157a3c`; it is the baseline, not the fixes SHA.

The compatible dependency patch was already applied and installed locally;
do not apply it again. A successful build does **not** establish that every
dependency vulnerability is fixed. Historical audit runs/counts below retain
their separate attribution; no fresh audit or clean-audit claim is made.
The earlier 8 October blocked attempts are historical, not current build status.

F8 peer fresh-client DPoP login remains unresolved; the end-to-end migration is
deferred, not approved. TideCloak security settings, PKCE/state/nonce, SDKs,
accounts and private configuration are unchanged. Genuine Tide/Fabric access
remains unverified and evidence remains locked. Overall PoC acceptance is still
incomplete. Handoff and triage contain the separate owner/browser/emulator/unit
results and remaining limitations.

Historical build-status content begins below; retain its original dates and attribution.

Updated: 8 October 2026 (Australia/Sydney). Overall PoC: **incomplete**.
Dependency remediation remains blocked as recorded below. R-01 incident recovery is corrected and all
14 incident-detail tests passed in the owner normal-terminal run, including its
six new regressions. Both typechecks/lint, all 114 backend and 98 frontend tests,
and both production builds passed. Security/publication review and independent
startup remain incomplete. The latest owner evidence and earlier agent results
are separately attributed below and in SOC-POC-HANDOFF.md.
Real Tide/Fabric evidence access remains blocked and locked.

## Latest dependency-security attempt — 8 October 2026

**Dependency remediation is blocked; no finding is confirmed resolved.** The normal
lockfile-only install failed its existing supply-chain policy check because public
registry metadata could not be fetched (exit 1). Provisional manifest/override
edits were restored exactly; the active manifests, workspace, lockfile and installed
dependencies are unchanged. No security checks were weakened.

| Evidence source                                                               | Recorded unresolved findings               |
| ----------------------------------------------------------------------------- | ------------------------------------------ |
| Owner-reported GitHub CI, pnpm audit --audit-level=high, exit 1               | 33: 3 Critical, 8 High, 20 Moderate, 2 Low |
| Owner-supplied local JSON, pnpm audit --json; shell exit not included in JSON | 24: 3 Critical, 6 High, 14 Moderate, 1 Low |
| Fresh final agent audit, pnpm audit --audit-level=high                        | Exit 1; EACCES/fetch failed; no new counts |

The order/cause of the count discrepancy is unconfirmed. The lower local count
does not prove fixes. Nine supplied CI advisory blocks match local entries and
their locked versions; the incomplete CI listing cannot establish findings unique
to either result. All 24 local finding versions match the lockfile. Installed Next
could not be read (EPERM), so its installed version is unverified. The previous
18-finding totals below are historical. The complete comparison is in
[SOC-POC-HANDOFF.md](SOC-POC-HANDOFF.md#current-dependency-security-attempt--8-october-2026).

| Executed check in this attempt            | Exit / actual result                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| pnpm run typecheck                        | 0; frontend and backend pass                                                                  |
| pnpm run lint                             | 1; both packages stop before source linting with EPERM reading installed brace-expansion      |
| pnpm run test:all                         | 1; backend 114/114 pass; frontend 37 pass, seven suites fail to resolve Next imports          |
| pnpm run build                            | 1; frontend Next executable read fails with EPERM before compilation; chained backend skipped |
| pnpm --filter backend run build           | 0; backend production compilation passes separately                                           |
| pnpm audit --audit-level=high             | 1; no advisory data retrieved                                                                 |
| Zero-context proposal applicability check | 0; proposal remains unapplied                                                                 |
| git diff --check                          | 0; whitespace only                                                                            |

These are checks of unchanged installed packages, not successful validation of
updated dependencies. Existing owner typecheck/lint, 114 backend and 98 frontend
tests, both builds and isolated Firestore persistence passes remain separate
owner evidence.

The expanded unapplied SOC-DEPENDENCY-PATCH-PLAN.patch includes Next 16.3.8 in both
existing manifests, Sharp 0.35.5 and scoped Busboy 3.2.2, source-map-js 1.2.2,
proxy-addr 2.0.8 and ip-address 10.7.1 overrides. It uses zero context, UTF-8 without
BOM and LF endings; validation requires --unidiff-zero. Official sources, parent
range checks and exact normal-PowerShell completion commands are in the handoff.

Approval is needed for coordinated Vitest/coverage-v8 4.1.11 major migration in
both packages and its backend pool-configuration migration. Tinypool is not forced
outside Vitest 3's ^1.1.1 range. Braces has no verified published fix; the affected
Next ESLint > fast-glob > micromatch chain remains. No unverified replacement or
lint-rule removal is proposed. Remaining CI blocks are needed for full comparison.

Only the proposal, handoff and this build-status file change. Application source,
authentication, Tide SDKs and equal-role guardrails remain unchanged. No private
configuration was inspected and no accounts, realms or Docker data were changed.
Evidence remains locked after two approvals. Independent startup and live
Tide/JWT/Fabric verification remain unverified; genuine scoped authority and expiry
are unfinished. Nothing was staged, committed, pushed, merged or deployed.

## Earlier owner verification — 8 October 2026

| Check                         | Latest owner transcript result                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| pnpm run typecheck            | PASS: frontend and backend                                                                    |
| pnpm run lint                 | PASS: frontend and backend                                                                    |
| pnpm run test:all             | PASS: backend 114/114 in 8 files; frontend 98/98 in 11 files, including incident-detail 14/14 |
| pnpm run build                | PASS: frontend and backend production builds                                                  |
| pnpm audit --audit-level=high | Completed: 3 Critical, 5 High, 10 Moderate; all unresolved                                    |
| git diff --check              | PASS: explicit exit 0; line-ending warnings only                                              |

Evidence is the supplied owner normal-PowerShell transcript, not an agent rerun.
Only the diff-check numeric exit was printed; other exits are not invented.
The 14-case suite includes the six recovery/stale-response regressions. Units
use mocked frontend/authentication/store surfaces and generated test-key JWTs;
they do not establish browser recovery, independent startup or live Tide/Fabric
authority. Peer results remain blank and TIDE-01..03 remain Blocked.

### Historical peer-preparation agent run — earlier 8 October 2026

The table below preserves the earlier restricted-environment failures; the
owner completion evidence above resolves the local application-check gap.

| Check                           | Agent exit code / result                                                    | Evidence limit                                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| pnpm run typecheck              | 0; both packages pass                                                       | Static checks only                                                                                                                  |
| pnpm run lint                   | 1; child ESLint reports 2                                                   | EPERM opening installed brace-expansion@1.1.21/index.js, before source linting                                                      |
| pnpm run test:all               | 1; backend 114/114 pass; frontend 37 pass in 4 files, 7 suites fail to load | Mocked units and generated test-key JWT checks; Next link/navigation import resolution fails before the remaining assertions        |
| pnpm run build                  | 1                                                                           | EPERM opening installed next/dist/bin/next, before frontend compilation; chained backend build not reached                          |
| pnpm --filter backend run build | 0                                                                           | Backend compilation passes separately                                                                                               |
| pnpm run test:emulator          | 1                                                                           | Backend compilation passes; Firebase CLI startup fails with EPERM resolving the user profile; no agent seed/export/reload execution |
| pnpm audit --audit-level=high   | 1                                                                           | Advisory fetch fails with EACCES/fetch failed; no new severity totals                                                               |
| git diff --check                | 0                                                                           | Final whitespace check; does not validate application behaviour                                                                     |

The owner previously reported passing frontend typecheck/lint, all 92 frontend
tests and both production builds in their normal terminal. Keep those passes
separate from this agent run; they are not independent-laptop results.

**Persistence is VERIFIED by the owner's isolated seed/export/reload execution.**
The unchanged probe uses real FirestoreStore transactions and synthetic identity
fixtures. Interactive demo restart, Docker restart, fresh laptop startup, live
JWT negative checks and Tide/Fabric acceptance remain unverified.

The authorised setup-forseti-e2ee, custom-contracts and version-policy lookups
were reported completed. Their findings still did not establish a complete,
network-tested SOC endorsement, scope and expiry flow. Policy v4 and an SDK
upgrade are not confirmed solutions. No further Tide calls were made in this task.

The fresh owner audit confirms **3 Critical, 5 High and 10 Moderate** findings,
all unresolved.
No dependency patch, lockfile or Tide SDK change was made. See
[the handoff](SOC-POC-HANDOFF.md) for the exact file groups, review finding,
manual actions and draft PR.

## Historical initial build record — 7 October 2026

The milestone table below preserves the initial agent results. Its test counts
and then-unverified persistence are historical, superseded by the evidence above.

## Accepted scope

The eight milestones in the user's request on feature/soc-emergency-access-poc:
Tide identity, equal SOC membership, two distinct other approvers, server-only
storage, retained audit and fail-closed evidence. Use the agreed existing layout,
blue accent, comfortable tables and in-page alerts. No staging, commits, pushes,
deployment, account/policy changes, private configuration or guardrail edits.

## Milestones

| Milestone                          | Implemented                                                                                                       | Verified                                                                                                                  | Blocked / remaining                                                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Inspection and Tide feasibility | Baseline, source/SDK review and capability table                                                                  | Installed 0.14.20 helper signatures/runtime; focused official documentation                                               | Exact SOC contract, endorsements, completion validation and Fabric expiry are unresolved                                                    |
| 2. Local runtime/storage           | Repository listener; explicit demo Admin SDK; native import/export scripts                                        | Typecheck/build; configuration safety and HTTP unit tests                                                                 | Actual emulator startup, transactions and graceful restart persistence                                                                      |
| 3. Request/approval backend        | Transactional creation, history, review, rejection, cancellation, stable identity/idempotency and bounded queries | 36 workflow/HTTP tests, plus retained backend tests                                                                       | Real Firestore integration; authority completion depends on milestone 4                                                                     |
| 4. Genuine Tide evidence/expiry    | Fail-closed evidence boundary; trusted optional 60-second demo configuration                                      | Unit tests deny wrong scope, tampered active flags and server-time expiry                                                 | Real encryption/ciphertext storage, scoped authority, activation, decrypt flow and cached-ciphertext expiry are not implemented or verified |
| 5. Agreed frontend                 | Submission, request details/history, review, audit, incident state, navigation and real-count filters/cards       | Typecheck; 15 new API/state tests                                                                                         | Seven component suites cannot resolve Next imports; production/browser checks; evidence panel/countdown await real Tide                     |
| 6. Audit                           | Atomic request/decision/cancel/failure/denial events; reserved expiry reconciliation; append-only API             | Unit tests cover idempotency, consistency, expiry and mutation denial                                                     | Real authority-activation/successful-access events cannot exist yet                                                                         |
| 7. Docker/group handoff            | Three Dockerfiles, safe build context, demo Compose and runbook                                                   | Source/JSON/YAML formatting checks; official image/tool listings                                                          | Docker build, readiness, browser access and graceful restart unverified                                                                     |
| 8. Validation/handoff              | Unit tests, isolated emulator probe, docs and manual checklist                                                    | Both typechecks; backend build; 114 backend tests; 34 frontend tests that loaded; formatting, placeholder and diff checks | Full frontend suite, lint, frontend build, advisory audit, actual emulator/Docker and live four-account Fabric tests                        |

## Decisions and preserved baseline

- HEAD, local main and origin/main remain 27b09cb. The requested feature branch
  already existed; its user-owned .claude/settings.local.json remains untouched.
- All four SOC roles can request/review other users. /api/me stays authentication-only.
- Two business approvals produce authorising/unavailable, with no access window.
  There is no activation endpoint, substitute authority or decryption fallback.
- No production dependency, lockfile, Tide SDK/image, realm or volume change.
- Capability assessment: SOC-TIDE-CAPABILITIES.md. Full handoff/results/file
  manifest: SOC-POC-HANDOFF.md. Launch/manual tests: SOC-POC-RUNBOOK.md.

## Current blockers and exact next action — 8 October 2026

1. Obtain a reproducible, non-secret fresh-client and four-account linking/role
   assignment walkthrough that preserves DPoP and governance. The completed
   guidance lookups do not close this setup gap or establish live Fabric authority.
2. Review unresolved dependency findings and the prepared compatible patch plan
   before publication. Owner local application checks and recovery regressions
   now pass; preserve package policies, dependencies and existing data. Any
   authorised future patch needs its own checks and fresh audit.
3. After a separately authorised publication, give the teammate its full SHA.
   They provision their own realm/configuration/identities, execute the peer cases
   and separately test interactive export/restart. Tide cases remain Blocked.

Do not mark milestone 4 or the overall PoC complete from application unit tests.
