# SOC independent laptop test plan

Prepared 8 October 2026. **Independent startup is not verified.** Follow
[the runbook](SOC-POC-RUNBOOK.md) and record results using
[the results template](SOC-PEER-TEST-RESULTS-TEMPLATE.md).

## Version, prerequisites and evidence rules

Repository: https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git.
Branch: `feature/soc-emergency-access-poc`. Current HEAD is
`27b09cbc52b6fb6ed69803b38c55e7f29c6699ee`, but required implementation is
uncommitted. **Do not test that SHA as the complete candidate.** Begin after the
owner supplies the reviewed, published full test SHA. Record that SHA for every
run; never transfer results to another version automatically.

Prerequisites: fresh clone on the tester's laptop; their own local TideCloak
realm/client/adapter; Firestore emulator, backend and frontend ready; no cloud
credentials; four distinct Tide-linked test identities with governed realm roles.
Use only aliases in shared results:

| Alias | Matching recognised role | Browser separation          |
| ----- | ------------------------ | --------------------------- |
| A     | soc-analyst              | Dedicated browser profile A |
| B     | soc-supervisor           | Dedicated browser profile B |
| C     | soc-team-leader          | Dedicated browser profile C |
| D     | soc-manager              | Dedicated browser profile D |

All four roles have equal request/review rights. A single identity with several
roles does not satisfy the distinct-user requirement. InPrivate windows in the
same browser may share a session; separate profiles are the preferred method.
Verify the active alias privately before each action. Never copy usernames,
emails, actor-reference values, tokens, cookies, enrollment links, full callback
URLs or request payloads into results. Use synthetic reasons without identifiers.

Record Pass, Fail, Blocked or Not run. A UI-hidden action tests the UI only;
server enforcement requires the relevant harness/probe result. Never claim a
live security result from mocked units or synthetic verified-identity fixtures.
Do not edit storage, manufacture authority or replay authentication to finish a
case. Keep existing demo records. After two approvals a scope stays authorising;
use another incident/resource or requester for later cases instead of resetting it.

## Numbered cases

### 1. PEER-01 — Clean clone and readiness

- Prerequisites: published test SHA and resolved fresh-realm setup blockers.
- Steps: clone/verify SHA; follow native setup; keep emulator, backend and frontend
  in separate terminals; check Tide status, API health and sign-in page.
- Expected: independent services on the tester's laptop; no connection to the
  owner's laptop; backend reports ready; no cloud fallback or private data copy.
- Actual result:
- Status:

### 2. PEER-02 — Four accounts and role equality

- Prerequisites: A–D independently linked and assigned matching roles via QEA.
- Steps: manually log in in each profile; visit Dashboard, My Requests, Approvals
  and Audit; each alias creates a pending request and reviews another alias's
  request using fresh scopes. Cancel or reject these requests before quorum.
- Expected: all four can request and review; no manager-only or analyst-only
  action; accounts remain distinct. Missing membership is a setup issue until
  the effective governed assignment is verified.
- Actual result:
- Status:

### 3. PEER-03 — Login, logout and signed-out protection

- Prerequisites: A profile plus a separate fresh signed-out profile.
- Steps: sign in manually; reach Dashboard; log out; revisit Dashboard, requests,
  approvals, audit and an incident in the signed-out profile. Use the runbook's
  unauthenticated incident HTTP check without a token.
- Expected: sign-in works; logout clears app access; protected content is absent
  while signed out; unauthenticated API returns 401. Do not inspect response
  identity fields or authentication storage.
- Actual result:
- Status:

### 4. PEER-04 — Dashboard and incident details

- Prerequisites: A signed in; backend healthy.
- Steps: inspect dashboard rows, filters/counts and links; open INC-1001 and
  another incident; inspect general information, indicators and timeline.
- Expected: safe synthetic incident metadata and consistent navigation; severity
  belongs to the intended row/cell; no protected value is exposed.
- Actual result:
- Status:

### 5. PEER-05 — Evidence stays locked

- Prerequisites: an incident with no approved authority.
- Steps: inspect Victim Host, Exposure Evidence and Suspicious Process; refresh
  and navigate away/back; repeat after one approval and after case PEER-15.
- Expected: all protected values remain Locked; no ciphertext pretending to be
  protection, active grant, evidence countdown or plaintext appears. This is a
  safety-check pass, not genuine encryption/decryption acceptance.
- Actual result:
- Status:

### 6. PEER-06 — Request validation

- Prerequisites: A; unused incident/resource scope; request form open.
- Steps: try blank/whitespace/19-character and over-500-character reasons; omit
  duration or acknowledgement; then submit a trimmed 20–500-character synthetic
  reason, one resource, a duration and acknowledgement.
- Expected: invalid values show clear errors and create no request; valid input
  creates one pending request with read-only permission and matching context.
- Actual result:
- Status:

### 7. PEER-07 — Duration choices and units

- Prerequisites: normal demo backend with short-duration mode off.
- Steps: exercise 15, 30 and 60 minute selections on fresh scopes, cancelling
  pending requests between trials; inspect displayed duration/history.
- Expected: 900/1800/3600 seconds represent 15/30/60 minutes consistently. No
  60-second option normally. Optional trusted demo mode labels 60 seconds clearly;
  it does not establish any working evidence-access or expiry period.
- Actual result:
- Status:

### 8. PEER-08 — Ownership and safe request details

- Prerequisites: A's pending request; B signed in.
- Steps: inspect A's My Requests and details, then B's My Requests and the same
  detail route. Check cancellation availability and B's review availability.
- Expected: A's request is in A's list, not B's list; only A may cancel; B may
  review. Recognised SOC users may see safe request details for review/audit;
  that visibility is intended and never grants evidence access.
- Actual result:
- Status:

### 9. PEER-09 — Duplicate pending requests

- Prerequisites: A; unused incident/resource; two independently opened form tabs.
- Steps: submit the same requester/incident/resource from both forms; repeat
  with near-simultaneous submissions; refresh My Requests.
- Expected: at most one open request for the scope; conflicting new operation
  is rejected (409 when it reaches the API), with useful refresh/recovery text.
  An identical idempotent retry may return the existing request without duplication.
- Actual result:
- Status:

### 10. PEER-10 — Cancellation and re-request

- Prerequisites: A's pending request with zero or one approval.
- Steps: A cancels; refresh details/history/Audit; A submits a new request for
  the same incident/resource; confirm another alias cannot cancel it.
- Expected: old request stays cancelled and retained; new pending request has
  its own lifecycle; request.cancelled is retained; evidence stays locked. An
  authorising request cannot be cancelled using the pending-only operation.
- Actual result:
- Status:

### 11. PEER-11 — No requester self-approval

- Prerequisites: A's pending request.
- Steps: A opens details/Approvals; verify no self-review action; run PEER-22
  for the service-level exclusion assertions without crafting live token calls.
- Expected: A cannot approve or reject their own request. UI absence and probe
  denial are recorded separately; fixtures do not prove a live JWT self-review
  attempt. Mark that live API subcheck Blocked if no approved harness exists.
- Actual result:
- Status:

### 12. PEER-12 — First other reviewer

- Prerequisites: A's pending request; B ready to review.
- Steps: B approves once; A refreshes details and the incident.
- Expected: one approval, request pending, evidence locked; request.approved
  retained. B does not become a requester or evidence holder.
- Actual result:
- Status:

### 13. PEER-13 — No duplicate reviewer approval

- Prerequisites: PEER-12; two B tabs opened before first approval if possible.
- Steps: refresh B's view; try a second available/stale approval from B; compare
  count/history. Run the concurrent duplicate-approval assertions in PEER-22.
- Expected: at most one B approval; repeat review unavailable or rejected with
  409 for a new operation; same-operation replay adds no decision/audit event.
  Two roles or two browser sessions for B still count as one user.
- Actual result:
- Status:

### 14. PEER-14 — Rejection reason and subsequent re-request

- Prerequisites: a separate A pending request; C reviewer; no quorum yet.
- Steps: C tries rejection without a reason; then rejects with a trimmed
  1–500-character synthetic reason; A refreshes details/Audit and re-requests.
- Expected: reason required; invalid rejection records no decision; valid
  rejection retains reason/history; a new request is allowed; evidence locked.
- Actual result:
- Status:

### 15. PEER-15 — Two distinct other reviewers; unavailable authority

