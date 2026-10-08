# SOC peer test results template

Copy this template to an agreed, non-secret results document. Use aliases A–D
from [the test plan](SOC-PEER-TEST-PLAN.md). Do not submit raw authentication logs,
HAR files, environment/adapter exports, identity attributes, tokens, cookies,
enrollment links, signed URLs, request payloads or URL queries.

## Run record

| Field                                                   | Value                                                                               |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Run/test ID                                             |                                                                                     |
| Date, time and timezone                                 |                                                                                     |
| Tester alias                                            |                                                                                     |
| Repository and branch                                   |                                                                                     |
| Full published commit SHA tested                        |                                                                                     |
| Worktree clean or description of non-secret differences |                                                                                     |
| Lockfile unchanged / approved patched candidate         |                                                                                     |
| Laptop OS/version                                       |                                                                                     |
| Node / pnpm / Java / Docker / Compose versions          |                                                                                     |
| TideCloak image version/digest, if obtained safely      |                                                                                     |
| Browser/version and separate profile aliases            |                                                                                     |
| Fresh clone and own realm/configuration                 |                                                                                     |
| First independent successful launch                     | Pass / Fail / Blocked / Not run                                                     |
| Evidence source                                         | Peer-executed / user-reported / source review / mocked units / emulator integration |
| Overall limited application test outcome                | Pass / Fail / Blocked / Not run                                                     |
| Full Tide PoC acceptance                                | Blocked pending genuine encryption, authority and expiry                            |

## One case record — repeat for each numbered case

| Field                                                   | Value                                                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Case/test ID                                            |                                                                                                         |
| Tested full commit SHA                                  |                                                                                                         |
| Status                                                  | Pass / Fail / Blocked / Not run                                                                         |
| Prerequisites actually met                              |                                                                                                         |
| Reproduction steps, using aliases and synthetic context |                                                                                                         |
| Expected result                                         |                                                                                                         |
| Actual result                                           |                                                                                                         |
| Severity                                                | Critical / High / Moderate / Low / Informational / Not applicable                                       |
| Classification                                          | Application defect / Tide integration difficulty / Environment or setup issue / Unknown                 |
| Reproducibility                                         | Always / Intermittent / Once / Not attempted; include safe counts                                       |
| Redacted evidence                                       | Sanitized timestamp, safe error text, HTTP status, destination hostname or cropped/redacted UI evidence |
| Workaround and its limitations                          |                                                                                                         |
| Blocker and smallest next action                        |                                                                                                         |
| Owner review / follow-up reference                      |                                                                                                         |

Record the execution category separately from attribution:
UI observation / mocked unit / real emulator with synthetic identities /
live JWT / live Tide-Fabric, and tester-executed / owner-reported /
agent-executed / source review. Do not transfer evidence between categories.

Keep PEER-01 through PEER-24 actual results and statuses blank in the plan until
the teammate executes them. TIDE-01 through TIDE-03 remain Blocked. Owner-reported
seed/export/reload persistence is verified for that isolated probe only; record
interactive restart and this laptop's first successful startup separately.

State what was actually executed. Do not turn a blocked step into a Pass. A
successful locked-evidence check and a blocked genuine decryption case can both
be correct results. Application approvals/audit rows do not prove Tide authority.
Correlate events using timestamps/timezone; an unrelated exception or ORK message
is not a confirmed browser-failure cause.

## Automated and persistence checks

| Check                                                                         | Exit/result | Safe evidence / source / limitation         |
| ----------------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| Frozen-lockfile installation                                                  |             |                                             |
| Typecheck                                                                     |             |                                             |
| Lint                                                                          |             |                                             |
| Frontend units: passed/failed/skipped counts                                  |             |                                             |
| Backend units: passed/failed/skipped counts                                   |             |                                             |
| Frontend production build                                                     |             |                                             |
| Backend production build                                                      |             |                                             |
| pnpm audit --audit-level=high: Critical/High/Moderate counts or fetch failure |             |                                             |
| Isolated Firestore seed                                                       |             | Real emulator/service, synthetic identities |
| Isolated Firestore graceful export and reload                                 |             | Separate emulator process                   |
| Isolated probe final result/exit code                                         |             |                                             |
| Native interactive shutdown/export/import                                     |             | Separate from isolated probe                |
| Docker build/start/restart, if attempted                                      |             | Source review is not execution              |
| Real JWT negative/security cases                                              |             | Fixtures are not live validation            |
| Genuine Tide/Fabric encryption/authority/expiry                               | Blocked     | No pass from application metadata           |

Baseline unresolved audit: **3 Critical, 5 High, 10 Moderate** in the owner's
supplied report. Record fresh totals for the tested version without overwriting
that baseline or assuming exploitability. Do not attach unreviewed raw audit or
private runtime artifacts to a public issue.

## Developer-experience feedback

| Question                                                            | Feedback |
| ------------------------------------------------------------------- | -------- |
| Could you find the correct branch/SHA and reproduce installation?   |          |
| Were required tools and configuration names clear?                  |          |
| Could you create a fresh realm/client without another laptop?       |          |
| Which account-linking steps were unclear or unavailable?            |          |
| Were governed role assignments/approvals understandable?            |          |
| Were separate browser profiles and active aliases clear?            |          |
| Did errors identify the failed stage and a safe recovery?           |          |
| Could you retain requests/decisions/audit after graceful restart?   |          |
| Where did guidance need undocumented knowledge or owner assistance? |          |
| Time spent on installation, Tide setup, first launch and tests      |          |
| Smallest suggested documentation or implementation improvement      |          |

## Review outcome

- Independent startup verified by the peer, with SHA and evidence:
- Application defects requiring fixes:
- Tide integration difficulties requiring supported guidance:
- Environment/setup blockers:
- Unknown causes requiring correlation:
- Remaining blocked acceptance cases:
- Approval needed for any proposed implementation/dependency/policy change:
