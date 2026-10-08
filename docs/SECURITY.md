# Security

## Current boundaries

TideCloak is the sole authentication provider. Express verifies Tide JWT signature
using embedded JWKS, actual issuer, client azp and time claims. Recognised SOC
membership gates incidents and access workflow APIs. /api/me remains
authentication-only. Stable owner/reviewer references derive from verified issuer
and subject. Submitted identities, roles, counts, statuses and times are rejected.

Frontend role guards are UX controls. Server Action session helpers remain
fail-closed placeholders; the implemented workflow calls verified Express APIs.
There is no Firebase Authentication or browser Firestore SDK. Direct-client
Firestore rules deny all access. Firebase Admin is confined to lib/firebase.ts.

Explicit local demo storage requires a dedicated demo project and loopback/internal
emulator host; absent/unavailable emulation never falls back to cloud. No real
cloud database writes or deployments were performed.

## Application approvals and Tide authority

All four SOC roles are equal. Self-review, duplicate approvals and duplicate open
scope requests are denied server-side. Transactional idempotency protects retries
and concurrent decisions; lifecycle/audit writes are atomic.

Two business approvals produce authorising. Genuine Tide/Fabric authority,
ciphertext setup and cached-ciphertext expiry are not yet integrated or live
verified. Evidence stays locked. No database active flag/count, server-signed
substitute, master key, home-made encryption, mock ciphertext or permanent
selfdecrypt permission grants access. Production exposes no activation endpoint.

Reserved server-time expiry is enforced at now >= expiresAt and can materialise
one audit event with effective and observation time. This unit-tested application
boundary does not prove direct Fabric expiry. See SOC-TIDE-CAPABILITIES.md.

## HTTP and disclosure

Helmet remains first. CORS is configured-origin only, with no wildcard credentialed
policy. Allow-listed OPTIONS preflight precedes authentication; GET/POST still
require tokens. Global rate limiting/body caps remain. Strict Zod schemas reject
unknown/escalating fields. Invalid JSON is 400; excessive bodies are 413.

API metadata responses and client fetches use no-store. Tokens are passed only in
Authorization headers, never URLs or added state/storage. No application evidence
export/download exists. Provider errors/stacks are reduced to generic messages;
error logging never prints payloads, raw provider errors, keys or credentials.

Ordinary incident responses preserve explicit safe allow-lists and only expose
protected resource names. Request/audit responses also use explicit projections.
No protected plaintext values are present in incident fixtures, ordinary database
fields, logs or API responses. The current application does not decrypt anything.

Append-only application audit is not cryptographically tamper-proof. A database
edit cannot create cryptographic authority. Expiry prevents future access; it cannot
erase information already copied or photographed.

## Private configuration and runtime artifacts

Real .env files, adapters, keys, credential/service-account files, licences, tokens,
cookies and browser storage remain user-owned and are not inspected or modified.
Example additions contain public demo defaults/placeholders only. The agent does
not perform account/role/realm/client/policy administration.

Docker build contexts exclude private configuration, realm/data directories,
emulator exports, database volumes and build output. Dockerfiles copy explicit
source/manifests and install frozen lockfile dependencies. Frontend receives only
required public configuration; backend adapter data is a runtime secret/read-only
mount. Existing Tide image and volume are external to demo Compose and unchanged.
All published demo ports bind loopback; emulator management/UI is not public.

Existing frontend header rules for silent SSO and enclave framing are retained.
No security settings or repository guardrails were weakened to resolve blocked
checks. Existing dependency security pins/lockfile are preserved. The latest
owner normal-terminal audit completed and confirms 3 Critical, 5 High and
10 Moderate unresolved findings. The earlier agent audit fetch failed with exit 1
and remains historical evidence. A completed audit with findings is not clean.
No finding is assumed exploitable or dismissed; no dependency patch was applied.

## Verification

Consult SOC-POC-BUILD-STATUS.md for actual results, SOC-POC-RUNBOOK.md for manual
setup/group checks, and TESTING.md for the distinction between mocked unit checks,
isolated emulator integration and real Fabric verification. The complete PoC
must remain labelled incomplete until cryptographic scope/quorum/expiry pass live.
