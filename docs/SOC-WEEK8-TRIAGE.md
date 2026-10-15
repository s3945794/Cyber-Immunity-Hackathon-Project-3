# Week 8 testing-findings triage

Current review: **Week 8 publication review — 16 October 2026** below is the
current readiness summary. Original findings, peer attribution and dated checks
are retained as historical evidence. Earlier references to documentation-only
scope, failed checks or unimplemented proposals apply to their dated phases,
not automatically to the present tree. F8 remains unresolved; the DPoP migration
proposal is retained for future review and is not approved for implementation.

Review date: 15 October 2026, Australia/Sydney. This is a source and evidence
review. No application, dependency, service, account or realm change was made.
Independent laptop startup and full Tide acceptance remain unverified.

## Review basis and preserved work

- Read root `AGENTS.md` and `CLAUDE.md`. The current prompt's documentation-only
  scope takes precedence over starting a new feature from clean main.
- Local branch: `feature/soc-emergency-access-poc`.
- Local HEAD and peer-tested SHA: `bc2f22bae66b6283c0acef0841cecfea28157a3c`.
- The source files cited below have no local changes against that SHA. Current
  dependencies differ from the tested commit because of the owner's earlier work.
- The compatible dependency patch is already applied and installed locally,
  according to the owner. Manifest and lockfile inspection supports the applied
  changes; this review did not install or independently verify installed packages.
  Do not apply `SOC-DEPENDENCY-PATCH-PLAN.patch` again. Historical statements in
  the handoff or PR #27 calling it unapplied do not describe today's worktree.
- Seven pre-existing modified files were recorded before review:
  `docs/SOC-DEPENDENCY-PATCH-PLAN.patch`, `docs/SOC-POC-BUILD-STATUS.md`,
  `docs/SOC-POC-HANDOFF.md`, `frontend/package.json`, `package.json`,
  `pnpm-lock.yaml`, `pnpm-workspace.yaml`. Preserve all seven, including their
  historical wording. Only this triage document is newly created.

No private environment file, adapter, credential, authentication storage or action
link was inspected. The public committed template was checked only for its
`CLIENT_ADAPTER` assignment. No Tide MCP, Gmail, Firebase Console or Google Cloud
access occurred. No startup, installation, patch application, Git branch switch,
commit, push, merge or deployment was performed.

## PR review and evidence identity

The following GitHub state was read on the review date. The command-line GitHub
connection failed, including its approved retry; public GitHub web pages and
raw committed source provided the review evidence instead. Check counts in a
page are not successful check results.

