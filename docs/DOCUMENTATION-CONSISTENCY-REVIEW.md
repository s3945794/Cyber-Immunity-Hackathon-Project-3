# Documentation consistency review 23 October 2026

## Git publication state

Branch: feature/soc-emergency-access-poc. HEAD: `40644beb72e07b67e37925680435999ce5185ad2`.
Origin fetch succeeded. HEAD and origin/feature/soc-emergency-access-poc are equal
(0 ahead, 0 behind). Feature is 21 commits ahead of origin/main, with no main-only
commits. Main HEAD: `27b09cbc52b6fb6ed69803b38c55e7f29c6699ee`.
Main's architecture still describes Vercel, an optional API and future Firestore;
those are old branch contents, not proof that feature implementation is absent.
Remote equality does not publish uncommitted work.

Before this review, nothing was staged. Existing unstaged files were
SOC-TIDE-CAPABILITIES.md and tide-mcp-learning.txt. Existing untracked deploy/cloudrun
files remain parked and unchanged. No branch movement, pull, commit or push occurred during that inspection.

## Source and verification boundary

- Implemented: Next.js/TideCloak login; backend signature/issuer/azp/time checks;
  four equal SOC role memberships; server-only Firestore transaction storage;
  requester exclusion, two distinct reviews, cancellation, history and audit.
- Implemented local deployment: loopback app/API, internal-only Firestore storage
  network, external preserved TideCloak. Cloud Function export is a retained entry
  point, not the current deployment. Browsers have no direct database access.
- Recorded verification: 22 October owner Docker/application/persistence evidence
  is retained in SOC-WEEK9-DEPLOYMENT.md, with its original working-tree provenance.
  Older owner/unit/hosted runs remain separately dated in build status. No fresh
  application check or independent current-HEAD peer result is inferred here.
- Blocked/planned: genuine Tide encryption and field/version-bound authority,
  verified completion, evidence unlocking and trusted Fabric expiry. Database
  state/time checks are not cryptographic enforcement. F8 and dependency findings
  remain unresolved with recorded causes/attempts preserved.

## Current document map

README, ARCHITECTURE and GUIDE describe current delivery. BACKEND and
FIRESTORE-SCHEMA describe API/storage. SECURITY and SOC-TIDE-CAPABILITIES describe
authority limits. TESTING and SOC-POC-BUILD-STATUS distinguish recorded runs.
SOC-POC-RUNBOOK, SOC-WEEK9-DEPLOYMENT and SOC-POC-HANDOFF carry setup and handoff.
DEPLOY-TO-VERCEL and CI-CD cloud examples are historical, not executable current
release instructions. Root AGENTS.md and CLAUDE.md contain obsolete context but
were deliberately not modified under the user's instruction.

## Diagrams and uncertainty

ARCHITECTURE.md now includes editable Mermaid system and request/review diagrams.
No tracked PNG/SVG/Mermaid-export/drawio files were found by the focused filename
search. The two supplied screenshots match older main-branch concepts; replace
presentation exports from the current editable diagrams. Their external image
locations were not edited. Rendering in the presentation tool still needs checking.

Local Docker is not a public deployment. Exact image identities, independent peer
acceptance, supported Tide authority fixture/build combination and final PM
acceptance remain separate gaps. Historical owner passes are not new peer passes.

## Suggested staging groups for later review

1. Current architecture/setup explanations: README.md, docs/ARCHITECTURE.md,
   docs/BACKEND.md, docs/DEPLOY-TO-VERCEL.md and docs/CI-CD.md.
2. Evidence and publication attribution: docs/TESTING.md,
   docs/SOC-POC-BUILD-STATUS.md, docs/SOC-POC-HANDOFF.md and this review.
3. Existing capability/learning work plus these additions:
   docs/SOC-TIDE-CAPABILITIES.md and docs/tide-mcp-learning.txt. Review the full
   pre-existing diff before staging; do not treat all changes as new in this review.

Exclude deploy/cloudrun, private configuration and data. Nothing was staged during the documentation review.

## Documentation validation

Targeted installed Prettier formatting completed for the ten reviewed Markdown
files. Relative file-link check: 28 targets checked, no missing files. Documented
root pnpm script check: 76 references matched package.json, no unknown names.
These checks do not execute the commands or validate external URLs/Markdown
fragment anchors. git diff --check passed. Mermaid source was reviewed but not
rendered in the slide application; replace the two older screenshot exports there.
No application tests, builds, audits, services or Tide MCP research were run.
At the end of the documentation review, all changes were unstaged. Existing capability/learning edits and parked cloud
files were preserved; neither instruction file nor source behaviour was changed.
