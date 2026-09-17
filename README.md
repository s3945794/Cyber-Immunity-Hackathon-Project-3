# SOC Incident Report Protection

A proof-of-concept website being developed to protect sensitive Security Operations Centre (SOC) incident reports.

The project uses Next.js, TideCloak and Firestore. It started from the RMIT Garage boilerplate and is being developed with help from Kiro and AI coding tools.

Frontend login and logout are working. Backend TideCloak token verification, role enforcement and incident-report protection are still planned.

> This project is under development. Do not use it to store real sensitive incident reports yet.

New to the project? Start with the [setup guide](docs/GUIDE.md). See [the architecture document](docs/ARCHITECTURE.md) for component descriptions and system diagrams.

## Project Purpose

The planned website will allow SOC users to work with sensitive incident reports while limiting who can access them.

The planned features include:

- TideCloak login and logout.
- Access rules based on four SOC roles.
- Incident-report creation and viewing.
- Encrypted report content using Tide Cybersecurity Fabric.
- Approval requirements for protected actions.
- Audit records showing important requests and actions.

These features are not all implemented yet. The current status is listed below.

## Current Status

### Implemented

- TideCloak frontend login and logout.
- Authentication callback page at `/auth/redirect`.
- Silent single sign-on (SSO) support at `/silent-check-sso.html`.
- Browser-side authentication checks for the dashboard, profile and settings pages.
- Navigation that displays the signed-in user.
- Firestore database configuration retained from the original boilerplate.
- Local TideCloak development environment using Docker.
- Playwright browser-test foundation.
- Tide development learning log.

Silent SSO checks whether the user already has a login session without requiring another visible login.

### Prepared but Not Enforced

The four planned SOC roles are declared in `tidecloak/roles.json`:

- SOC Analyst.
- SOC Supervisor.
- SOC Team Leader.
- SOC Manager.

Declaring these roles does not mean role-based access control is working. Application and backend role checks still need to be implemented and tested.

### Not Yet Implemented

- Server-side verification of TideCloak JSON Web Tokens (JWTs).
- Backend API integration with the new TideCloak authentication flow.
- Role-based access control (RBAC).
- The main incident-report workflow.
- Tide Cybersecurity Fabric integration for encrypted report content.
- Incident-report approval workflows.
- Incident-report audit logging.

The backend authentication middleware still uses Firebase ID-token verification. It has not yet been connected to the TideCloak frontend.

The frontend `getServerSession()` and `requireAuth()` functions are currently fail-closed placeholders, not completed TideCloak verification. Fail-closed means they deny access rather than grant it without verified authentication.

### Important Security Limit

Browser-side route protection controls what the website displays. It is not a complete security boundary.

Backend APIs, Server Actions and database access need their own authentication and permission checks. A successful browser redirect test does not prove that these other layers are secure.

## Technology Stack

| Component                  | Technology                                                        |
| -------------------------- | ----------------------------------------------------------------- |
| Frontend                   | Next.js 16 App Router, React 19, TypeScript 5 and Tailwind CSS v4 |
| Backend                    | Express, structured for Firebase Cloud Functions v2               |
| Database                   | Firestore                                                         |
| Frontend authentication    | TideCloak                                                         |
| Local identity environment | TideCloak Docker container                                        |
| Planned report protection  | Tide Cybersecurity Fabric                                         |
| Package manager            | pnpm workspaces                                                   |
| Unit and component testing | Vitest, Testing Library and supertest                             |
| Browser testing            | Playwright with Chromium                                          |
| Development checks         | ESLint, TypeScript, Prettier and Lefthook                         |
| Repository automation      | GitHub Actions and Dependabot                                     |

Use `pnpm` for project commands and dependency changes.

Firestore remains the application database. Replacing Firebase Authentication does not remove the need for Firebase database configuration.

The current setup uses a real Firebase project rather than a local Firestore emulator. Use development data only.

## Quick Start

### 1. Prerequisites

Install:

- Node.js — the existing setup instructions specify version 22.
- The pnpm version specified by the repository.
- Docker Desktop for local TideCloak development.

Follow any Node.js or package-manager version settings in the repository when setting up your environment.

### 2. Clone and Bootstrap

```bash
git clone https://github.com/s3945794/Cyber-Immunity-Hackathon-Project-3.git soc-incident-report-protection
cd soc-incident-report-protection
pnpm run bootstrap
```

Bootstrap:

- Installs project dependencies.
- Creates the root `.env` from `.env.example` if it does not already exist.
- Generates the frontend and backend environment files.

### 3. Configure Environment Variables

Edit the root `.env` file.

The following files are generated from it:

- `frontend/.env.local`
- `backend/.env`

Do not edit these generated files by hand.

To regenerate them:

```bash
pnpm run env:sync
```

Environment synchronisation also runs before `pnpm run dev`.

See [the environment-variable reference](docs/ENV-VARS.md) for the required values.

Never commit `.env` files, service-account keys, passwords or tokens.

### 4. Configure Firestore

Use a Firebase development project:

1. Create a Firestore database.
2. Register a Firebase web app.
3. Add the web configuration to the matching `NEXT_PUBLIC_FIREBASE_*` variables in the root `.env`.
4. Configure the server-side Firebase credentials described in `docs/ENV-VARS.md`.
5. Set the correct Firebase project ID in `.env` and `.firebaserc`.

Firebase service-account credentials are secret. Do not put them in browser-facing variables or include them in screenshots, documentation or Git commits.

### 5. Configure and Start TideCloak

Follow [the local TideCloak guide](docs/TIDECLOAK-LOCAL.md) to set up the realm and client.

A realm is the identity environment containing the application's users, clients and roles.

Set the required `NEXT_PUBLIC_TIDECLOAK_*` configuration values in the root `.env`.

Start TideCloak:

```bash
pnpm run tidecloak:start
```

Check its status:

```bash
pnpm run tidecloak:status
```

### 6. Start the Website

```bash
pnpm run dev
```

Open:

