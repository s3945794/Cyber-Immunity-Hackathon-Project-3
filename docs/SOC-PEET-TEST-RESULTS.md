# SOC peer test results: 13 October 2026

Completed from [the results template](SOC-PEER-TEST-RESULTS-TEMPLATE.md). Case-by-case statuses are in [SOC-PEER-TEST-PLAN-RESULTS.md](SOC-PEER-TEST-PLAN-RESULTS.md).

**Summary: independent startup was NOT verified. Sign-in is Blocked at token exchange.** Nothing in this document was assumed to work. Items not executed are marked Not run. Placeholders marked `[fill in]` still need the tester's own values.

No tokens, cookies, adapter contents, enrollment links, user identities, request payloads or URL queries are included.

## Run record

| Field | Value |
| --- | --- |
| Run/test ID | `1` |
| Date, time and timezone | 13 October 2026, Melbourne (AEDT) |
| Tester alias | `s4905513` |
| Repository and branch | Cyber-Immunity-Hackathon-Project-3, `feature/soc-emergency-access-poc` |
| Full published commit SHA tested | `bc2f22bae66b6283c0acef0841cecfea28157a3c` |
| Worktree clean or differences | No tracked files were modified. Untracked: `.env`, `data/tidecloak.json` (both private). A stray root `tidecloak.json` was deleted. |
| Lockfile unchanged | Yes, no dependency changes made |
| Laptop OS/version | Desktop Windows `10` |
| Node / pnpm | Node 24.21.0. pnpm 11.19.0 (npm-installed copy first in PATH) used for the run. See finding F1 |
| Java / Docker / Compose | `openjdk 25.0.4.1 2026-08-18 LTS OpenJDK Runtime Environment Temurin-25.0.4.1+1 (build 25.0.4.1+1-LTS) OpenJDK 64-Bit Server VM Temurin-25.0.4.1+1 (build 25.0.4.1+1-LTS, mixed mode, sharing)` / `Docker version 29.8.2, build 7fc2dff` / `Docker Compose version v5.5.1`|
| TideCloak image | `tideorg/tidecloak-dev:latest`. Version and digest not obtained |
| Browser/version | Chrome `155.0.8059.39`, Edge ` Version 155.0.4283.45 ` (InPrivate). Separate A to D profiles were not reached |
| Fresh clone and own realm | Own realm `devtest1`, client `devtest1-client`, on a pre-existing container (`mytidecloak`). See F6, F7 |
| First independent successful launch | **Blocked** |
| Evidence source | Peer-executed. Unit tests are mocked. No live JWT or Tide/Fabric verification |
| Overall limited application test outcome | **Blocked** at sign-in |
| Full Tide PoC acceptance | Blocked pending genuine encryption, authority and expiry |

## Automated and persistence checks

| Check | Exit/result | Safe evidence / source / limitation |
| --- | --- | --- |
| Frozen-lockfile installation | Partial | Lockfile passed supply-chain policy and was up to date. `pnpm install --frozen-lockfile` not run explicitly |
| Typecheck | Pass | Backend and frontend, `tsc --noEmit`. Peer-executed |
| Lint | Pass | Backend and frontend ESLint. Peer-executed |
| Frontend units | 98 passed, 0 failed (11 files) | Mocked. Includes all 14 incident-detail cases |
| Backend units | 114 passed, 0 failed (8 files) | Mocked verification/store fixtures |
| Frontend production build | Not run | |
| Backend production build | Not run | |
| `pnpm audit --audit-level=high` | 24 findings: 3 Critical, 6 High, 14 Moderate, 1 Low | Owner baseline is 3 / 5 / 10. The extra High is the Next.js image-optimization SSRF advisory (GHSA-cjq9-62q9-8jv4, patched in 16.3.8). Not remediated. Exploitability not assessed |
| Isolated Firestore seed | Not run | |
| Isolated Firestore export and reload | Not run | |
| Isolated probe final result | Not run | |
| Native interactive shutdown/export/import | Not run | Emulator, backend and frontend started, but restart persistence was not tested |
| Docker app path | Not run | |
| Real JWT negative/security cases | Not run | Fixtures are not live validation |
| Genuine Tide/Fabric encryption/authority/expiry | Blocked | No pass from application metadata |

### Readiness checks executed

| Check | Result |
| --- | --- |
| `GET http://127.0.0.1:5001/api/health` | 200 |
| `GET http://localhost:3000/auth/signin` | 200 |
| Unsigned `GET /api/incidents` | 401 (correctly denied) |
| `tidecloak:status` HTTP probe | 302, but it was answering from a different container (see F6) |

## Findings for the owner