| PR                                                                                        | Reviewed state and content                                                                                         | Decision for this review                                                                                            |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| [#27](https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3/pull/27)             | Draft application PoC into main; four commits ending at the tested SHA.                                            | Keep draft. Application approvals do not establish genuine evidence authority. Its 8 October checks are historical. |
| [#28 files](https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3/pull/28/files) | Open; commit `d40efeb`; adds `docs/SOC-PEER-TEST-PLAN-RESULTS` without an extension, targeting the feature branch. | Read without merging. Preserve case-level observations and reconcile PEER-22.                                       |
| [#29 files](https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3/pull/29/files) | Open; commit `9819c65d1ecae959e27800b6f89437e17866c14e`; adds `docs/SOC-PEET-TEST-RESULTS.md`, targeting main.     | Read without merging. This contains F1–F12; the PR base does not change its explicitly recorded tested SHA.         |
| [#30 files](https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3/pull/30/files) | Open; head `72dc2158e5d9091712c528e76477334536efd608`; backend production dependency group into main.              | Hold for separate migration and lockfile review.                                                                    |
| [#31 files](https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3/pull/31/files) | Open; head `803391eac9cc19cc82012ada6a2c635296fda5d9`; frontend development dependency group into main.            | Hold for separate migration and lockfile review.                                                                    |

Both peer documents describe the 13 October 2026 run at the full local HEAD SHA.
They are two records of the same run, not two independent successful test runs.
The peer used a different local TideCloak container from the project's intended
container. That limits attribution of identity-server observations to this
project's Compose setup.

### Case coverage and discrepancies

| Cases      | Evidence retained from the peer documents                                                                         | Review treatment                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| PEER-01    | Startup acceptance blocked.                                                                                       | HTTP readiness does not establish the intended identity server or successful login.                                                                   |
| PEER-02–19 | Signed-in cases blocked; PEER-03 includes a successful unsigned incidents 401 subcheck.                           | No pass/fail inference about request validation, role equality, quorum, cancellation, history or session expiry.                                      |
| PEER-20–21 | Not run.                                                                                                          | Backend restart persistence and safe retry still require execution.                                                                                   |
| PEER-22    | #28 labels it Not run but also says `test:emulator` works. #29 has no executed seed/reload/final-result evidence. | **Needs reproduction/clarification.** Do not turn that sentence into a pass. This isolated test does not require signed-in accounts.                  |
| PEER-23    | Peer reports passing typecheck/lint, 114 backend and 98 frontend tests; both builds not run.                      | These are 13 October peer results, including mocked identity/store coverage, not verification today. Frozen installation was not explicitly executed. |
| PEER-24    | Browser/setup observations.                                                                                       | Browser changes did not establish a working authentication flow.                                                                                      |
| TIDE-01–03 | Blocked.                                                                                                          | Encryption, cryptographic scope/quorum and expiry need implemented, supported flows and separate acceptance.                                          |

The report links are broken as submitted: #28 references
`SOC-PEER-TEST-RESULTS-2026-10-13.md`, while #29 adds
`SOC-PEET-TEST-RESULTS.md`. #29 references
`SOC-PEER-TEST-PLAN-RESULTS.md`, while #28 omits `.md`. Neither PR adds the file
named by the other report's link. Later, agree canonical names, correct both
cross-links and decide the intended PR bases. Do not silently rename or merge
either peer submission during triage.

## Findings F1–F12

Status means: **confirmed** = supported by inspected source; **needs reproduction**
= evidence is incomplete or contradicted; **blocked** = a prerequisite or supported
integration is missing; **informational** = no demonstrated application fix is
required. Confirmed source behaviour is not a claim of a new runtime reproduction.

Priorities: **P1** blocks reproducible testing or a dependable sign-in path;
**P2** improves safe diagnosis/recovery; **P3** is documentation or local hygiene.
Reported severity is separate from this fixing priority. None of these reports
demonstrates a new evidence disclosure or authority bypass.

Reproduction procedures below are proposed follow-up checks unless expressly
attributed to the peer. They were not executed during this review.

### F1 — Native pnpm launcher incompatibility

- **Affected cases:** PEER-01, PEER-22 and PEER-23; PEER-21 depends on emulator startup.
- **Reported symptom:** `demo:emulator` fails with `ERR_UNKNOWN_FILE_EXTENSION`
  for `.exe`; a JavaScript pnpm installation works.
- **Source support:** Confirmed in `scripts/demo.cjs:8` and `:54`: the emulator
  path puts `npm_execpath` in Node's argument list and launches `process.execPath`.
  This assumes the package manager is JavaScript. `scripts/test-emulator.cjs:8`
  and `:51` repeat the assumption, so the proposed fix must cover both entry
  points. The backend branch launches compiled JavaScript and must retain that
  behaviour. The separate first-use build-approval prompt is not explained by
  this launcher defect; it needs its own reproduction.
- **Status / classification / priority:** **confirmed / application defect / P1**.
- **Reproduce:** In a controlled Windows fixture, supply a native `.exe`
  `npm_execpath` and capture the chosen executable/arguments with a mocked child
  launcher. Compare a `.js`/`.cjs` package-manager entry. An authorised real
  follow-up can exercise both emulator commands on reserved ports.
- **Smallest proposed fix:** A shared, narrow launcher that runs native
  executables directly and JavaScript CLI entries through Node, with argument
  arrays and no shell-string construction. Keep signal forwarding, child exit
  codes, port checks, pinned Firebase tooling and demo isolation intact. Check
  supported Windows shim formats rather than treating every path as an `.exe`.
- **Verification / permissions:** Regression coverage for both callers, native
  and JavaScript paths, paths with spaces, spawn failure and nonzero exit. Then
  record an authorised seed/export/reload run separately from units. Future code
  editing and emulator/tool-download permission are required; none is exercised
  now. Do not globally approve package build scripts or install another pnpm as
  an automatic workaround.

### F2 — Alleged nonblank shipped adapter placeholder

- **Affected cases:** PEER-01 and PEER-24; other cases depend on backend readiness.
- **Reported symptom:** A placeholder overrides the file adapter.
- **Source support:** The reported template defect is contradicted by the
  exact tested commit: public `.env.example:85` already has `CLIENT_ADAPTER=`
  blank. There is no local template diff. The override mechanism itself is
  supported: `backend/src/lib/tidecloakConfig.ts:92` prefers any truthy
  `CLIENT_ADAPTER` and fails closed on invalid JSON; otherwise it uses the
  repository-root adapter path. `scripts/sync-env.js` copies the configured
  assignment into generated backend configuration. This does not prove where
  the peer's nonblank value originated.
- **Status / classification / priority:** **needs reproduction / local setup / P2**.
- **Reproduce:** Use wholly synthetic configuration with mocked file reads to
  compare empty, nonblank invalid and valid adapter inputs. Ask the tester for
  the public template revision and setup sequence, and whether generated files
  were stale; do not request private contents or values.
- **Smallest proposed fix:** No template change. Clarify documented precedence
  and the blank option for file-based configuration if needed; use F3's safe
  startup diagnosis. Do not silently fall back after an explicitly supplied
  invalid adapter, which could select a different authority.
- **Verification / permissions:** Keep malformed explicit input fail-closed and
  blank-input file fallback covered with mocked reads. Any private setup
  correction must be made by its owner outside this review.

### F3 — Backend startup failure hides the failing stage

- **Affected cases:** PEER-01, PEER-20 and PEER-24.
- **Reported symptom:** Startup produces one generic diagnostic.
- **Source support:** Confirmed: `backend/src/server.ts:44` discards startup
  exceptions after demo configuration, emulator connectivity, adapter validation
  and port checks. Listener failure has a separate generic message. Realm/client
  consistency is not itself checked by this startup function; do not promise a
  specific mismatch diagnosis without implementing and reviewing such a check.
- **Status / classification / priority:** **confirmed / application defect / P2**.
- **Reproduce:** Mock each startup boundary independently and inspect only its
  safe stage/code and exit status. No real adapter or network is needed.
- **Smallest proposed fix:** Allowlisted messages/codes for demo configuration,
  emulator availability, adapter validity and listener/port failure. Retain
  fail-closed startup. Never print raw exception text, configuration, stack dumps
  or adapter fragments to make diagnostics more detailed.
- **Verification / permissions:** Cover each stage, nonzero exits and absence of
  injected synthetic sensitive text in output. Future application/test changes
  are required; real service starts or private configuration access need separate
  authorisation. No production dependency is needed for the proposal.

### F4 — Realm/client names must match frontend configuration

- **Affected cases:** PEER-01, PEER-03 and PEER-24.
- **Reported symptom:** Chosen names differed between configuration sources.
- **Source support:** `frontend/src/lib/tidecloak/config.ts:38–42` reads public
  settings independently of the backend adapter. However, the tested runbook
  already lists `NEXT_PUBLIC_TIDECLOAK_REALM` and
  `NEXT_PUBLIC_TIDECLOAK_CLIENT_ID` in section 3 and requires consistency in
  section 4. It also documents synchronisation and restarting/rebuilding when
  public browser settings change. A missing instruction is not established.
- **Status / classification / priority:** **informational / local setup / P3**.
- **Reproduce:** Compare an intentionally mismatched pair of synthetic
  browser/backend fixtures; have the tester confirm completion of the documented
  consistency steps without disclosing values.
- **Smallest proposed fix:** Put the existing consistency checklist beside the
  wizard step if usability warrants it. Do not hard-code the owner's names or
  automatically read a private adapter into browser configuration.
- **Verification / permissions:** A later tester follows the clarified checklist
  with their own names and records login outcome. Private edits remain owner-run.

### F5 — Wizard redirect/origin setup

- **Affected cases:** PEER-01, PEER-03 and PEER-24.
- **Reported symptom:** Login reports `Invalid parameter: redirect_uri` until
  generated redirects/origin are corrected.
- **Source support:** The callback and silent SSO paths match the runbook's
  app-origin checklist. `docs/TIDECLOAK-LOCAL.md:145` already warns that the
  wizard field behaves like a base URL; the runbook says to review generated
  entries before approval. This supports a known setup hazard, not a defect in
  the application's callback path. Exact fresh-wizard behaviour is unverified.
- **Status / classification / priority:** **needs reproduction / local setup / P2**.
- **Reproduce:** On a separately authorised fresh local setup, record only the
  wizard version, field interpretation and whether generated origin/callback
  entries match the documented app paths. Do not share authentication URLs.
- **Smallest proposed fix:** Clarify review of the generated values. Retain
  precise app origins/callbacks; do not broaden redirects to a wildcard to
  suppress a rejection. Document post-logout compatibility only once verified.
- **Verification / permissions:** Successful login, silent SSO and logout need
  separate checks. Creating or changing a client/realm and approving governed
  changes require explicit owner approval and the applicable QEA process.

### F6 — HTTP probe can answer from another service

- **Affected cases:** PEER-01, PEER-03 and PEER-24; it confounds F7–F9.
- **Reported symptom:** Status appeared healthy for another container.
- **Source support:** `scripts/tidecloak.js:195–203` prints Compose status and
  then independently probes `localhost:8080`; it does not correlate container
  identity or published port with that HTTP response. The startup readiness loop
  uses the same probe. That attribution gap is supported. The narrower claim
  that the runbook lacks a conflict warning is contradicted by section 4 and the
  occupied-port troubleshooting row: both already require agreeing isolation.
- **Status / classification / priority:** **confirmed / application defect / P2**
  for uncorrelated readiness. The reported port conflict remains local setup.
- **Reproduce:** With Docker and HTTP calls mocked, combine an absent/stopped or
  unpublished target service with a successful response from another service.
- **Smallest proposed fix:** Require the intended Compose service to be running
  and its port mapping to match before describing HTTP reachability as that
  service's readiness. Keep HTTP reachability distinct from authentication.
  A documentation-only container/port ownership checklist can come first.
- **Verification / permissions:** Cover wrong service, missing mapping, Compose
  failure and healthy intended mapping. No container, volume or unrelated
  process may be stopped or recreated automatically. Real Docker checks/startup
  require follow-up authorisation; do not print resolved Compose configuration.

### F7 — Alleged missing host port publishing

- **Affected cases:** PEER-01, PEER-03 and PEER-24.
- **Reported symptom:** Container output lists only `8080/tcp`; the expected
  server is unreachable on the host after the other container is stopped.
- **Source support:** Tested `docker-compose.tidecloak.yml:42–43` already
  publishes `8080:8080`; the worktree file is unchanged. Adding the same mapping
  cannot fix a missing mapping in a differently created/running container. The
  reports' mixed-container provenance does not identify the exact Compose
  project/service/container behind each observation.
- **Status / classification / priority:** **needs reproduction / unknown / P1**
  as a setup blocker, not a confirmed Compose source defect.
- **Reproduce:** In an authorised follow-up, correlate the command, working
  directory, explicit Compose file/project, intended service, effective published
  port and actual responding container. Use limited safe metadata only; no
  environment, full inspect dumps, volume contents or credentials.
- **Smallest proposed fix:** No Compose mapping change on present evidence.
  Establish ownership and explain recreation only if a stale container is
  demonstrated. Never stop another project to force this one onto port 8080.
- **Verification / permissions:** Confirm the target's binding and reachability
  separately. Any stop/recreation/port change needs explicit permission and must
  preserve existing volumes and unrelated services.

### F8 — Reported missing DPoP proof at token exchange

- **Affected cases:** PEER-01–19 and PEER-24; PEER-20–21 lack their signed-in
  prerequisites. It does not block isolated PEER-22 by itself.
- **Reported symptom:** HTTP 400 `invalid_dpop_proof` at token exchange, with
  missing-proof reason, in both tested browsers.
- **Source support:** Compatible with a client/integration mismatch, but not a
  confirmed general Tide outage. The browser config declares a public client,
  sets `setupRequestEnclave: false` and supplies no explicit DPoP setup. The
  documented SDK pin is `0.14.20`. Existing ISSUE 010 and the runbook record a
  similar historical failure. The peer's effective private settings, image
  digest/version and SDK proof behaviour were not inspected or reproduced.
- **Status / classification / priority:** **blocked / Tide integration / P1**.
  High testing impact does not establish a platform-wide incident or its cause.
- **Reproduce:** First obtain a nonsecret, supported version/client compatibility
  procedure. In an approved isolated instance, correlate time/timezone, image
  identity, SDK version, browser, stage and safe error code. Preserve the existing
  DPoP and PKCE posture; use owner-confirmed setting labels rather than private
  adapter contents, headers, request bodies or authentication storage.
- **Smallest proposed fix:** No security setting change is justified now. Resolve
  the supported integration path and test its prerequisites before proposing
  code. Current official guidance describes explicit DPoP setup and proof-aware
  requests. The 16 October installed-source follow-up below confirms those SDK
  capabilities; coordinated application integration remains subject to approval.
- **Verification / permissions:** A later full flow must cover login, refresh,
  logout, API proof validation and rejection of missing/invalid proofs where
  DPoP is required. Do not enable only the browser side: current incident/access
  calls and backend middleware use Bearer authentication. Any SDK migration,
  authentication architecture, realm/client/account change or service startup
  needs separately scoped approval. Do not disable DPoP or change PKCE.

### F9 — Unexpected client authentication method label

- **Affected cases:** PEER-03 and PEER-24; investigate alongside F8.
- **Reported symptom:** A log label conflicts with the public-client display.
- **Source support:** Browser config explicitly has `'public-client': true`.
  No inspected application source proves a confidential-client exchange. The
  reported `client_auth_method="client-secret"` label alone cannot establish
  that a secret was transmitted or identify its cause.
- **Status / classification / priority:** **needs reproduction / unknown / P2**.
- **Reproduce:** Have the authorised tester correlate the same client, container,
  software version, event time and effective approved public-client posture.
  A supported SDK test can use synthetic request fixtures. Do not capture or
  request real headers, payloads, secrets or private configuration.
- **Smallest proposed fix:** None until the event label's meaning and actual
  flow are established. Do not add a client secret or switch client type.
- **Verification / permissions:** Supported public-client exchange and safe event
  interpretation; client changes and any live diagnostic access need approval.

### F10 — Callback failure feedback is lost

- **Affected cases:** PEER-03, PEER-19 recovery and PEER-24.
- **Reported symptom:** Failed login returns silently to sign-in.
- **Source support:** `frontend/src/app/(auth)/auth/redirect/page.tsx:23–25`
  immediately navigates on error. Its error paragraph can therefore disappear;
  the destination sign-in page receives no safe failure state. The paragraph
  also interpolates raw `error.message`, which should not be the proposed
  diagnostic solution. Source supports lost feedback, not an automatic
  infinite-login loop: the sign-in page waits for a button click.
- **Status / classification / priority:** **confirmed / application defect / P2**.
- **Reproduce:** Mock `useAuthCallback` failure and navigation. Confirm the
  destination provides a persistent, accessible failure/retry message without
  consuming or displaying real callback query data.
- **Smallest proposed fix:** Agree whether a generic failure stays on the
  callback page or appears on sign-in, then use an allowlisted failure state
  and explicit retry. Do not pass raw errors or authentication parameters
  through URLs, logs or storage. Keep successful return navigation intact.
- **Verification / permissions:** Tests for success, callback error, missing
  verifier, direct callback visit and repeated retry; check keyboard/focus and
  alert announcement. Before UI implementation, obtain the detailed design
  answers and confirmation required by `AGENTS.md`; no redesign or UI
  implementation prompt is authorised by this review.

### F11 — Git ownership prevents hook installation

- **Affected cases:** PEER-01, PEER-23 and PEER-24.
- **Reported symptom:** Git reports dubious ownership during hook installation.
- **Source support:** Root `package.json` has `prepare: lefthook install`.
  This explains how a Git ownership check can affect installation; it does not
  prove a repository application defect or the peer filesystem's ownership.
- **Status / classification / priority:** **informational / local setup / P3**.
- **Reproduce:** Owner verifies that the exact clone is trusted and checks its
  ownership in their own environment; do not simulate by changing real ownership.
- **Smallest proposed fix:** Document the ownership/trust check and an optional
  owner-approved exception for that exact trusted clone. Never use
  `safe.directory=*`, alter global trust automatically or bypass hooks broadly.
- **Verification / permissions:** Owner-run hook installation on the trusted
  clone. Any Git trust/configuration change requires explicit approval.

### F12 — Extension-induced hydration warning

- **Affected cases:** PEER-24; may add noise to PEER-03 observations.
- **Reported symptom:** Grammarly's injected `data-gr-*` attributes trigger a
  development hydration warning.
- **Source support:** No application source establishes the extension's runtime
  injection. This is consistent with external DOM modification, not a demonstrated
  application rendering defect.
- **Status / classification / priority:** **informational / local setup / P3**.
- **Reproduce:** Compare a clean browser profile without extensions with the
  affected profile at the same SHA; do not inspect cookies or login storage.
- **Smallest proposed fix:** Record the clean-profile comparison in test guidance.
  Do not add broad hydration suppression or disable browser protections.
- **Verification / permissions:** Record whether the warning disappears and
  keep authentication failures separately attributed. Profile/extension changes
  remain user-controlled; no application edit is currently justified.

## DPoP/client-setting comparison

Only documented/public settings were compared. The historical owner profile has
DPoP requirement Off, PKCE On and S256 in the runbook. That describes an existing
instance; it is not a fresh-client recipe. The peer did not establish a supported
successful DPoP-preserving flow. Its error is evidence about its own exchange.
The current source's public-client flag cannot verify a server-side client setting.

[Official Tide DPoP guidance](https://docs.tide.org/Core-Concepts/dpop), read on the
review date, describes opt-in proof binding, a verification page and proof-aware
API calls, including resource-server validation. It does not prove compatibility
with `0.14.20`, the historical image or this app's current Bearer-only calls.
Confirm a supported version matrix before adopting any example. Do not confuse
the report's missing-proof error, historical 502s, browser-specific observations,
voucher observations and ORK failures without correlated evidence.

## Dependency PRs and lockfile consistency

**Classification: dependency risk. Priority: P1 review before integration; major
migrations are outside the focused application-fixing task. Neither PR is ready
to merge on this review's evidence.**

### PR #30

The submitted diff changes only `backend/package.json`. Its major upgrades are
Firebase Admin 13 to 14, Firebase Functions 6 to 7 and Zod 3 to 4. Express and
express-rate-limit remain within their existing majors. These need review of
runtime/SDK compatibility, validation and error shapes, Cloud Functions types
and Firestore access. No cloud deployment/test is authorised.

The [lockfile at the reviewed head](https://raw.githubusercontent.com/s3945794/Cyber-Immunity-Hackathon-Project-3/72dc2158e5d9091712c528e76477334536efd608/pnpm-lock.yaml)
still records backend specifiers/resolutions `firebase-admin ^13.3.0 / 13.10.0`,
`firebase-functions ^6.4.0 / 6.6.0` and `zod ^3.24.0 / 3.25.76`, whereas the new
manifest requires majors 14, 7 and 4. Express and rate-limit specifiers also
remain old. This is a confirmed manifest/lockfile mismatch. The existing local
`firebase-admin@13` Busboy override would not cover a future Admin 14 path;
reviewing that path is necessary before any migration is accepted.

### PR #31

The submitted diff changes only `frontend/package.json`. Major transitions
include TypeScript 5 to 7, ESLint 9 to 10, Vitest/coverage 3 to 5, React plugin
4 to 6, jsdom 26 to 30, jest-dom 6 to 7 and Node type definitions 20 to 26.
The Tailwind Prettier plugin also crosses pre-1.0 minor lines, which deserve
compatibility review. These changes are substantially broader than a small
security patch.

The [lockfile at the reviewed head](https://raw.githubusercontent.com/s3945794/Cyber-Immunity-Hackathon-Project-3/803391eac9cc19cc82012ada6a2c635296fda5d9/pnpm-lock.yaml)
retains frontend specifiers `typescript ^5`, `eslint ^9`, `vitest ^3.1.1` and
`@vitest/coverage-v8 ^3.1.1`, with resolutions 5.9.3, 9.39.5 and 3.2.7. This is
also a confirmed manifest/lockfile mismatch, not evidence of installed upgrades.
The PR proposes `eslint-config-next 16.4.0`, while local patched Next is 16.3.8;
their compatibility needs review. Frontend tool migrations must also be checked
against unchanged backend Vitest/TypeScript tooling and workspace overrides.
Node 26 definitions need explicit runtime alignment: CI uses Node 22 and the
runbook's owner runtime is Node 24. Do not infer that newer definitions are safe.

For either PR, the smallest next step is a separate migration proposal with a
coherent root lockfile and reviewed peer/engine constraints, followed by a fresh
frozen installation, typechecks, lint, units, production builds and attributed
audit. CI explicitly uses frozen installation. The
[official pnpm installation contract](https://pnpm.io/cli/install#--frozen-lockfile)
says stale manifest/lockfile state fails frozen installation. This predicts
failure from source; it is not a claim that CI was executed during this review.
No lockfile regeneration or upgrade was attempted.

### Current preserved dependency work

Current root/frontend manifests and their lockfile entries use Next 16.3.8.
The preserved override block includes Sharp 0.35.5, scoped Busboy 3.2.2,
source-map-js 1.2.2, proxy-addr 2.0.8 and ip-address 10.7.1. The corresponding
locked entries are present. A read-only structural comparison checked all 55
dependency/devDependency specifiers across the three manifests and all 16
workspace/lockfile overrides: **zero mismatches**. This verifies those static
fields only, not the complete dependency graph, installed state, build, security
remediation or a successful frozen installation. Braces 3.0.3 and Tinypool 1.1.1
remain visible in the lockfile; do not call the tree clean or force a transitive
major override. Leave further dependency work in its own reviewed task.

## Audit attribution: keep runs separate

| Evidence source and date                                                                      | Recorded totals                                    | Limits                                                                                                            |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Historical owner application-verification record, 8 October; #27 and retained runbook/handoff | 18: 3 Critical, 5 High, 10 Moderate                | Historical owner result. It is not a 15 October audit.                                                            |
| Owner-reported GitHub CI, separately recorded in the existing dependency handoff              | 33: 3 Critical, 8 High, 20 Moderate, 2 Low; exit 1 | CI run SHA/date/order need confirmation. Its listing was incomplete; do not infer environment-exclusive findings. |
| Owner-supplied local JSON described in that handoff                                           | 24: 3 Critical, 6 High, 14 Moderate, 1 Low         | Separate local run; shell exit absent. No original JSON was reopened. Its order relative to CI is unknown.        |
| Peer run, 13 October, #28/#29, tested SHA `bc2f22b…`                                          | 24: 3 Critical, 6 High, 14 Moderate, 1 Low         | Peer result, not the owner JSON even though totals match. No remediation was performed by that test.              |
| Historical restricted agent audit attempts recorded in the handoff                            | No new totals; advisory fetch failed               | A failed fetch neither clears findings nor supplies a current count.                                              |
| This review, 15 October                                                                       | Audit not run                                      | No post-patch totals or resolved-advisory claim.                                                                  |

The peer's additional Next finding does not prove its source tree differed from
the owner's: tested committed Next is 16.3.6, whereas today's preserved local
patch moves to 16.3.8. Advisory publication time, command/options and resolved
graphs must be compared per run. Same totals do not prove same findings; lower
totals do not prove remediation. Obtain date/time, SHA, lockfile fingerprint,
tool versions, command, exit and safe advisory IDs/paths for a later comparison.
Do not request raw configuration or assume any absent CI finding was absent.

## Recommended fixing order and realistic 180-minute scope

The label is an estimate, not a deadline or permission to skip verification.
No part of this section authorises implementation in the present review.

1. Reconcile the evidence first: canonical report names/links, PEER-22 execution,
   tested template provenance and intended container ownership. Keep disputed
   claims open; do not spend time adding settings already in tested source.
2. Fix F1 across both launchers with offline regression tests. This makes local
   verification more dependable and can proceed without solving F8.
3. Fix F3 with safe stage diagnostics. Retain security boundaries and avoid a
   broader adapter or authentication rewrite.
4. Address F10 after the required UI design answers are confirmed. F6's source
   readiness correlation is the next independent tooling improvement if time
   permits; keep its real Docker verification separately authorised.
5. Resolve F7's runtime identity and F8/F9's supported compatibility questions
   before claiming independent login. Authentication integration may need a
   separate longer task. Once ready, rerun the blocked case matrix with four
   distinct users; all four roles may request and review other users' requests.
6. Review #30/#31 and residual dependency risks in a separate migration task.
   Preserve the installed compatible patch and obtain a new attributed audit
   only when that verification is authorised.

| Suggested effort             | Deliverable and stopping boundary                                                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| About 20 minutes             | Confirm the exact starting tree and evidence corrections. The dirty owner work must remain intact. Agree a clean-main/feature-branch strategy for later work; do not switch, stash or discard it automatically. |
| About 50 minutes             | F1 shared launcher and focused tests for both callers. Stop expansion into package-manager upgrades or build-policy changes.                                                                                    |
| About 35 minutes             | F3 safe startup-stage diagnostics and tests. Keep raw provider errors private.                                                                                                                                  |
| About 25 minutes             | Focused report/setup documentation: F2/F4 already-present settings, F5 checklist, F6/F7 ownership warning and PEER-22 evidence requirements.                                                                    |
| At least 50 minutes reserved | Relevant typecheck, lint, units, both production builds, whitespace/secret/artifact checks and a clear verification report. Add authorised emulator validation only if prerequisites are available.             |

This is roughly 180 minutes for F1/F3 plus evidence/setup clarity and validation.
F10 can replace part of the documentation allowance only after design approval
and if enough time remains for meaningful tests; otherwise make it the next
small task. F6 runtime correlation and F8 integration are not promised in this
estimate. Extend the task or report a blocker if checks take longer. Builds may
load private local configuration, so arrange an explicitly approved safe
verification setup before executing them; do not read those files.

Exclude from the fixing task: applying the dependency patch again, major
dependency upgrades, broad UI redesign, genuine encryption/quorum/expiry work,
new role hierarchies, connecting unrelated guards, account/realm changes,
DPoP disabling, PKCE changes, cloud access, deployment and automatic PR merges.
Keep `/api/me` authentication-only and evidence locked. A successful emulator
probe with synthetic identities cannot pass live JWT or TIDE-01–03 acceptance.

## Unresolved questions and required permissions

- **Tester:** Was PEER-22 actually executed? Supply only phase summaries and the
  final exit, or correct the statement. Do not provide fixture/storage dumps.
- **Tester:** Which public template revision/setup sequence produced F2, and
  were generated files current? Supply no private values or files.
- **Tester:** Which intended Compose service and responding container produced
  each F6–F9 observation? Confirm safe project/port/version metadata and
  timestamps. No full Docker inspection or resolved-configuration dumps.
- **Report owner:** Which canonical filenames and PR bases should #28/#29 use?
  Publication, amendments and merges are separate actions, not part of triage.
- **Integration owner:** What supported client/SDK/image combination preserves
  the current DPoP/PKCE posture? Current documentation is not a version guarantee
  for the pinned SDK. No security setting or account change is approved.
- **Audit owner:** Confirm run identifiers, dates, SHAs and ordering for CI and
  supplied local JSON; later reconcile safe advisory/path data with the patched
  lockfile. Do not combine the peer and owner 24-finding runs.
- **Owner before fixing:** Authorise the narrow code/test scope, safe baseline
  handling and any emulator/tool downloads. Confirm UI design before F10. Git
  trust edits, service changes, private diagnostics, dependency migrations,
  cloud access, commits, pushes and merges remain separately controlled.

## Verification and safe Git status

Fresh checks for this documentation review: branch/HEAD/status inspection,
source comparisons against the tested SHA, the 55-specifier/16-override static
comparison, review of PR files and committed lockfiles, document completeness,
whitespace and a targeted check for secrets/temporary artifacts. All seven
pre-existing files' SHA-256 hashes match the recorded starting hashes.

Application typecheck, lint, unit tests, production builds, emulator probes,
browser login and audit were **not run today**. No historical success is promoted
to a fresh result, and this document does not declare the feature branch complete.

Observed final status: unchanged branch/HEAD, the same seven modified files,
and one untracked file `docs/SOC-WEEK8-TRIAGE.md`. No staged changes. Stop here
for review; do not commit, push or merge.

## F1/F3 implementation follow-up — 15 October 2026

Authorisation: the owner's subsequent prompt requests only F1 and F3 on the
existing feature branch. HEAD remains
`bc2f22bae66b6283c0acef0841cecfea28157a3c`; no clean-main switch, staging or
dependency work is part of this follow-up. The initial F1/F3 findings above
remain the source review of the peer-tested SHA, with their original attribution.

### Changes and current status

| Finding | Implemented change                                                                                                                                                                                                                                                                                                                                                         | Verification status                                                                                                                                                                                                                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1      | Shared executable selection in `scripts/pnpm-launcher.cjs`, used by `scripts/demo.cjs` and `scripts/test-emulator.cjs`. JavaScript entries use Node; absolute Windows `.exe` entries run directly; POSIX extensionless native entries remain supported. Argument arrays and explicit `shell: false`; reject batch/PowerShell shims rather than interpolate shell commands. | **Implemented; mocked regression coverage passed.** Actual Windows JavaScript pnpm version probe passed. Native pnpm.exe startup, actual console Ctrl+C propagation and emulator export/import remain unverified. Do not mark fully verified.                                                                                                              |
| F3      | Fixed startup stage codes in `backend/src/server.ts`: configuration, emulator connectivity, adapter validation, application construction and port binding/listener setup. Validate port before connectivity/private adapter loading; keep adapter validation before app/listener creation. Never emit raw caught data.                                                     | **Implemented; mocked regression coverage, typecheck, lint and backend build passed. Owner reports the full 135-test backend suite passed on 15 October.** The agent's HTTP checks encountered connection-permission failures; that separate result is retained below. Live startup with private setup was not performed. Do not mark fully verified live. |

F1 preserves the existing child environment overrides, cwd, pinned Firebase
tooling, import/export flags, isolated test project/paths/ports, nonzero-exit
behaviour and graceful signal strategy. Native `.exe` support does not change
pnpm installation, package build approvals or supply-chain policy. The existing
backend Node invocation remains unchanged.

F3 prints only static code/recovery strings. Tests throw synthetic errors with
secret sentinels in messages and nested adapter/header/credential fields and
assert that output contains none of that data. Configuration failures do not
reach adapter/app startup; emulator failure does not reach adapter/app startup;
adapter failure cannot construct or bind the app. Codes identify established
stages, not speculative realm/client mismatch or a particular binding errno.
Existing authentication, database guards and locked evidence are unchanged.

### Fresh verification evidence

Agent commands below were run from the repository root. The later owner-run
result is separately attributed. These are this follow-up's results, separate
from the 8 October owner and 13 October peer records.

| Check                                                                                   | Actual outcome and evidence boundary                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec node --test scripts/tests/demo-launchers.test.cjs`                           | Exit 0; 30 pass. Real launcher source evaluated with mocked process/child/filesystem/socket I/O. Covers JavaScript/native selection, spaces/metacharacters, unsupported shims, both emulator callers, arguments, environment, import/export/reload sequence, signals, port conflicts, spawn errors and child exits. No real emulator/process-start acceptance.                                                          |
| `pnpm --filter backend exec vitest run tests/unit/server.test.ts --configLoader runner` | Exit 0; 21 pass. Configuration/port, timeout/error/connect, adapter, construction, synchronous/asynchronous binding, successful host selection and graceful close branches. All runtime I/O mocked.                                                                                                                                                                                                                     |
| `pnpm --filter backend typecheck`                                                       | Exit 0.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `pnpm --filter backend lint`                                                            | Exit 0.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `pnpm --filter backend build`                                                           | Exit 0; TypeScript production compilation only, not a listener start.                                                                                                                                                                                                                                                                                                                                                   |
| Focused Prettier check of seven changed code/test files                                 | Exit 0 after formatting the three files reported by the initial check. No unrelated formatter/hook changes.                                                                                                                                                                                                                                                                                                             |
| Agent: `pnpm --filter backend test`                                                     | Exit 1; 82 pass, 53 fail, five files affected. Every failure is `connect EACCES 127.0.0.1` in temporary HTTP tests. One approved outside-sandbox retry produced the same result. No further retries or route/auth changes. This agent-environment result remains **blocked**, not passed.                                                                                                                               |
| Owner: `pnpm --filter backend test`, normal Windows terminal, 15 October 2026           | **Owner reports all 135 tests passed across nine files, including all 21 server startup tests.** The earlier loopback EACCES failures did not occur. Evidence source: the owner's subsequent chat update; not an agent rerun. This is a backend unit-suite result, not native pnpm.exe or live-service verification.                                                                                                    |
| Actual Windows JavaScript pnpm launcher probe                                           | Explicit installed `.cjs` entry through `scripts/check-pnpm-launcher.cjs`; prints `win32`, pnpm 11.20.0, JavaScript entry, exit 0. This starts only the package manager's version command.                                                                                                                                                                                                                              |
| First version-probe attempt without an explicit entry                                   | Exit 1: this `pnpm exec` environment does not provide `npm_execpath`. Corrected the probe to require an explicit entry and documented the working command. This was not an application or emulator failure.                                                                                                                                                                                                             |
| Actual native Windows pnpm executable                                                   | **Not tested: no native executable found on PATH.** Owner reports `Get-Command pnpm -All` lists `pnpm.ps1`, `pnpm.cmd` and `pnpm` under AppData/Roaming/npm; `Get-Command pnpm.exe` returns no results. This separately corroborates the earlier agent lookup. No pnpm installation or PATH change is required or authorised. The successful JavaScript probe and 135-test owner backend pass remain separate evidence. |
| Real emulator lifecycle / live backend startup / frontend build / audit                 | Not run. Services and private configuration access remain excluded; no frontend changes justify a configuration-loading frontend build.                                                                                                                                                                                                                                                                                 |

The owner reports that this exact command passed in their normal Windows
terminal on 15 October 2026; the agent-environment failures above remain a
separate record:

```powershell
pnpm --filter backend test
Write-Output "backend test exit: $LASTEXITCODE"
```

For a service-free launcher check with an already installed native executable:

```powershell
Get-Command pnpm.exe -All -CommandType Application -ErrorAction SilentlyContinue |
  Select-Object Name, Source
```

Use the full path of the intended existing native pnpm installation. Shell
shims (`pnpm.cmd`, `pnpm.ps1`) and the JavaScript `.cjs` entry do not qualify.
If multiple candidates exist, select the intended one explicitly. If none is
listed, an owner-known existing pnpm.exe outside PATH is also accepted, without
installing packages or changing PATH:

```powershell
$nativePnpmEntry = (Resolve-Path -LiteralPath (Read-Host 'Full path to existing pnpm.exe')).ProviderPath
pnpm exec node scripts/check-pnpm-launcher.cjs $nativePnpmEntry
Write-Output "native launcher probe exit: $LASTEXITCODE"
```

When the intended executable is already the first resolved PATH candidate,
the previously documented form is also supported:

```powershell
$nativePnpmEntry = (Get-Command pnpm.exe -CommandType Application -ErrorAction Stop).Source
pnpm exec node scripts/check-pnpm-launcher.cjs $nativePnpmEntry
Write-Output "native launcher probe exit: $LASTEXITCODE"
```

The [runbook's F1/F3 subsection](SOC-POC-RUNBOOK.md#f1-launcher-compatibility-and-f3-startup-diagnostics--15-october-2026)
also gives the successful JavaScript-entry resolution command, startup code
table and remaining Windows lifecycle checks. If pnpm.exe exists outside PATH,
use only its owner-known absolute path; do not install or change versions.
Actual Ctrl+C export/restart and isolated seed/export/reload need separate
service-start approval before using the existing demo/probe commands. Neither
mocked signals nor a successful version probe establishes emulator persistence.
The owner's 135-test pass and the successful JavaScript probe do not establish
native pnpm.exe invocation. Native verification still requires the explicit
probe to report `win32`, `native entry`, `exit 0` and the installed version.
No native probe or test suite was rerun for this documentation update.

### Owner verification plan after the PATH check

The owner's latest PATH check leaves native pnpm.exe verification **Not tested:
no native executable found on PATH**. Continue using the existing JavaScript
pnpm installation. Do not install another pnpm, change PATH or reinterpret
shell shims as native verification. The earlier native-probe commands remain
reference instructions only if an actual executable is independently available.

The [runbook's owner execution plan](SOC-POC-RUNBOOK.md#owner-execution-plan--windows-startup-and-persistence)
gives the ordered checks: preflight/build; isolated real Firestore seed/export/
reload; safe emulator-unavailable diagnosis; interactive emulator/backend/
frontend startup; optional known-backend binding diagnosis; graceful Ctrl+C;
export/import and optional UI record comparison. Only the identity-server/login
part needs Docker. The isolated probe has fresh synthetic data and no Tide/JWT
dependency; the interactive demo preserves its existing dedicated data directory.

This was an owner-run plan, **not execution evidence**. No services, probes or
unit tests were started by the agent for that documentation-only planning phase.
The later failed isolated owner run and shutdown correction are recorded below;
other plan outcomes remain unverified until supplied. The separate 135-test
owner pass, agent EACCES results and successful JavaScript version probe remain
unchanged.

### Isolated emulator shutdown/restart finding and correction

**Owner evidence, 15 October 2026:**

| Stage                                    | Reported result                                                                                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seed assertions                          | Passed.                                                                                                                                               |
| Export                                   | Completed successfully.                                                                                                                               |
| CLI shutdown                             | Reported by the CLI.                                                                                                                                  |
| Required port availability before reload | Failed: 8086 remained occupied. PID 1664 was Java, parent PID 31164. Owner's read-only command-line classification identified the Firestore emulator. |
| Reload                                   | **Not run.**                                                                                                                                          |
| Full isolated test                       | **Failed, exit 1.** No current full persistence pass.                                                                                                 |

Classification: **application defect in runner shutdown synchronisation**;
the reason the Java process remained is **unknown**. Priority P1 for reliable
isolated verification. Affects PEER-22 and the supporting persistence evidence;
does not establish PEER-21 interactive Ctrl+C behaviour or a Tide outage.

Source supports the missing gate: `scripts/test-emulator.cjs` previously accepted
the direct pnpm child's successful `exit` as phase completion, then immediately
made one set of port checks before reload. It did not wait for CLI `close` or
eventual release of the Firestore/hub/logging listeners. The missing wait can
produce the observed failure if teardown is delayed. Source and owner evidence
cannot distinguish delayed teardown from an orphaned Java descendant, identify
parent PID 31164's role, or prove a process-tree root cause. No live processes
were inspected by the agent. These historical PIDs must not be treated as
current cleanup targets.

The recent launcher change preserves Node-plus-JavaScript-CLI invocation,
inherited stdio and existing signal behaviour for the owner's installation;
explicit `shell: false` matches the prior default. It does not itself establish
a new shutdown failure. Native pnpm.exe remains **Not tested: no native executable
found on PATH**, separate from this observed JavaScript-path run.

**Focused correction:** after a successful CLI exit, wait for `close` and all
three required ports (8086/4406/4506) to be bindable and released. The post-exit
wait has a monotonic 30-second deadline, 250 ms retry interval and per-probe
deadline of at most 1 second or the remaining budget. Apply it after seed before
reload, and after reload before the runner's final PASS. Initial occupied-port
checks still fail fast; immediate phase preflight is retained. No port owner
is adopted or automatically killed. This checks listener shutdown, not every
descendant's OS lifetime.

Require current-run export metadata before reload; missing metadata produces
`SOC_EMULATOR_EXPORT_MISSING`. Timeout produces `SOC_EMULATOR_SHUTDOWN_TIMEOUT`.
Both fail with exit 1, retain data and prevent a false final PASS. The unique
project/directory, pinned Firebase tooling, export/import arguments, seed/reload
assertions, nonzero-child failure handling and signal policy remain intact.
The unchanged real reload probe remains the check of exact saved records;
metadata presence alone is not proof of persistence.

**Fresh checks for this correction:**

- `pnpm exec node --test scripts/tests/demo-launchers.test.cjs`: exit 0,
  **39 passed**. All previous launcher cases plus delayed release of each port,
  delayed/missing close, timeout, a stalled probe, missing export metadata and
  post-reload shutdown failure. Virtual clocks, mocked children/sockets/files;
  no emulator service or actual export was started.
- Focused Prettier check: passed after expected formatting of the two edited
  code/test files. `pnpm exec node --check scripts/test-emulator.cjs`: exit 0.
- No backend TypeScript, dependency or authentication change; its owner-run
  135-test pass remains a distinct earlier result. No broader application suite,
  production build, real emulator, native pnpm probe or live backend was rerun.
- Corrected real reload: **unverified**. Do not mark PEER-22 or the isolated
  persistence run passed from these mocks or the earlier 8 October result.

Owner rerun from the repository root, only after the required ports are free:

```powershell
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in 8086,4406,4506 } |
  Select-Object LocalAddress, LocalPort, OwningProcess
pnpm run test:emulator
Write-Output "isolated probe exit: $LASTEXITCODE"
```

If a port still has an owner, stop and identify it locally before rerunning;
there is no blanket process-kill or data cleanup command. Retain the failed-run
export. Rerunning creates a new isolated directory/project rather than resuming
or overwriting that export. Docker is not required. Report seed/export, bounded
shutdown, reload/final PASS and actual final exit separately. Full success still
requires owner-verified reload PASS, final runner PASS and exit 0.

This correction changes only `scripts/test-emulator.cjs`,
`scripts/tests/demo-launchers.test.cjs`, the runbook and this triage document.
All other existing work, including the seven earlier dependency/documentation
changes, is preserved. No services, private configuration access, dependency
changes, process termination, data deletion, staging, commits or pushes occurred.

### Latest owner live verification — 15 October 2026

**Attribution:** owner-run evidence supplied on 15 October; no service or live
check was run by the agent for this documentation update. Screenshot findings
are owner-reported, not independently inspected screenshots.

- Live emulator-unavailable startup produced **SOC_STARTUP_EMULATOR**, exit
  **1**, with **no ready message**. F3's emulator connectivity failure branch
  now has live owner evidence. Other diagnostic branches remain separately
  pending; the 21 mocked startup tests and owner-run 135-test backend suite
  retain their previous attribution.
- Demo emulator, backend and frontend started successfully. Health returned
  **200** and unsigned incidents returned **401**. This adds actual Windows
  startup evidence for the checked launcher path, not native pnpm.exe coverage.
- Owner login and checked application pages worked **after TideCloak started**.
  This does not resolve the peer fresh-client **DPoP login**, which remains
  **unresolved**. No DPoP, PKCE, SDK, account or realm change is inferred.
- After stopping and restarting application services, owner-reported
  screenshots confirm the existing **Exposure Evidence** request, **both
  approvals**, the **cancelled Victim Host** request and matching audit events
  retained their displayed details. Evidence remains **locked**. This verifies
  the displayed records checked by the owner, not all stored data or an
  evidence-unlocking/Tide/Fabric flow.

**Limit:** interactive shutdown showed export starting without completion
confirmation, with repeated Ctrl+C. A backup was saved before restart. Recovery
of the displayed records does not prove graceful export completion, nor does
the report establish that recovery used the backup. Interactive graceful
shutdown/export is still **unverified**; do not mark PEER-21 fully passed.
Retain the backup and exports. The separately completed isolated seed/export/
reload test remains **PASS, exit 0** using actual JDK **23.0.2.0**, with both
shutdown gates completed. Its success and the two earlier failed isolated
runs remain separately attributed. The workaround does not prove the shim's
internal failure mechanism.

Native pnpm.exe remains **Not tested: no native executable found on PATH**.
F1/F3 are not declared fully verified: remaining checks include graceful
interactive export and the other live diagnostic branches. Peer fresh-client
login and Tide/Fabric verification remain separate pending work. These updates
do not change the original peer findings or historical audit counts.

### F10 approved proposal — historical design context

The wording and existing-layout scope below were subsequently approved by the
owner. The implementation and actual verification follow this preserved proposal.

Retain the existing sign-in layout, heading and **Continue with TideCloak**
button. Add one persistent in-page failure paragraph near that button. No
new screen, card, notification system or dependency is proposed.

**Proposed wording:** “We couldn’t complete sign-in. Please try again. If it
still fails, contact your project administrator.”

**Accessibility:** use `role="alert"`, readable contrast using existing styles,
and an ID referenced by the existing button's `aria-describedby` while the
message is present. After arrival from a failed callback, programmatically
focus the paragraph once (`tabIndex={-1}`); Tab then reaches the existing
retry button. Do not move focus repeatedly on re-render, rely on colour alone,
or automatically restart sign-in. A normal sign-in visit has no failure alert.

**SDK handling grounded in current source:** the installed
`@tidecloak/nextjs` re-exports `useAuthCallback` from `@tidecloak/react` 0.14.20.
Its `onError` handles provider errors, missing configuration, failed exchange
and exceptions. A missing verifier takes `onMissingVerifierRedirectTo`
directly when configured, without calling `onError`. Therefore:

1. Keep the SDK responsible for callback parsing, verifier checks and exchange.
   In application `onError`, ignore the error argument entirely and navigate
   to one fixed internal destination, proposed
   `/auth/signin?signin=failed`. Set `onMissingVerifierRedirectTo` to that same
   constant so that branch also receives safe feedback. No cause is diagnosed
   from an SDK message; the marker is a public presentation flag only.
2. The sign-in page recognises only the exact application-owned marker value
   `failed` and renders the fixed wording. Unknown values are ignored. Never
   copy callback parameters, error descriptions, codes, tokens or return URLs
   into the destination, message, logs or application storage. Do not echo
   even an unknown marker value. No new session/local storage is needed.
3. Replace the callback's current raw `error.message` rendering with the same
   fixed safe fallback if an error is rendered before navigation. Do not log,
   stringify, persist or attach the SDK error to telemetry. Application-owned
   login initiation catches synchronous throws and rejected promises from
   `login()` and shows the same notice without consuming the error payload;
   both existing sign-in buttons use that handler.
4. Preserve successful SDK callback navigation, loading/authenticated states,
   disabled unconfigured sign-in controls, the existing direct-callback visit
   recovery and all DPoP/PKCE/authentication behaviour. Retry is an explicit
   button action. Clear the visible failure when a new attempt starts, restore
   it on failure and prevent duplicate in-flight submissions without claiming
   success merely because `login()` returned.

**Proposed tests before implementation:** use existing Vitest/Testing Library
and mocked SDK/navigation; no real login or service is needed.

- Callback errors and the separate missing-verifier redirect both use exactly
  the fixed safe destination; success preserves the existing return behaviour;
  a plain callback visit still recovers without an authentication loop.
- The exact marker displays the proposed wording; absent/unknown markers do
  not. Keyboard/screen-reader semantics include the alert, button description,
  one-time focus and explicit retry. Loading/authenticated/configuration states
  retain their existing behaviour.
- Synchronous and asynchronous `login()` failures from either sign-in button
  show the same message; retry clears/restores it appropriately and duplicate
  clicks do not launch parallel attempts. No automatic login loop occurs.
- Inject synthetic secret sentinels in SDK error messages/objects and callback
  query values. Assert none reaches rendered text/HTML, redirect destinations,
  application console/telemetry or application storage. Include the callback
  fallback during delayed navigation. These checks cover application handling,
  not a guarantee about third-party SDK internals.

Put reusable notice/handling behaviour under focused component/hook tests,
with thin route wiring checks only where needed; respect existing frontend
testing conventions. After a later authorised implementation, run focused
tests, frontend lint/typecheck, production build and `git diff --check`, then
perform a separate owner keyboard/screen-reader check. No tests for this
unimplemented proposal have been run or claimed passed.

This is a review proposal, not a UI implementation prompt. Confirm placement,
wording, focus behaviour and the existing-layout scope before any implementation,
in line with the root `AGENTS.md` UI-design requirement. F10 remains
**confirmed / application defect / P2**, unimplemented. It improves failure
feedback; it does not fix peer DPoP login or change authentication.

### F10 implementation and verification — 15 October 2026

**Status:** implemented; automated checks passed; manual/browser verification
partial (latest results and investigation below). Original finding:
**confirmed / application defect / P2**, affecting
PEER-03, PEER-19 recovery and PEER-24. This improves feedback, not the peer
fresh-client DPoP login, which remains **unresolved**.

The sign-in page now delegates its unchanged layout to `SignInPanel`, wrapped
in Suspense for Next.js search parameters. It renders one `SignInFailureAlert`
beside the primary button, with the approved wording, `role="alert"`, focus on
mount and an accessible description on both existing sign-in controls. Normal
re-renders do not move focus again. Unconfigured controls remain disabled and
the old configuration warning is not shown as a second alert when failure
feedback is present.

`AuthRedirect` keeps `useAuthCallback` responsible for all callback validation
and exchange. Callback errors and the SDK's direct missing-verifier branch use
the fixed public presentation destination `/auth/signin?signin=failed`. Only
one exact marker value is accepted. Unknown/duplicate values and other URL
fields are never echoed; a delayed redirect has the same fixed safe fallback.
Both sign-in controls catch synchronous and asynchronous initiation failures
without inspecting, logging or persisting their payloads. No application auth
storage is added. Existing SDK success navigation and authenticated dashboard
navigation remain intact. State, nonce, PKCE, DPoP and backend access checks
are not replaced or weakened.

An explicit retry clears the notice and guards both controls against repeated
submission. Rejection restores the notice and enables retry. Resolution alone
does not establish authentication: controls remain guarded until navigation or
SDK state changes. There is no automatic login/retry loop.

**Actual agent verification, separate from owner live evidence:**

- Focused component/route run: **25 passed** (22 new component cases plus
  three existing sign-in route tests), using SDK/navigation mocks only.
- Full `pnpm --filter frontend test`: **120 passed / 13 files**, exit 0.
- Frontend typecheck and lint: both exit 0. Initial typecheck found an
  unsupported query option in a new test; it was fixed before the passing run.
- Targeted formatting and `git diff --check`: passed. Root-cwd formatting
  initially could not resolve the existing plugin; frontend-cwd formatting
  worked without dependency changes. Two unrelated formatter-only line-ending
  changes were restored; final formatting used explicit paths.
- Coverage includes safe callback failure/missing-verifier destination/fallback,
  synchronous and asynchronous initiation failure from either button, explicit
  keyboard retry, one-time focus/description, duplicate submission prevention,
  unchanged success/loading/configuration paths and synthetic-secret exclusion
  from application DOM, redirect destinations, logs and storage. SDK internals
  and actual browser/identity-server behaviour are not covered by these mocks.

**Still pending:** owner browser failure/retry and successful sign-in checks,
keyboard/screen-reader behaviour and light/dark contrast verification. Existing
owner screenshots and live diagnostic results predate F10 and remain separately
attributed. Production build not run because the normal Next build loads private
environment files, prohibited in this task. Owner command, separately:
`pnpm --filter frontend build`. Do not mark a build, browser check or peer DPoP
resolution passed from unit results.

Files for F10: the two thin auth pages; new `SignInPanel.tsx`,
`AuthRedirect.tsx`, `SignInFailureAlert.tsx` and `signin-feedback.ts`; two new
component test files; the existing sign-in test's navigation mock; this triage
and the runbook. Existing work, including all seven dependency/documentation
changes, is preserved. No services, private-file access, dependency/SDK changes,
Tide MCP, account/realm/configuration operations, commits, pushes or merges.

### F10 owner browser follow-up and SDK path investigation — 15 October 2026

**Separate owner evidence, not another automated or agent-run browser check:**

- Fixed alert preview and keyboard retry: **passed**.
- With token-endpoint blocking enabled, sign-in returned to the application's
  sign-in page. Subsequent explicit Continue clicks repeatedly returned/reloaded
  it. The fixed failure alert was **not confirmed**. Real callback-failure
  handling is **not passed / inconclusive**, not failed solely on an unobserved
  alert and not verified by returning to sign-in. User-triggered repetitions
  do not prove an automatic redirect/retry loop.
- DevTools reported “Request was blocked by DevTools” and “1 affected”, with
  source referencing `silent-check-sso.html`. This is a silent-SSO clue, not
  proof of the full runtime path or the number of SDK handlers exercised.
- After removing the rule and opening a new private window, normal owner
  login and dashboard functions **worked**. Same-tab failure recovery was
  not established. Peer fresh-client DPoP login remains **unresolved**.

**Test limitation:** the broad endpoint-blocking recipe previously suggested
by the agent can interrupt silent SSO as well as interactive exchange. It
does not reliably isolate the application's top-level callback. It must not
be described as a deterministic callback-failure test or pass.

**Source inspection supports feedback boundaries, not this run's exact cause:**

1. The application silent-SSO HTML only posts its location to its same-origin
   parent. It does not mount the application's callback component or F10 alert.
   SDK 0.14.20 initializes with `check-sso`; `_TideCloak_checkSsoSilently`
   catches failed iframe callback processing and resolves without authentication.
   Other silent iframe terminal paths also settle unauthenticated. This can
   bypass application `useAuthCallback.onError` entirely. An ordinary unsigned
   silent check is not an error to display.
2. The SDK React context exposes `initError`. IAMService may catch/emit an
   initialization error and finish ready/unauthenticated. Application
   `AuthBridge` omits that error state, while `SignInPanel` only handles the
   fixed marker and a rejected initiation promise. This is an application
   feedback coverage gap for observable init failures. SDK-swallowed silent
   failures may have no observable error state and need separate treatment.
3. Front-channel `IAMService.doLogin` does not return the underlying client's
   login promise. The SDK React wrapper awaiting it therefore does not ensure
   later login failures reach the app's catch. Existing mock rejection tests
   validate the application contract, not all real SDK propagation.
4. Top-level `useAuthCallback` has safe application failure/missing-verifier
   destinations, but `AuthRedirect` also has a plain-sign-in redirect based
   on the live query. SDK `_TideCloak_processInit` cleans callback parameters
   using `history.replaceState`. A competing direct-visit redirect after URL
   cleanup is a possible application race; the owner run does not establish
   that it occurred. Do not call the F10 fixed-marker branch broken without
   identifying whether it was reached and which navigation won.

**Historical next-step proposal, superseded by automated tests below:** the runbook's
**F10 owner browser results and silent-SSO investigation** section gives a
non-pausing static-logpoint check for application callback error, plain callback
redirect and SDK silent-SSO failure. Record only fixed branch labels, final
pathname, marker presence and alert presence, never query contents, raw SDK
errors, credentials or storage. No fabricated callback, verifier deletion,
state/nonce/PKCE bypass or persistent testing instrumentation is proposed.

Conditional smallest corrections, **not implemented**: guard plain callback
recovery with SDK callback/processing/error/success state if URL-cleanup racing
is confirmed; separately expose only a safe boolean for observable provider
initialization failure and reuse the alert. Neither catches a failure the SDK
deliberately treats as normal unauthenticated silent SSO. Do not replace SDK
validation, force every unsigned check into an error, change promise internals,
or add automatic retries. A later correction needs regression tests for provider
error propagation, callback URL cleanup and silent-SSO/interactive separation.

F10 remains **implemented / automated pass / partial manual verification**.
Real callback-failure alert/retry, missing-verifier browser behaviour and any
unreported screen-reader/contrast checks remain pending. Earlier 120-test,
typecheck and lint results are historical for the unchanged implementation,
not fresh checks of this investigation. Only triage/runbook changed; no code,
dependencies/SDK, private configuration, services, account/realm operations,
Tide MCP, commits or pushes. All existing work remains preserved.

### F10 focused automated investigation and concrete approval proposal (historical)

This proposal was subsequently approved and implemented. See the approved
correction below; original investigation results remain separately attributed.

The owner requested automated investigation instead of further DevTools tracing
or broad token blocking. Neither manual exercise is requested again. Only a new
test file and documentation were changed; all application/authentication and
SDK code remains unchanged pending explicit approval.

**Confirmed by new characterization tests:**

- **Initialization feedback gap:** executing the exact installed IAMService
  `_initFrontchannel` method with a rejected initializer emits `initError`
  followed by `ready(false)`, without persisting a token. Supplying this SDK
  state to the real application bridge and sign-in panel confirms that it stays
  unauthenticated but omits any safe failure flag/notice. Ordinary unauthenticated
  readiness is a separate, quiet non-error control case.
- **Callback fallback guard defect under controlled cleanup:** while the SDK
  reports a recognized callback in processing, failed or successful state,
  removing query parameters before the application's effect produces a plain
  sign-in redirect. In one controlled ordering it follows the fixed-marker
  error redirect. Installed SDK source really cleans callback URLs; effect
  ordering/cleanup is modeled in these tests. This proves the guard accepts
  the wrong condition, not that this ordering caused the owner's browser run.
- **Silent-SSO limitation:** executing the exact installed silent-SSO method
  with a mocked exchange rejection or iframe error resolves unauthenticated,
  rather than rejecting to the application callback handler. The original
  message origin/source gate rejects unrelated messages in the harness.
  A ready/unauthenticated result alone must not produce an error alert.

Test scope: public installed method text is parsed and executed unchanged in
an isolated VM; private collaborators, DOM, network and initialization are
doubles. Application bridge/panel/callback components run with controlled SDK
state. No real authentication, SDK patch or production validation bypass occurs.
This is not a full SDK/browser integration test. The cause of the inconclusive
owner run remains **unknown**; SDK login-promise propagation and provider/page
timing beyond the controlled cases remain limitations, not diagnosed causes.

**Actual new checks:**

- `pnpm --filter frontend test -- tests/unit/investigations/auth-feedback-boundaries.test.tsx`:
  initial run **7 passed / 3 failed**, due to the new test parser not recognising
  installed SDK function expressions.
- After fixing the harness only, ran the same file with
  `--testNamePattern silent`: **3 passed / 7 skipped**, exit 0. All **10 new
  characterization cases** have passed across these runs. These passes confirm
  current behaviour, including defects; they are not a correction verification.
- Frontend typecheck passed for the added test and its parser correction.
  Targeted formatting and `git diff --check` passed. No old full frontend,
  backend, launcher, browser or service check was repeated. The historical
  120 frontend tests and lint pass retain their earlier attribution.

**Smallest concrete correction, not applied:**

| Production file                                 | Proposed change                                                                                                                                                                                                       |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/types/auth.ts`                    | Add optional `initializationFailed?: boolean`; existing consumers treat absence as false. No raw-error field.                                                                                                         |
| `frontend/src/providers/AuthProvider.tsx`       | Derive `Boolean(tc.initError)`, expose only this presentation boolean and include it in memo dependencies. Authentication, tokens and roles remain SDK-owned.                                                         |
| `frontend/src/components/auth/SignInPanel.tsx`  | Reuse the existing fixed alert when that flag is true and submission is not pending; retain one alert, focus, explicit retry and duplicate-submission guards. No success inferred from `login()` resolution.          |
| `frontend/src/components/auth/AuthRedirect.tsx` | Gate plain direct-visit recovery on SDK `!isCallback && !isProcessing && !isSuccess && !Boolean(error)`; remove the live-query inference. Preserve fixed failure/missing-verifier and successful-return destinations. |

The runbook contains the exact proposed guard and follow-up regression scope.
The boolean is not an error message or diagnostic payload. This correction
addresses observable provider failure and the unsafe fallback condition only;
it cannot distinguish a swallowed silent failure from a normal unsigned
session. It will not patch SDK promise internals, disable silent SSO, add
automatic retries or change PKCE/state/nonce/DPoP, accounts, realm, or evidence
unlocking. No authentication change will be applied before owner approval.

After approval, update the characterization expectations for these defects and
run only checks affected by the correction. One short final browser check:
fresh private window, one normal owner sign-in, dashboard works and evidence
still locked; credentials stay with the owner. No logpoints or broad blocking.

Preserved owner evidence: **preview/keyboard passed**; **blocked-token
failure-to-alert inconclusive**; **normal login after removing blocking
passed**; **peer fresh-client DPoP unresolved**. No browser reproduction or
resolution is inferred from these new tests. Existing dependency changes,
exports and all other work remain preserved; no services, private files,
dependency/SDK/configuration changes, Tide MCP, commits, pushes or merges.

### Owner verification after the latest correction — 16 October 2026

**New owner browser evidence, separate from automated coverage: passed.**
Fresh **Edge InPrivate** login with blocking rules removed succeeded; dashboard
loaded **without the failure alert**, incident pages worked and protected
evidence remained **locked**. The approved correction's short normal-login
browser checklist is complete for these observed pages. No broader SDK failure,
screen-reader, unlock or peer DPoP verification is inferred.

**Latest owner emulator shutdown:** **“Export complete” followed by shutdown**
was observed. This confirms export completion for the reported session only;
it does not establish a new reload, final runner exit code, free test ports or
all descendant processes exiting. The earlier two failed isolated runs and
interactive run with repeated Ctrl+C/no completion confirmation stay historical,
with exports/backup retained. The separate actual-JDK isolated seed/export/
reload **PASS, exit 0**, retains its own attribution and verified-workaround
scope; the shim's internal failure mechanism remains unconfirmed.

Evidence separation remains explicit:

| Evidence                                                                                 | Status                                                                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Earlier owner preview and keyboard retry                                                 | **Passed**; presentation/keyboard evidence.                                                       |
| Earlier owner blocked-token failure-to-alert                                             | **Inconclusive**, not a real callback-failure pass; cause unknown.                                |
| Earlier normal login after removing blocking                                             | **Passed**, separately reported in a new private window.                                          |
| 16 October post-correction Edge InPrivate login/dashboard/incident pages/locked evidence | **Passed**, owner browser evidence.                                                               |
| Previous correction's 49 affected automated tests / four files                           | **Passed**, four unchanged SDK cases skipped; distinct from browser evidence and not rerun today. |
| Peer fresh-client DPoP login (F8)                                                        | **Unresolved / blocked / Tide integration / P1**.                                                 |

**Next highest-priority unresolved item: F8. Smallest actionable next step:**
prepare a read-only compatibility comparison of pinned SDK **0.14.20**, the
peer's TideCloak image identity and supported client-setting labels from public
guidance/installed SDK source and existing nonsecret peer records. Identify any
missing SDK/image version first and obtain only that missing nonsecret identity
if needed. Do not repeat owner login, broad blocking or DevTools tracing. No
private settings, payloads, headers, credentials, DPoP/PKCE changes or SDK upgrade
is justified by current evidence. Owner success does not resolve a different
peer client/environment, and reported `invalid_dpop_proof` does not establish a
general Tide outage. This is a proposed next task, not a change made today.

Documentation-only update: no tests, typecheck, lint, build or services rerun;
no application/configuration/account/dependency changes, private-file access,
Tide MCP, commits or pushes. All existing work remains preserved.

### Approved F10 four-file correction — implemented, owner happy-path check passed

The owner explicitly approved the proposed four-file presentation/fallback
correction. It is now implemented; no further authentication redesign was made.

| File                                            | Actual change                                                                                                                                                                                       |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/types/auth.ts`                    | Optional `initializationFailed?: boolean`, absent treated as false. No raw SDK error field.                                                                                                         |
| `frontend/src/providers/AuthProvider.tsx`       | Derive `Boolean(tc.initError)`, expose only that presentation boolean and include it in memo dependencies.                                                                                          |
| `frontend/src/components/auth/SignInPanel.tsx`  | Include `!submitting && initializationFailed` in the existing generic-notice condition. Retain one notice, fixed wording, focus and explicit guarded retry.                                         |
| `frontend/src/components/auth/AuthRedirect.tsx` | Gate direct-visit recovery on SDK callback/processing/success/error-presence state instead of reparsing mutable query parameters. Preserve success and fixed failure/missing-verifier destinations. |

The converted investigation tests now assert corrected application behaviour,
not the presence of defects. Added regressions verify error arrival/clearance
after readiness, memo updates, no raw-error property reads or application
logging/storage, keyboard retry, both controls pending, stale init error with
authenticated SDK state, and callback-state guards. The existing callback test
double was corrected to report a genuine direct visit with no active callback.
Four installed-SDK characterization tests are retained unchanged and were not
rerun for this application-only correction.

**Actual new verification:**

- Affected auth bridge/panel/callback/regression tests: **49 passed across four
  files, four unchanged SDK cases skipped**, exit 0. The name-filtered run used
  `approved application feedback correction|SDK callback feedback|safe sign-in feedback|AuthProvider / useAuth`.
- Frontend typecheck: exit 0. Frontend lint: exit 0.
- Explicit-file formatting checks and `git diff --check`: passed.
- No unrelated unit/launcher/backend/SDK scenario, browser or service check
  was repeated. Earlier full-suite 120-test results remain historical. No
  production build was run because the normal Next build reads prohibited
  private environment files; owner build verification remains pending.

Status: **approved correction implemented / affected automated checks passed /
post-correction owner normal-login browser check passed on 16 October**. This does not establish the
cause of the owner's inconclusive blocked-token run. Silent SSO returning only
ordinary unauthenticated state is **not** labelled failure. SDK validation,
state, nonce, PKCE, DPoP, success navigation, backend authorization and locked
evidence are preserved; SDK files and settings were not patched.

One short final owner check, using the existing running application: fresh
private window at normal sign-in (no marker, logpoints or network blocking),
normal private credential entry, dashboard works and evidence remains locked.
Failure/URL-cleanup regression is covered by automated tests; no repeated broad
blocking or previously passed preview/keyboard exercise is requested.

Owner evidence stays separate: **preview/keyboard passed**; **blocked-token
failure-to-alert inconclusive**; **normal login after removing blocking
passed**; **peer fresh-client DPoP unresolved**. The later 16 October owner
normal-login and locked-evidence browser pass is explicitly recorded above;
it is not a live callback-failure pass. Original peer findings, audits,
emulator results, failed-run exports
and all existing work are preserved. Changes this turn are the four approved
production files, two focused test files, triage and runbook. No dependencies,
SDK/configuration/account operations, private-file inspection, Tide MCP,
service operations, commits or pushes.

### Owner-verified isolated emulator workaround — 15 October 2026

**Latest owner-run evidence: PASS using the existing actual JDK `java.exe`,
version 23.0.2.0, first on a temporary terminal-only PATH.** Seed passed,
export completed, reload passed, both shutdown gates completed, final runner
PASS appeared and exit code was **0**. Original PATH was restored in `finally`.
This is actual owner-run verification, separately attributed from the agent's
39 mocked tests, the earlier owner-run 135 backend tests and the historical
8 October results.

Status: **verified workaround for isolated seed/export/reload and shutdown**.
The earlier shutdown finding remains confirmed by two failed owner runs;
its internal root cause and classification remain **unknown**, with local Java
launcher/tooling integration implicated by the successful workaround. Selecting
the actual JDK succeeded; this does **not** prove how the Oracle shim failed
internally or establish the historical parent process's identity. No code or
dependency fix is claimed, and the default shim path remains unverified.

The runbook's **Owner-verified JDK workaround** section provides a portable
normal-PowerShell example: prompt for a user-selected existing JDK's actual
`bin\java.exe`, reject the known shim, check executable lookup, temporarily
prepend that directory, run the existing `pnpm run test:emulator`, report the
exit code and restore the original PATH in `finally`. No personal JDK path,
installation, permanent PATH change or process-kill workaround is required.
Each run still uses fresh isolated data; retain both earlier failed exports.
Docker is not required. Other JDK versions need their own verification.

The two earlier failures below remain historical evidence. Their failed or
pending restart status is superseded only by this successful JDK-workaround
run; their observations and original peer findings are preserved. Historical
parent diagnostics remain optional investigation of the cause, not a
prerequisite to using the verified workaround.

At the time of this isolated run, separate pending checks were interactive
keyboard **Ctrl+C**, live backend diagnostics, peer login and Tide/Fabric
verification. See the latest owner live verification above for subsequent
limited results and remaining checks. Native pnpm.exe remains
**Not tested: no native executable found on PATH**. The successful JavaScript
pnpm probe remains separate evidence. Do not mark F1/F3 fully verified or
infer peer login/Tide/Fabric success from this isolated emulator result.

This update changes only this triage document and the runbook. The agent did
not rerun the emulator, start services, change PATH, code, dependencies,
private configuration or accounts, or commit/push. All existing work and
exports remain preserved.

### Second owner timeout and installed Windows lifecycle investigation (historical)

**Owner evidence, 15 October 2026, separate from the first run and mocks:** the
corrected runner timed out after 30 seconds. Seed and export passed; reload
never started. Java PID **31000**, started **13:50:12**, still owned 8086; its
parent was **27072**. Owner classification confirmed Firestore emulator use.
The owner manually stopped PID 31000. This was not automatic cleanup. Exports
must remain retained. The bounded gate is a detection safeguard, **not a verified
shutdown fix**. This run's restart verification was **failed / reload Not run**;
see the later successful JDK-workaround evidence above.

Inspection of both installed public `firebase-tools@14.16.0` cache copies
establishes that `emulators:exec` runs the probe, exports, and performs its own
shutdown. Firestore is spawned as `java` with `detached: true`, without a shell.
`downloadableEmulators.stop` calls `kill('SIGINT')` on its tracked child and
waits for that child's `exit`; it does not stop a descendant tree. Registry
“Stopping” messages precede the stop attempt and stop errors are caught. This
explains why shutdown wording alone is insufficient evidence. The repository
pnpm launcher's `shell: false` does not introduce a Firestore shell, and its
Windows Ctrl+C policy does not perform normal post-seed CLI shutdown.

The two installed shutdown source files have identical SHA-256
`2fea3ea52235b3f3e9cd75e3c14c2e8a948a30cd98958ed2bd2d894823d45a6f`.
Which cache copy ran was not recorded. Current `java` lookup resolves to Oracle
`javapath\java.exe`, whose binary metadata says **Shim Console Launcher** /
**shimconsole.exe**, version **23.0.2.0**. Node's
[Windows kill semantics](https://nodejs.org/api/child_process.html#subprocesskillsignal)
make `kill('SIGINT')` abrupt termination of the targeted process, not console
Ctrl+C. A shim being stopped while its JVM child survives is a specific
**hypothesis**; PID 27072's binary identity has not been established. Do not
attribute this conclusively to the shim, the pnpm change, readiness timing or
a general Windows failure.

Status: **needs reproduction / missing process identity**. Classification:
**unknown**, with local Java launcher/tooling integration under investigation.
Priority: **P1** for trustworthy isolated persistence verification. Smallest
next diagnostic: selected executable/start-time/original-filename metadata for
parent 27072; if it has exited or its PID was reused, capture the live 8086
owner and immediate parent while seed runs in a future explicitly authorised
owner run. The runbook gives exact read-only normal-PowerShell commands without
command lines, private files or service startup. Agent CIM access failed in
the sandbox and in one approved retry; no further retry was made.

No lifecycle correction or new regression coverage is claimed without that
identity evidence. The 30-second bound, export check, isolation and existing
39 mocked runner tests remain unchanged. No services, dependency/PATH changes,
process termination, export reads/deletion, private-file access, commits or
pushes occurred in this investigation. Owner-run 135 backend tests, the actual
JavaScript probe and native pnpm.exe **Not tested: no native executable found
on PATH** retain their separate attribution. F1/F3 are not upgraded to fully
verified by this investigation. Original peer findings above are preserved.

Fresh agent check: all **39** existing mocked launcher/runner tests passed
again with `pnpm exec node --test scripts/tests/demo-launchers.test.cjs`.
This is a new mocked result, not another actual Windows Java lifecycle test.

### Scope and safe working tree

Files changed for this follow-up: `scripts/demo.cjs`,
`scripts/test-emulator.cjs`, new `scripts/pnpm-launcher.cjs`, new
`scripts/check-pnpm-launcher.cjs`, new `scripts/tests/demo-launchers.test.cjs`,
`backend/src/server.ts`, new `backend/tests/unit/server.test.ts`,
`docs/SOC-POC-RUNBOOK.md` and this existing untracked triage document.

The seven pre-existing dependency/documentation files retain their starting
SHA-256 hashes. They were not reverted, overwritten, reapplied or staged. No
package, lockfile, build approval policy, authentication, DPoP, PKCE, Tide SDK,
account, realm, protected-evidence or F10 change was made. No private application
configuration/adapter was read; no application/emulator service or Tide MCP
call was started. Temporary loopback HTTP attempts belonged only to the test
suite. No commit, push, merge or deployment occurred. Changes remain unstaged
for review; the feature branch is not declared fully verified or complete.

## F8 local integration investigation — 16 October 2026

**Status remains blocked / Tide integration / P1.** Original peer symptoms and
attribution above are retained. No live login was reproduced in this investigation.

### Confirmed source facts

- Tested SHA `bc2f22b` and current source pin Tide SDK packages to `0.14.20`.
  Installed `@tidecloak/js` supports DPoP; absence of SDK support is not the defect.
- Its `buildInitOptions` forwards `useDPoP` only when explicitly supplied and
  preserves PKCE `S256`. The application config supplies no such opt-in.
  Public-client mode and `setupRequestEnclave: false` do not enable DPoP.
- The installed token exchange generates a proof only with an initialized DPoP
  provider. SDK initialization requires advertised signing algorithms; strict
  mode rejects unsupported discovery. No installed SDK files were changed.
- Both application API clients (`incidents.ts`, `access.ts`) send Bearer tokens.
  Backend middleware verifies JWTs but has no DPoP proof/binding/replay validation;
  API CORS does not allow the DPoP header. No DPoP verification page is present.
  A browser-only opt-in would therefore be an incomplete security change.
- Confirmed documentation defect: the browser config comment incorrectly said
  server-side JWKS verification was not wired. It is implemented separately.
  That comment and public template guidance now describe the actual boundary.
  Template variable names/values and runtime authentication are unchanged.

### Evidence limits and compatibility

The peer report records `tideorg/tidecloak-dev:latest`, a pre-existing
`mytidecloak` container, and explicitly says version/digest were not obtained.
A mutable tag does not establish an exact server version or an incompatibility
with SDK 0.14.20. No version-specific compatibility guarantee was found in the
focused official guidance. Effective peer client policy and original proof
behaviour remain unknown; private settings were not inspected. No teammate
information/action is requested. The mismatch can explain a missing-proof
rejection **if** the effective client requires DPoP; it does not prove the cause
of that historical exchange or a general Tide outage.

[Official DPoP guidance](https://docs.tide.org/Core-Concepts/dpop) and the
[Next.js guide](https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-how-to-guide)
were checked on 16 October. They describe explicit opt-in, an origin verification
page, proof-aware API calls and resource-server verification. They are not a
version compatibility matrix. Do not copy an unpinned latest verification page
into the pinned application or treat enabling one flag as a fix.

### Smallest safe next step requiring approval

No runtime correction is justified within the current Bearer design. Approve a
separately scoped, coordinated DPoP implementation proposal before changing it:

1. Use the pinned SDK's strict opt-in only after checking its prerequisites and
   obtaining/reviewing a matching verification-page artifact. Restrict its issuer
   and client; scope any framing/header exception to that page.
2. Route incident/access API requests through proof-aware SDK transport.
3. Add backend verification of proof signature, token key binding, HTTP method
   and URL, freshness and replay protection, with appropriate CORS/nonce handling.
4. Test login/refresh/logout, success and missing/invalid/replayed proofs before
   any owner-only live credential entry. Preserve JWT verification and PKCE,
   state, nonce, authorization and locked evidence throughout.

This is an approval boundary set by the current task, not authorization to alter
realm/client policy. Do not disable DPoP, change PKCE, patch SDK files or upgrade
packages. Historical owner login success does not resolve peer F8.

### Focused automated verification

New `frontend/tests/unit/investigations/dpop-integration-contract.test.ts` runs
exact installed SDK functions with synthetic collaborators and the application
config with synthetic public variables. It checks opt-in absence, strict-option
forwarding, retained S256/verifier, proof-present/proof-absent branches and
rejection propagation without retry. These are mocked contract checks, **not**
a live HTTP 400 reproduction, full SDK/browser validation or real Tide proof
verification. Final command results are recorded below after execution.

Existing evidence remains separate: preview/keyboard retry passed; blocked-token
failure-to-alert inconclusive; normal owner login passed (including 16 October
Edge InPrivate); peer fresh-client DPoP login unresolved. No broad token blocking,
service operations, account/configuration changes or private-file access occurred.

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

## Week 8 publication review — 16 October 2026

**Scoped fixes ready for final commit review; recorded execution gate passed.**
Review covered the full tracked diff plus new launcher, startup and auth sources
and regression tests, against HEAD `bc2f22bae66b6283c0acef0841cecfea28157a3c`.
No material code defect was established in F1, F3, the emulator gates or F10.
No application code was changed during this review. This is not full Week 8 or
Tide acceptance, and it is not an independent fresh-client success claim.

### Completed changes and evidence boundaries

| Area                         | Implemented / reviewed                                                                                                                                                                                                                   | Actual evidence and remaining limit                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1                           | Shared shell-free pnpm invocation: JavaScript entry through Node, Windows native executable directly; arguments, environment, exits, export/import and existing signal handling retained.                                                | Actual Windows JavaScript version probe passed. Latest launcher/runner suite: 39 mocked tests passed. Native pnpm.exe: **Not tested: no native executable found on PATH**. Do not install another pnpm or require this optional executable to publish the verified JavaScript path.                                                                                                                                         |
| F3                           | Fixed configuration/emulator/adapter/application/binding stage codes and recovery strings; no raw caught data; adapter validation before application/listener startup.                                                                   | 21 mocked startup cases passed; backend typecheck/lint/build passed. Owner normal-terminal suite on 15 October: 135 tests / nine files passed. Earlier agent EACCES failures remain separately attributed. Owner live emulator-unavailable case: SOC_STARTUP_EMULATOR, exit 1, no ready message. Other live diagnostic branches are not claimed verified.                                                                   |
| Emulator safeguards          | Wait after successful child exit for close and all three ports to bind/release, with 30-second monotonic bound; fresh export metadata required; no final PASS until reload shutdown passes. No process killing or data deletion.         | Owner 15 October actual JDK 23.0.2.0 workaround: seed/export/reload/both gates/final PASS, exit 0; terminal PATH restored in finally. Two earlier failed runs remain historical. This is a verified workaround, not proof of a Java shim failure mechanism or a guarantee every descendant exited. The bound applies after CLI exit, not to the whole emulator run.                                                         |
| F10                          | One fixed accessible failure alert; SDK callback/missing-verifier/initiation paths; boolean initialization-failure presentation; SDK-state callback guard; explicit retry and duplicate-submission prevention. SDK validation unchanged. | Original full frontend suite: 120 / 13 files passed before the final correction. Final correction: 49 affected tests / four files passed, four unchanged SDK cases skipped; typecheck/lint/format passed. Owner preview/keyboard retry passed. Owner fresh Edge InPrivate on 16 October: dashboard without failure alert, incident pages worked, evidence locked. Real blocked-token failure-to-alert remains inconclusive. |
| Live application / retention | Existing auth/database/evidence boundaries preserved.                                                                                                                                                                                    | Owner reported demo emulator/backend/frontend startup, health 200, unsigned incidents 401 and working owner login/pages. Screenshots after restart retained displayed request/approval/cancellation/audit details; a backup existed. Recovery does not prove export completion. Later 16 October shutdown separately showed Export complete then shutdown.                                                                  |

### Material publication gates and necessary verification only

1. **Production frontend build gate passed — owner evidence, 16 October 2026.**
   Owner reports `pnpm --filter frontend build` passed with **exit 0**, using
   **Next.js 16.3.8**, after the latest F10 correction. This is a normal-terminal
   owner result, separate from agent checks; no build was rerun and no private
   configuration/build output inspected. Earlier pending-build statements in
   dated sections remain historical. This does not verify peer DPoP or establish
   that all dependency vulnerabilities are fixed. No repeat is required for
   this documentation-only update.
2. **Review packaging must include every new source/helper/test.** A tracked-only
   diff omits the shared launcher and auth components. Use the exact groups in
   the handoff; do not stage the entire dirty tree. Handoff and build status span
   old dependency hunks and new owner/review summaries; both need hunk separation in
   any future approved commit preparation. No staging is authorized now.
3. **After the build and final review, freeze the publication candidate identity.**
   Current checks concern an uncommitted worktree; HEAD is still the peer-tested
   baseline, not the fixes. A later owner-authorized commit/CI run must identify
   the actual published SHA. No commit/push/CI dispatch is part of this review.

Do not repeat passing unchanged launcher/backend/auth suites, JavaScript probe,
actual-JDK isolated reload or normal owner login. Native pnpm.exe, additional
live startup failures, screen-reader/contrast checks and a narrowly controlled
real callback failure remain limitations, not mandatory repeats for a scoped
review publication. Do not repeat the inconclusive broad token-blocking test or
request DevTools tracing. They prevent claiming complete platform/browser
coverage, not documenting the implemented feedback and current evidence.

F8/peer login, independent fresh-client onboarding, F9 client-mode uncertainty
and genuine Tide/Fabric authority/decryption/expiry remain outside this fixes
publication. Protected evidence remains locked. Historical audit counts remain
separately attributed; no fresh audit or dependency remediation claim is made.

### DPoP proposal retained for future review — implementation deferred

Owner decision on 16 October: **do not implement the migration or change any
TideCloak security setting; F8 remains unresolved**. The earlier detailed review
proposal is retained as a future design, not a selected dependency or permission.
Its review record is:

- Frontend strict `useDPoP` with ES256 in config, guarded SDK secureFetch in the
  bridge and both API helpers, all five existing caller files updated. Preserve
  PKCE S256, state/nonce, SDK callback/refresh/logout and silent SSO. Do not add
  the provider's unforwarded strictStorage option or assume persistent storage.
- Reviewed version-matched verification HTML outside public, served only at the
  issuer/client hex path after strict matching, with reviewed CSP hashes and
  narrowly scoped framing/header exceptions. The matching artifact is missing
  from the installed package; upstream main is not a version pin.
- Enforce DPoP on all protected routes, including /me and the locked evidence
  endpoint. No protected Bearer fallback; health/preflight remain public.
- Preserve offline JWT/JWKS and existing client/role checks; add reviewed proof
  signature/key binding, access-token hash, method/external URL, freshness and
  shared atomic replay/nonce validation. Proposed policy values (60-second age,
  30-second future skew, short-lived resource nonce) are not approved settings.
- Candidate maintained backend validator: oauth4webapi. No version selected or
  installation approved. Its RFC 9068 token-profile, expected audience and
  offline-key compatibility are unresolved; do not waive checks or invent a
  cryptographic fallback. Nonce/replay state would need separate validation.
- Public API audience/external URL contract, Firestore security-state retention,
  exact server/image support and any client requirement/audience-mapper changes
  are separate approval gates. No SDK/server upgrade or account change selected.
- Future acceptance requires real-library synthetic positive/negative tests,
  multi-instance replay/nonce tests, then minimal owner-only credential entry
  for live login/refresh/reload/logout, protected read/isolated write and proof
  rejection checks without capturing authentication artifacts. These tests have
  not been implemented or run. Owner's existing login does not resolve peer F8.

### This review's checks and safe scope

Only documentation changed in this preparation. Existing source and test
verification was reviewed, not rerun. Fresh checks passed: new Markdown section
formatting, git diff --check, all 32 changed paths covered by the commit groups,
29 other files byte-identical to the review baseline, and pre-existing handoff
content preserved byte-for-byte. Targeted document scan found no private-key
blocks or access-key identifiers; that limited scan is not a general security
audit. No services/private files/Tide MCP/dependency changes or Git mutations
occurred. Existing learning ISSUE 010/011 were updated in place; ordinary
launcher/backend/application issues were not invented as new Tide issues.
