# SOC PoC build status

Updated: 8 October 2026 (Australia/Sydney). Overall PoC: **incomplete**.
The candidate is ready for review. R-01 incident recovery is corrected and all
14 incident-detail tests passed in the owner normal-terminal run, including its
six new regressions. Both typechecks/lint, all 114 backend and 98 frontend tests,
and both production builds passed. Security/publication review and independent
startup remain incomplete. The latest owner evidence and earlier agent results
are separately attributed below and in SOC-POC-HANDOFF.md.
Real Tide/Fabric evidence access remains blocked and locked.

## Current evidence — 8 October 2026

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