- Prerequisites: PEER-12 with B's one approval; C distinct from A and B.
- Steps: C approves; A refreshes details, incident and Audit; D opens the old
  request and attempts a further review only if the UI offers it.
- Expected: exactly two distinct other approvals; authorising with unavailable
  Tide authority; authority.failed retained; evidence still locked; no active
  time or successful decryption. Further review is unavailable/no longer pending.
  This passes the application's failure-to-grant check; full Tide acceptance is Blocked.
- Actual result:
- Status:

### 16. PEER-16 — My Requests, Approvals, history and Audit

- Prerequisites: pending, cancelled, rejected and authorising test requests.
- Steps: visit all four screens in A–D; refresh latest; follow request/incident
  links; use older-page controls when enough records exist; compare synthetic
  reasons, durations, decisions and effective/observed times privately.
- Expected: requester-specific list; review queue excludes self/already-approved
  and terminal requests; retained lifecycle events; no protected values. Shared
  evidence uses aliases rather than actor references. Pagination lacking enough
  records is Not run, not Pass. Audit is application storage, not cryptographic proof.
- Actual result:
- Status:

### 17. PEER-17 — Invalid incident and resource

- Prerequisites: A; source-supported request route/resource parameter known.
- Steps: visit a nonexistent incident; on /incidents/INC-1001/request-access use
  an unsupported resource parameter; revisit a valid incident/resource without a
  full reload where navigation permits. Record same-component recovery separately.
- Expected: not-found/invalid-request state without a created request or evidence;
  no accidental fallback to a different scope. Backend malformed-input checks
  are separate unit/probe evidence if no approved browser harness can send them.
  R-01 was corrected in the focused follow-up: obsolete failure states are cleared
  after a successful changed-ID load. All 14 incident-detail unit cases, including
  the six new regressions, passed in the owner normal-terminal transcript.
  Do not prefill the peer result; report actual recovery and whether the page remounted.
- Actual result:
- Status:

### 18. PEER-18 — Refresh and changed context

- Prerequisites: A request and B/C decisions in other profiles.
- Steps: refresh details; switch incidents quickly, including failed-ID to valid-ID
  recovery; leave and return to the tab; reconnect after browser offline mode;
  compare request counts/status.
- Expected: correct current context/session; visibility/online refresh and the
  visible online 30-second poll update data; no stale response restores evidence.
- Actual result:
- Status:

### 19. PEER-19 — Session expiry

- Prerequisites: tester's own governed session settings known; no settings changes.
- Steps: allow the session to expire naturally; perform a normal app read/write;
  sign in again manually when prompted. Logout is PEER-03, not expiry evidence.
- Expected: unauthorised requests denied; app requests sign-in/session recovery;
  no successful write or evidence access on expired authority. Automatic refresh
  may extend the session: if natural expiry cannot be observed, mark Blocked/Not run.
- Actual result:
- Status:

### 20. PEER-20 — Backend failure and safe retry

- Prerequisites: only the tester's own local demo; draft synthetic request reason.
- Steps: stop their backend gracefully; attempt read/submission; restart backend;
  use the displayed recovery/refresh controls and check My Requests before retry.
- Expected: honest unavailable/error state; reason retained where supported;
  no false success, duplicate write or evidence exposure. Never stop an unrelated
  process. A token-endpoint 502 is classified separately from backend readiness.
- Actual result:
- Status:

### 21. PEER-21 — Interactive persistence and shutdown

- Prerequisites: recorded pending request, approvals, rejection reason,
  cancellation/history and audit in the tester's own demo.
- Steps: record safe expected counts privately; stop frontend/backend, then Ctrl+C
  once in emulator; wait for successful export; restart the same native sequence.
- Expected: import from demo-data/firestore; lifecycle/decisions/reasons/audit
  retained; duplicate/self-review rules remain. Record export/import explicitly.
  No forced termination, export deletion, crash-durability or Docker claim.
- Actual result:
- Status:

### 22. PEER-22 — Real emulator integration and concurrency

- Prerequisites: Java/tool downloads available; test ports 8086/4406/4506 free.
- Steps: run pnpm run test:emulator; record seed, reload and final exit code;
  inspect safe PASS/error summaries without sharing fixture/storage dumps.
