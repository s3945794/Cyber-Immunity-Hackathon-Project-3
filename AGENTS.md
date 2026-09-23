# SOC Incident Report Protection

## Required project context

- Read the root CLAUDE.md before planning or modifying code.
- Read documentation relevant to the current task only.
- Follow the existing pnpm, TypeScript, Next.js and Express conventions.
- Use simple English in reports.

## Project purpose

This is a proof of concept for temporary emergency access to protected SOC incident evidence.

The intended flow is:

1. A SOC staff member requests access to protected evidence.
2. The requester cannot approve their own request.
3. Two distinct users from the other three SOC staff accounts must approve.
4. Approved access is limited to the requested incident, resource and duration.
5. Access expires automatically.
6. The request and access lifecycle is retained for audit.
7. Tide protects sensitive evidence and authority.

Do not assume that each role has only one action. All recognised SOC roles may request access and may review other users' requests, subject to self-approval and quorum restrictions.

## Current architecture

- Frontend: Next.js and TypeScript.
- Backend: Express deployed through Firebase Cloud Functions.
- Authentication: TideCloak only.
- Roles: soc-analyst, soc-supervisor, soc-team-leader and soc-manager.
- Database: Firestore through the backend Firebase Admin SDK only.
- Browsers must not access Firestore directly.
- Backend APIs must verify TideCloak tokens before database access.
- Protected evidence must not be exposed through ordinary database fields, fixtures, logs or API responses.

## Scope control

- Work only on the feature explicitly requested in the current prompt.
- Do not implement later project stages early.
- Do not add role hierarchies or role-exclusive actions unless explicitly approved.
- Do not connect a reusable backend guard to an unrelated route.
- Keep `/api/me` authentication-only.
- Do not change TideCloak users, roles, realm data or Docker volumes without explicit approval.
- Do not call Tide MCP unless the prompt explicitly authorises one specific call.
- Never access Gmail.
- Do not access Firebase Console or Google Cloud unless explicitly instructed.
- Do not add new production dependencies without explaining the need first.
- Do not commit, push, merge, deploy, reset, rebase or force operations unless explicitly requested.

## Secrets

Never open, read, print, search or modify:

- .env
- .env.local
- frontend/.env.local
- backend/.env
- service-account files
- private keys
- tokens, cookies or action links

Variable names may be documented, but values must never be displayed.

## UI design

Before creating a final UI or redesigning an existing SOC page:

- Stop and ask the user detailed design questions.
- Ask about layout, navigation, colours, density, cards, tables, forms, approval screens, evidence display, timers, alerts, audit history, responsiveness and accessibility.
- Do not generate the UI implementation prompt until those answers are confirmed.

## Development workflow

- Start every feature from an updated, clean main branch.
- Use one feature branch per stage.
- Inspect existing code before editing.
- Preserve unrelated user changes.
- Add or update tests for changed behaviour.
- Run relevant typecheck, lint and tests.
- Run the production build before declaring a branch complete.
- Run git diff --check.
- Check changed files for secrets and temporary artifacts.
- Report files changed, test results and git status.
- Stop for review before committing or pushing.

## Safety

- Use non-destructive Git commands.
- Never use git reset --hard or force-push.
- If a formatter or hook changes files unexpectedly, stop and report it.
- If requirements are unclear or would expand scope, ask before implementing.