[http://localhost:3000](http://localhost:3000)

This command starts the frontend development server. It does not mean the backend API or all planned features are running.

Restart the development server after changing environment variables.

## Authentication Flow

The current frontend authentication flow is:

1. A logged-out user opens a protected page.
2. The application starts TideCloak authentication.
3. The browser passes through local TideCloak.
4. The observed development flow continues to an external HTTPS sign-in page under `*.tideprotocol.com`.
5. After successful authentication, the browser returns through `/auth/redirect`.
6. The signed-in user can reach the dashboard.

Do not assume the final sign-in page stays on the local TideCloak address or uses standard Keycloak form selectors.

Authentication URLs can contain temporary session information. Never hardcode or publish full authentication URLs or their query values.

## Testing

### Unit and Component Tests

```bash
pnpm run test
pnpm run test:component
pnpm run test:all
```

These commands run the existing Vitest-based tests. Run Playwright separately using the browser-test commands below.

### CI-Safe Browser Tests

Install Chromium when needed:

```bash
pnpm --filter frontend exec playwright install chromium
```

Run:

```bash
pnpm run test:e2e
```

The current CI-safe tests check the sign-in page and silent-SSO page without entering Tide account credentials.

These tests are designed to be suitable for continuous integration (CI). That does not automatically mean they are already included in a GitHub Actions workflow.

### Local TideCloak Browser Tests

With the frontend and local TideCloak running:

```bash
pnpm run test:e2e:local-tidecloak
```

Run this test group with one worker, as configured by the local test script. This is a reliability precaution, not proof that concurrent sessions caused earlier failures.

The protected-route tests cover:

- `/dashboard`
- `/profile`
- `/settings`

They check that unauthenticated users are redirected through the expected authentication flow and protected page content is not displayed.

Automated login and logout tests are currently skipped because reliable login-page selectors have not been confirmed. Login and logout still require manual verification.

### Latest Reported Local Verification

During the Playwright foundation stage:

- Five CI-safe browser tests passed.
- Three local protected-route tests passed using one worker.
- Two automated login/logout tests were skipped.
- Existing frontend and backend unit tests passed.
- Lint, type checking and the production build passed.

These results describe that development checkpoint. Rerun relevant checks after making changes.

Test reports, traces and screenshots may contain sensitive session information. Keep generated artifacts out of Git and review them before sharing.

See [the testing guide](docs/TESTING.md) for detailed instructions.

## Common Commands

Run these commands from the repository root.

| Command                             | Purpose                                            |
| ----------------------------------- | -------------------------------------------------- |
| `pnpm run bootstrap`                | Install dependencies and prepare environment files |
| `pnpm run dev`                      | Start the frontend development server              |
| `pnpm run build`                    | Build the frontend and backend                     |
| `pnpm run test`                     | Run backend unit tests                             |
| `pnpm run test:component`           | Run frontend unit and component tests              |
| `pnpm run test:all`                 | Run the existing combined Vitest tests             |
| `pnpm run test:e2e`                 | Run CI-safe Playwright browser tests               |
| `pnpm run test:e2e:local-tidecloak` | Run local TideCloak browser tests                  |
| `pnpm run lint`                     | Check code with ESLint                             |
| `pnpm run typecheck`                | Check TypeScript types                             |
| `pnpm run format`                   | Format project files with Prettier                 |
| `pnpm run env:sync`                 | Regenerate frontend and backend environment files  |
| `pnpm run validate`                 | Check for unreplaced template placeholders         |
| `pnpm run tidecloak:start`          | Start local TideCloak                              |
| `pnpm run tidecloak:stop`           | Stop local TideCloak while retaining local data    |
| `pnpm run tidecloak:status`         | Check the container and HTTP response              |
| `pnpm run tidecloak:logs`           | Follow TideCloak container logs                    |

`pnpm run format` changes files. Review its diff before committing.

## Project Structure

| Location                        | Purpose                                               |
| ------------------------------- | ----------------------------------------------------- |
| `frontend/src/app/`             | Website pages and layouts                             |
| `frontend/src/components/`      | Shared user-interface components                      |
| `frontend/src/features/`        | Application feature modules                           |
| `frontend/src/lib/`             | Firebase setup, TideCloak configuration and utilities |
| `frontend/src/providers/`       | React providers, including the authentication bridge  |
| `frontend/src/actions/`         | Next.js Server Actions                                |
| `frontend/tests/e2e/`           | Playwright browser tests                              |
| `frontend/playwright.config.ts` | Playwright configuration                              |
| `backend/src/routes/`           | Express API routes                                    |
| `backend/src/middleware/`       | Authentication and error-handling middleware          |
| `backend/src/lib/`              | Server-side Firebase setup and utilities              |
| `firebase/`                     | Firestore rules and indexes                           |
| `tidecloak/`                    | Local TideCloak configuration and role declarations   |
| `scripts/`                      | Project setup and development scripts                 |
| `docs/`                         | Setup guides and reference documents                  |
| `.github/workflows/`            | GitHub Actions workflow definitions                   |
| `.claude/`                      | Optional Claude Code development configuration        |

## GitHub Actions and Dependabot

### GitHub Actions

GitHub Actions runs automated jobs defined in `.github/workflows/`.

Depending on the workflow configuration, jobs can run after a push, a pull request or another configured event.

The workflow files are the source of truth for:

- Which checks run.
- Which branches trigger them.
- Whether browser tests are included.
- Whether deployment steps are included.

Passing a local test does not mean that test also runs on GitHub.

A green workflow means its configured jobs passed. It does not prove the whole website is secure.

A red workflow means a job failed. Open the failed job and step to find the cause before accepting the affected changes.

### Dependabot

Dependabot checks dependencies and can open pull requests proposing updates.

A dependency update can fail CI even when the current `main` branch passes. Investigate the failed check before merging the proposed update.

Do not disable checks just to accept a dependency update.

## Security and Development Limits

This is a development proof of concept, not a production-ready report-protection system.

Important rules:

- Do not store real sensitive incident reports yet.
- Do not treat browser-side route checks as backend protection.
- Do not weaken Firestore rules just to remove permission errors.
- Do not commit passwords, tokens, cookies, private keys or service-account credentials.
- Do not publish authentication query strings or session URLs.
- Do not treat AI development hooks as application security controls.
- Do not assume a green build proves authentication, authorisation or encryption is complete.

Check dependency findings with:

```bash
pnpm audit
```

Audit findings change as dependencies and advisory data change. Investigate each finding rather than assuming development-only packages are harmless.

See [the security document](docs/SECURITY.md) for more detail.

## Troubleshooting

| Problem                                         | What to check                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Firebase configuration is incomplete            | Check the required root `.env` values, run `pnpm run env:sync`, and restart the frontend              |
| Firebase project ID contains a placeholder      | Set the real development project ID in `.env` and `.firebaserc`                                       |
| `next` or another dependency command is missing | Run `pnpm install` from the repository root                                                           |
| pnpm reports ignored build scripts              | Review the repository's build-approval configuration before approving scripts                         |
| Firestore reports insufficient permissions      | Check the intended access and `firebase/firestore.rules`; do not enable broad access as a workaround  |
| TideCloak login returns to `/auth/signin`       | Inspect sanitised application and TideCloak errors, then check the learning log for previous findings |
| Browser tests expect the wrong login URL        | Check the observed redirect chain; the sign-in page may be on an external Tide domain                 |
| Playwright reports `ERR_NETWORK_CHANGED`        | Inspect the failure and rerun with one worker; do not assume credentials or concurrency caused it     |
| Automated login/logout tests are skipped        | Follow the manual verification procedure in `docs/TESTING.md`                                         |
| A commit is rejected                            | Check the hook output and use a Conventional Commit message such as `docs: update README`             |

## Git Workflow

Use clear commit messages:

```text
feat: add a feature
fix: correct a problem
docs: update documentation
test: add or update tests
chore: maintain project configuration
```

Before committing:

```bash
git status -sb
git diff
git diff --check
```

For a README-only update, stage only the README:

```bash
git add README.md
git commit -m "docs: update SOC project README"
```

Check the current branch before pushing. A push to a feature branch does not update the README on `main`.

Follow the repository's branch-protection rules. If a pull request is required, use one. Do not force-push or bypass protection.

See [the Git workflow guide](docs/GIT-WORKFLOW.md).

## Development Tools

Kiro is used during development. Claude Code configuration is also included in the repository.

Neither tool is required to run the application. Developers can edit files directly and use the documented pnpm commands.

AI-generated changes must still be reviewed and tested.

See [CLAUDE.md](CLAUDE.md) for the optional Claude Code development instructions.

## Tide Learning Log

The learning log is stored in:

[docs/tide-mcp-learning.txt](docs/tide-mcp-learning.txt)

It records:

- Observable problems and error messages.
- Investigation steps and results.
- Confirmed solutions or available workarounds.
- Verification evidence.
- Suggested improvements to Tide guidance.

Update an existing entry when the same issue is solved instead of creating a duplicate.

Never record secrets or private AI reasoning. If the cause is unknown, state that the root cause is not confirmed.

## Documentation

| Topic                 | Document                                            |
| --------------------- | --------------------------------------------------- |
| Setup guide           | [GUIDE.md](docs/GUIDE.md)                           |
| Architecture          | [ARCHITECTURE.md](docs/ARCHITECTURE.md)             |
| Frontend conventions  | [FRONTEND.md](docs/FRONTEND.md)                     |
| Backend conventions   | [BACKEND.md](docs/BACKEND.md)                       |
| Design system         | [DESIGN.md](docs/DESIGN.md)                         |
| Firestore schema      | [FIRESTORE-SCHEMA.md](docs/FIRESTORE-SCHEMA.md)     |
| Environment variables | [ENV-VARS.md](docs/ENV-VARS.md)                     |
| Local TideCloak       | [TIDECLOAK-LOCAL.md](docs/TIDECLOAK-LOCAL.md)       |
| Testing               | [TESTING.md](docs/TESTING.md)                       |
| Security              | [SECURITY.md](docs/SECURITY.md)                     |
| Git workflow          | [GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md)             |
| CI/CD                 | [CI-CD.md](docs/CI-CD.md)                           |
| Vercel deployment     | [DEPLOY-TO-VERCEL.md](docs/DEPLOY-TO-VERCEL.md)     |
| Tide learning log     | [tide-mcp-learning.txt](docs/tide-mcp-learning.txt) |

## Deployment

The frontend deployment guide targets Vercel.

See [the Vercel deployment guide](docs/DEPLOY-TO-VERCEL.md) for configuration instructions.

A successful frontend deployment does not mean the backend, TideCloak or planned report-protection features are deployed and working.

Production deployment requires suitable identity-server hosting, callback settings, environment variables and verified backend security.

## Next Steps

1. Add the CI-safe Playwright tests to GitHub Actions.
2. Implement server-side TideCloak token verification.
3. Connect backend APIs to TideCloak authentication.
4. Implement and test the four SOC roles.
5. Build the incident-report workflow.
6. Integrate Tide Cybersecurity Fabric.
7. Add approvals and audit records.
8. Verify the complete security and user flow.

## Credits

Based on the RMIT Garage boilerplate.

Originally forked from a Firebase-based student capstone boilerplate by **Duc Gia Tin Huynh** ([LinkedIn](https://www.linkedin.com/in/huynhducgiatin/)).