- Expected: real Firestore transactions; concurrent duplicate requests/approvals,
  requester exclusion, cancellation/approval races and replay safeguards pass;
  all six collections survive graceful export/import in a new process. This
  uses synthetic verified identities, not real JWT or Fabric integration.
- Actual result:
- Status:

### 23. PEER-23 — Build, units and dependency audit

- Prerequisites: frozen installation, generated tester configuration.
- Steps: run runbook typecheck/lint/test:all/build and audit; record each exit
  result separately and backend build separately if frontend build stops the chain.
- Expected: application checks should pass for the approved candidate; failures
  remain failures. The supplied baseline audit has unresolved 3 Critical, 5 High,
  10 Moderate findings; record fresh actual totals or audit-fetch failure. Do not
  treat a nonzero audit as clean or force dependency changes during testing.
- Actual result:
- Status:

### 24. PEER-24 — Browser workaround and developer experience

- Prerequisites: tester's own sessions; no configuration changes.
- Steps: record browser/version and sanitized stage/status of a failure; if
  needed try a genuinely fresh Edge session/profile; assess clarity of setup,
  linking/governance, errors and recovery; report gaps using the template.
- Expected: Edge success may be a workaround only. Chrome/Edge, voucher and ORK
  observations remain separate unless correlated by safe timestamps. No raw
  HAR/log dump, headers, payloads or authentication URL queries are attached.
- Actual result:
- Status:

## Blocked full-PoC acceptance cases

### 25. TIDE-01 — Genuine evidence encryption and authorised unlocking

- Prerequisites: supported, implemented and reviewed E2EE policy/enclave flow.
- Steps after unblocking: transiently encrypt synthetic evidence via the supported
  Tide flow; verify ciphertext storage and authorised requester decryption.
- Expected: genuine Tide protection; no ordinary protected plaintext field,
  fabricated ciphertext or server substitute; approvals alone cannot decrypt.
- Actual result:
- Status: **Blocked — encryption/unlocking is incomplete.**

### 26. TIDE-02 — Cryptographic quorum and immutable scope

- Prerequisites: supported contract, endorsement format and completion verifier.
- Steps after unblocking: verify two distinct recognised other endorsers, requester
  exclusion and binding to the same requester/incident/resource/read/duration;
  try other users, incidents/resources and altered intentions through approved tests.
- Expected: Tide/Fabric enforces these restrictions independently of application
  approval rows; only the intended requester gets the approved read scope.
- Actual result:
- Status: **Blocked — genuine scoped authority is incomplete/unverified.**

### 27. TIDE-03 — 15/30/60-minute expiry including cached ciphertext

- Prerequisites: activated genuine grants, documented compatible versions and
  a reviewed direct SDK expiry test; no guessed APIs or copied authority.
- Steps after unblocking: test each approved duration; verify API/UI denial at
  deadline and direct Fabric rejection using the test's previously cached
  ciphertext/authority; repeat after refresh/reconnect.
- Expected: no further read/decryption at or after the approved deadline. An
  application timer/denial does not prove Fabric expiry. Already copied plaintext
  cannot be erased by expiry.
- Actual result:
- Status: **Blocked — genuine expiry and cached-ciphertext denial are incomplete.**

## Existing results: attribution only

The owner reports four separate identities used successfully for application
testing, Chrome failures followed by Edge login success, and two approvals followed
by authority.failed with evidence correctly locked. The owner reports passing
isolated Firestore seed/reload. The later supplied normal-PowerShell transcript
shows both typechecks/lint, 114 backend tests, 98 frontend tests (including all
14 incident-detail cases) and both production builds passing. The fresh owner
audit still returns 3 Critical, 5 High and 10 Moderate findings; none is resolved.
Only git diff --check has an explicitly printed numeric exit, 0. These are owner
local results, not peer execution; the earlier 92-test report is historical.
The earlier agent run passed both typechecks, 114 backend unit tests, 37 frontend
tests and the separate backend build, but lint/build access, seven frontend suite
imports, emulator CLI startup and audit fetch failed. Its historical results are
retained in the handoff/runbook.
Neither source prefills any blank peer case, verifies independent startup, or
passes TIDE-01 through TIDE-03. The three authorised guidance lookups were reported
completed; they do not establish a tested SOC authority/expiry solution.
