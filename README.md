# SOC Incident Report Protection

A proof of concept for SOC incident access requests, independent review and audit.
**Do not store real sensitive reports. Protected evidence remains locked.**

## Week 9 access and deployment

**Local Docker deployment: owner-verified, 22 October 2026.** No public hosting
or remote peer-accessible URL. Cloud Run remains unapproved.

- Application: http://localhost:3000 (sign-in: `/auth/signin`).
- Backend health: http://localhost:5001/api/health (owner HTTP 200).
- Unsigned incidents: http://localhost:5001/api/incidents (owner HTTP 401).
- Existing TideCloak local entry point: http://localhost:8080; no private realm,
  client, callback query or sign-in-session URL is published.
- Firestore: internal `firestore:8085`; owner unauthenticated internal GET 403.
  Host localhost:8085 was not reachable in the owner run; do not publish it.

Current HEAD: `44ea6254a95e72b761929809a95e894146700244` on
`feature/soc-emergency-access-poc`. Local deployment changes are committed in
4143ad8 and 44ea625. Owner runtime evidence was collected against the earlier
8d55ac3-based working-tree candidate; it was not rerun as an exact-HEAD peer test.
This documentation reconciliation is uncommitted. Remote publication and image
identities are not verified. Detailed owner/static/peer attribution is in the guide.

See the [Week 9 deployment record](docs/SOC-WEEK9-DEPLOYMENT.md) for exact
procedure, historical failures, backup, scope limitations and remaining handoff.
No cloud or AWS coursework funding/access is assumed.

## Implemented and incomplete behaviour

- Next.js/React uses TideCloak login/logout, callback and silent SSO. Fixed safe
  sign-in feedback requires explicit retry. The blocked-token browser alert test
  remains inconclusive; owner happy-path login is not peer portability.
- Express verifies Tide tokens and recognised SOC membership before server-only
  Firestore access. Firebase Authentication is not used. `/api/me` remains
  authentication-only. Browsers never access Firestore directly.
- Synthetic dashboard/incidents, one-field/read requests for 15/30/60 minutes,
  distinct non-requester review, cancellation, history and audit exist. All four
  recognised SOC roles may request and review other users' requests.
- Application approvals do not create Tide cryptographic authority. Genuine
  encryption, immutable signed scope, requester authority and Fabric expiry
  remain incomplete. Every protected evidence operation remains denied.
- F8 peer DPoP portability is unresolved. SDK 0.14.20 supports explicit opt-in,
  but the complete browser/API/backend proof-aware flow is unfinished. Never
  weaken client policy or enable just a flag to make setup pass.

See [capabilities](docs/SOC-TIDE-CAPABILITIES.md),
[handoff](docs/SOC-POC-HANDOFF.md) and [Week 8 triage](docs/SOC-WEEK8-TRIAGE.md).
Server Action session helpers remain fail-closed placeholders. No full-PoC or
production-security claim follows from successful owner login.

## Independent local setup

Follow the [SOC laptop runbook](docs/SOC-POC-RUNBOOK.md), which supersedes old
boilerplate setup claims. It covers exact-SHA checkout, Node 22.12+ on Node 22 or
supported Node 24, pnpm 11.20.0 local evidence, Java 21+, own private configuration,
separate native emulator/backend/frontend terminals and isolated seed/export/
reload. TideCloak uses separate Docker. Exact-candidate clean-clone retest is pending.

1. Clone into a new directory and compare the full owner-approved test SHA.
   Never reset an existing checkout or copy another person's adapter/data files.
2. Use `pnpm install --frozen-lockfile`; preserve integrity, release-age and
   build-approval policies. Do not reapply already-installed dependency patches.
3. Configure your own private environment/adapter as described in the runbook.
   Never share keys, credentials, tokens, cookies or authentication query URLs.
4. Follow its local startup order using synthetic test data. `pnpm run dev`
   starts only the frontend; it does not deploy the backend or full stack.
5. Preserve existing accounts/data and locked evidence. Never publicly expose
   the local emulator, demo Compose stack or emulator-only backend listener.

Cloud preparation instead uses managed protected Firestore and runtime identity.
`NEXT_PUBLIC_*` are public build settings. Private adapters are backend-only
secret injection, never frontend variables, build arguments or image contents.

## Recorded checks and limitations

17 October qs state: owner backend units passed 135/nine files; coverage passed
135/report, 79.24% lines. Agent backend typecheck/lint/build/frozen installation
and ten parsing checks passed; sandbox unit/coverage failures are separate.
Owner audit: 0 Critical, 1 High Braces and 1 Moderate uuid; no qs advisories.
These are historical checks, not a fresh audit/hosted run/peer verification today.
Residual risks require explicit approval for any synthetic-data restricted beta.

```powershell
pnpm --filter backend test
pnpm --filter frontend test
pnpm --filter backend typecheck
pnpm --filter backend lint
```

Run checks after relevant changes, not merely for a documentation update. The new
deployment wrapper has synthetic tests documented in the Week 9 proposal; those
need no private configuration, service or credential entry.

## Peer live verification after approved deployment

Use only the web base URL and full deployed release SHA in the Week 9 record.
Sign in privately with your own approved identity. Check dashboard/incidents,
request/review/cancel/history/audit and logout. Requesters cannot self-approve;
two distinct other recognised SOC users review. Evidence must stay locked.
Coordinate restart/persistence checks with the operator. Share safe PASS/FAIL
observations, never headers, callback URLs or raw SDK errors. All live checks
remain pending; the deployment proposal owns the exact checklist.

## Layout and release controls

| Path                         | Purpose                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| frontend/                    | Next.js 16 / React 19 and Tide SDK 0.14.20 UI                       |
| backend/                     | Express, Tide token verification and server-only Firestore workflow |
| deploy/cloudrun/             | Proposed cloud wrapper/tests, Dockerfile and service templates      |
| firebase/                    | Deny-all browser rules and workflow indexes                         |
| docs/SOC-POC-RUNBOOK.md      | Local setup and historical verification                             |
| docs/SOC-WEEK9-DEPLOYMENT.md | Approval gates, costs, commands and release record                  |
| docs/tide-mcp-learning.txt   | Curated Tide evidence and limitations                               |

Existing Firebase files and disabled deployment workflow do not prove authorised
hosting. The old Vercel guide is frontend-only and insufficient for this workflow.
No automatic deployment, dependency, realm or account change is authorised here.