| # | Finding | Severity | Classification | Evidence |
| --- | --- | --- | --- | --- |
| F1 | `scripts/demo.cjs` launches `process.env.npm_execpath` through Node. With a native `pnpm.exe` build (pnpm 12.10.1, and the standalone 11.19.0) it fails with `ERR_UNKNOWN_FILE_EXTENSION ".exe"`. Worked only after putting an npm-installed pnpm 11.19.0 first in PATH for the session. Also needs an interactive "choose packages to build" answer on first emulator start | High | Application defect | Error text and exit 1 at `demo:emulator` |
| F2 | `.env.example` contains a non-empty `CLIENT_ADAPTER` placeholder. Copied as instructed, it overrides `data/tidecloak.json`. The backend then fails with a generic message | High | Application defect | Placeholder length 14. Backend started after it was blanked |
| F3 | The backend startup error ("Backend startup failed. Check demo emulator, port and private Tide configuration.") does not say which check failed: adapter, realm/client mismatch, emulator or port | Moderate | Application defect | Same message for every cause |
| F4 | Self-chosen realm and client names must also be set in `NEXT_PUBLIC_TIDECLOAK_REALM` and `NEXT_PUBLIC_TIDECLOAK_CLIENT_ID`. The runbook does not say so clearly | Low | Environment or setup issue | Adapter and `.env` names differed |
| F5 | The Tide wizard's Redirect URI field produced redirect URIs and web origin of the form `http://localhost:8080/<client>/...`. Sign-in failed with `Invalid parameter: redirect_uri` until they were corrected to `http://localhost:3000/auth/redirect`, `http://localhost:3000/silent-check-sso.html` and origin `http://localhost:3000`, and approved in QEA | Moderate | Environment or setup issue | Login page error. Change shown as Approved |
| F6 | The runbook has no step to detect another container holding host port 8080. `tidecloak:status` showed a healthy 302 while the browser reached a different container (`mytidecloak`) | Moderate | Environment or setup issue | `docker ps` port listing |
| F7 | The project's own TideCloak container shows only `8080/tcp` (not published to the host). With the other container stopped, the login page did not load. `[confirm against docker-compose.tidecloak.yml port section]` | High | Unknown | `docker ps --format` output |
| F8 | Token exchange fails with HTTP 400, `error="invalid_dpop_proof"`, reason "DPoP proof is missing", for `devtest1-client`. Matches the runbook's known ISSUE 010. DPoP was **not** changed. Same result in Chrome and Edge | Critical (blocks sign-in) | Tide integration difficulty | Sanitized TideCloak container log lines, about 09:05 to 09:07, `localhost:8080/realms/devtest1/protocol/openid-connect/token` |
| F9 | The same log lines show `client_auth_method="client-secret"` for a client the console shows as a public client. Cause unknown | Informational | Unknown | Log lines above |
| F10 | When token exchange fails, the app shows no message and returns to the sign-in page, which looks like a loop. The cause is visible only in the Network tab and TideCloak log | Moderate | Application defect | Observed in Chrome and Edge |
| F11 | Git "dubious ownership" error blocked `lefthook install` during `pnpm run` until `safe.directory` was set for the clone | Low | Environment or setup issue | Git exit 128 |
| F12 | Grammarly injects `data-gr-*` attributes into `<body>`, causing a React hydration warning in dev mode | Informational | Environment | Console warning. Not an app defect |

F7 and F8 come from a run against the tester's own `mytidecloak` instance on 8080, not the project's container. F8 matches the runbook's documented blocker, so it stands either way.

## Developer-experience feedback

| Question | Feedback |
| --- | --- |
| Could you find the correct branch/SHA and reproduce installation? | `Yes` Installation worked once the pnpm install method was resolved (F1) |
| Were required tools and configuration names clear? | Mostly. The pnpm install method (F1), the `CLIENT_ADAPTER` placeholder (F2) and realm/client name matching (F4) were not |
| Could you create a fresh realm/client without another laptop? | Realm and client created on desktop. Redirect handling (F5) and the DPoP setting (F8) were unclear |
| Which account-linking steps were unclear or unavailable? | Not reached |
| Were governed role assignments/approvals understandable? | Only the client redirect change was approved. Role assignment was not reached |
| Were separate browser profiles and active aliases clear? | Not reached |
| Did errors identify the failed stage and a safe recovery? | No. The backend error was generic (F3) and the sign-in loop showed nothing (F10). The cause was found only in the TideCloak log |
| Could you retain requests/decisions/audit after graceful restart? | Not tested |
| Where did guidance need undocumented knowledge or owner assistance? | pnpm install method, port 8080 conflict, `CLIENT_ADAPTER` placeholder, DPoP setting for fresh clients |
| Time spent on installation, Tide setup, first launch and tests | `10 hours` |
| Smallest suggested improvement | Handle native pnpm in `demo.cjs`. Ship `CLIENT_ADAPTER=` blank. Name the failed check in the backend error. Show the token error in the UI. Document the DPoP setting and port publishing for fresh clients |

## Review outcome

- **Independent startup verified by the peer:** No.
- **Application defects requiring fixes:** F1, F2, F3, F10.
- **Tide integration difficulties requiring supported guidance:** F8 (DPoP proof missing on a fresh client).
- **Environment/setup blockers:** F4, F5, F6, F11. F12 is informational.
- **Unknown causes requiring correlation:** F7, F9.
- **Remaining blocked acceptance cases:** PEER-02 to PEER-21 (no sign-in), TIDE-01 to TIDE-03.
- **Approval needed for any proposed change:** owner decision on whether a fresh client may turn DPoP off (as in the owner's working instance) or whether a supported flow with DPoP on exists. DPoP and PKCE were not changed in this test.
