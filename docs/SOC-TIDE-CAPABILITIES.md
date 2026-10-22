# Tide capability assessment

## Tide update delivery check — 22 October 2026

Tide team reports that its latest MCP resolves the integration blocker. This is
a lead, not an implementation result. Braces/uuid work is paused with findings
preserved; failed registry access does not prove no compatible upgrade exists.

**Observed connection:** 20 exposed tide tools advertise Tide Agent Pack 1.9.23,
the same advertised version used in the earlier assessment. This is the session's
tool-descriptor metadata, not an independently verified latest server release.
No private connection config, command arguments, credentials or adapter was read.

**Supported discovery performed:** tide_list category canon, playbooks and
scenarios queried the live index. Canon/playbook entries match the earlier set;
scenarios include relationship-attestation and attestation (already available in
earlier live reads despite older descriptor enums). Resources and resource-
templates discovery on server tide both returned -32601 Method not found.
This is unsupported resource discovery, not a server outage or missing authority
feature. No exposed agent tool reconnects/restarts this MCP session. Querying the
live content index is not the same as reconnecting or refreshing negotiated tools.

**Focused guidance delta:** tide_canon custom-contracts / Built-in Contracts
still lists the same four contracts, including RelationshipAttestation:1 with
ORK-main provenance c69fc4f6, and still describes custom signing contracts as
Tide-team-operated/test-network-only. tide_canon iga-change-requests-api / JIT
still reports no matching heading. tide_playbook deploy-forseti-policy returned
the existing generic policy-deployment guide, including v3-era examples; it did
not provide a narrowed JIT SOC flow. No updated enforcement contract or version
matrix was established. No further large/repeated retrieval is justified before
the connection is refreshed.

Consequently the requirement mapping below is unchanged: field crypto helpers
and named-user/record binding have building blocks; non-requester SOC quorum,
exact intent binding, completion verification, cached-policy expiry and exact
compatible versions remain unverified. A missing updated guide is not proof that
Tide's claimed newer capability does not exist. Evidence remains locked and no
new implementation proposal or policy/SDK change is justified yet.

**Minimum owner action:** in the desktop app's Settings -> MCP servers, restart
the existing tide connection without editing its command/URL/auth settings, then
return to this chat. Tide's own tool descriptor also advises reconnecting via
/mcp or starting a new session because rebuilding alone does not update a live
connection. /mcp displays connected tools; it is not an invented reconnect CLI.
If the UI offers no server restart, reopen the app/session with the same saved
connection. Do not remove/re-add it, run an unverified installer or switch an
endpoint blindly. If the advertised build/catalogue remains unchanged afterward,
the verified Tide update/distribution procedure or expected new build identifier
is still needed; no package/update command was supplied by this check.

Official client procedure: [MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
describes Settings -> MCP servers -> Restart and /mcp discovery. The agent cannot
perform that client connection operation with the currently exposed tools. After
refresh, inspect new metadata/catalogue first, retrieve only the changed SOC/JIT
resource and complete a versioned proposal before requesting runtime approval.
No app/Docker service, Tide policy/account/contract/key/grant, dependency or
connection setting was changed. No email, installation, commit or push.

## Focused authority feasibility review — 22 October 2026

**Result: full SOC unlocking/expiry is blocked with the installed packages.**
One-field policy encryption has supported building blocks, but the installed
policy format cannot express a signed grant deadline, and the documented
built-in relationship grant is not the required two-other-SOC-staff grant.
No runtime, policy, identity, deployment or dependency was changed; evidence
stays locked. Current HEAD: 505e081bd972baa0540d38f7a9f04f76367cb1ab. Earlier
working deployment and owner verification are preserved, not repeated here.

### Requirement to API/policy mapping

| Requirement                                                           | Supported mechanism                                                                                                                                                              | Source/version and evidence level                                                                                                                             | Remaining gap                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encrypt/decrypt one field                                             | IAMService.doEncrypt(items, signedPolicyBytes), doDecrypt(items, signedPolicyBytes); PolicyEnabledEncryption:1 / PolicyEnabledDecryption:1                                       | Installed JS 0.14.20 runtime; setup-forseti-e2ee guidance                                                                                                     | Application disables request enclave; approved public enclave configuration, governed roles and a signed policy are not established. No live field encryption run.                                                                                                                      |
| One authenticated requester                                           | RelationshipAttestation:1, PRIVATE, subjectType User, subjectId grantee tideuserkey, assignmentId single record tag; read-only policy roles string contains only _tide_decryptor | MCP relationship-attestation scenario; ORK main c69fc4f6 (source provenance claimed by pack, 16 October); external local-stack caller checks reported by pack | Our network availability/version unknown. Need trusted issuer/subject-to-user-key mapping, never an arbitrary client-submitted key. This is not an application actorRef or JWT sub.                                                                                                     |
| Two eligible other staff endorse same immutable intent                | EXPLICIT approval stage, ValidateApprovers, RequireMinWithRole and ForbidSelfApproval are general Forseti mechanisms                                                             | custom-contracts canon parts 1 and 2; generic examples, not a tested SOC contract                                                                             | Relationship grant is admin-approved with IMPLICIT use; it does not establish this SOC quorum. Need exact distinct eligible VUID checks, requester exclusion and approval binding for one request/version/field/duration. No changing existing accounts into admins or temporary roles. |
| One incident/field/ciphertext/version; replay/substitution protection | Relationship assignmentId tag constrains record scope; signed Policy:1 construction and BaseTideRequest approval payload include model, draft hash and request expiry            | Pack relationship scenario; installed BaseTideRequest in @tideorg/js 0.14.25                                                                                  | Tag checks alone do not specify the complete SOC intent/ciphertext-version/policy binding, replay lifecycle or cross-grant substitution verifier. Application hashes are not signed authority.                                                                                          |
| Verify genuine completion                                             | PolicySignRequest.New(policy), initialize/create -> operator approval -> executeSignRequest(..., true) -> attach returned VVK signature -> policy.toBytes()                      | heimdall-tide 0.14.20; installed TideCloak methods; pack signing flow                                                                                         | Popup approval is not completion. Policy.from parses, not cryptographic verification. Need authoritative key/trust provenance, signature/intent correlation and idempotent completion verification before activating authorityJobs. No live receipt.                                    |
| Deny every new decrypt after 15/30/60 minutes                         | Policy v4 signed expiry is documented; relationship scenario says network checks expiry before contract execution                                                                | Official 0.14.28 release notes; pack ORK-main guidance, not our runtime                                                                                       | Installed @tideorg/js 0.14.25 writes latestVersion 3 without policy expiry. Need supported v4-capable version set, trusted activation/deadline semantics and direct cached-policy/ciphertext expiry tests. Do not hand-encode v4 or use backend deadlines alone.                        |
| Existing SDK compatibility                                            | Nextjs/React/JS 0.14.20; heimdall-tide 0.14.20; transitive @tideorg/js 0.14.25                                                                                                   | Package manifests resolved from the installed dependency chain; source read only                                                                              | React 0.14.20 wrappers drop policy argument; direct JS API supports it but enclave is disabled. Transitive availability is not permission to add direct dependencies. Server/enclave/ORK compatibility remains unknown.                                                                 |
| Failure behaviour                                                     | Denials may surface as threshold/reachability errors; policy-expired and unsigned/missing-policy failures are documented                                                         | relationship scenario and custom-contracts part 2                                                                                                             | No claimed outage or raw-error presentation. Use fixed safe local error categories, no raw SDK/callback/token data, no automatic policy change or retry. Need live negative acceptance.                                                                                                 |

### Exact installed limitation: request expiry is not grant expiry

Installed Policy.js serializes version, contractId, model ids, key id, approval
and execution types, and params, plus optional signature. Version 3 has no signed
policy deadline field and the parser does not implement Policy v4.
BaseTideRequest.setCustomExpiry(seconds) changes that request's expiry; in
PolicySignRequest.New(policy), the requested policy bytes are already the draft.
It does not add a deadline to the signed policy. Thus 900/1800/3600 passed to
setCustomExpiry cannot be treated as the SOC evidence-access lifetime.

The official [0.14.28 release notes](https://docs.tide.org/ReleaseNotes/Tidecloak-0.14.28)
introduce policy-v4 expiry, holder-bound JIT signing/delegated approvals and React
policy forwarding. Those are relevant upgrade candidates, not evidence that
0.14.28 satisfies every SOC guarantee or a selected compatible version set.
No registry/latest upgrade or realm change was made. The pack version table is
an August 0.14.17 snapshot; its ORK-main examples are not a tested compatibility
matrix for our installed 0.14.20/0.14.25 combination.

### Quorum and no-email boundary

The built-in RelationshipAttestation:1 resolves the shape of a named-user,
record-tagged, read-only policy. It does not resolve who may issue the SOC grant:
the scenario specifies a tide-realm-admin approves it. Raising an admin quorum
or relying on application approval counts is not proven equivalent to two of the
other three recognised staff endorsing exactly this immutable access intent.
The generic multi-approver/business-hours sample is not the timed SOC example.

The current canon restricts custom-contract deployment to Tide-team-operated,
experimental test networks. Local authorship/compile checking cannot put a new
contract on the existing network. This makes a custom-contract fallback
unavailable autonomously under this scope. No email/contact is needed to
establish that limitation; no email, Discord message or change request was sent.
A supported existing delegated-JIT signing rule may remove custom deployment,
but its exact SOC eligibility, signed intent and expiry semantics are not supplied
by the available material. Do not invent them or claim built-in impossibility
across all future versions.

### DPoP dependency finding

DPoP is separate API/session protection. Installed JS passes policy bytes to the
request enclave without requiring a relay file in that call path; useDPoP is an
independent opt-in. We found no evidence that the missing tide_dpop_auth.html is
the prerequisite blocking policy serialization or this quorum contract. This is
not live proof that the present server allows every E2EE flow without DPoP.
The scenario still requires API token/proof verification. F8 stays unresolved;
do not disable DPoP, enable a flag alone or broaden client policy. Any necessary
DPoP runtime migration needs its own approval and acceptance.

### Bounded compatibility/JIT preflight outcome — 22 October 2026

**Outcome: ask one precise capability/deployment question; not implementation-ready.**
The approved bounded lookup is complete. No further broad search or package
installation is justified by these results.

1. **Compatible stack not established.** Official 0.14.28 and 0.14.29 release
   notes describe signed Policy v4 expiry; 0.14.28 also describes holder-bound
   per-grant JIT and delegated approval via iga.jitApproverRole. 0.14.28 names
   enclave SRI sha256-yTUwAqGZKSiGrDKqYAN5dJYv0Mpq0BtMj1vOm34LaFg=;
   0.14.29 names sha256-k70kLV9gsftSFeU8yu5memp7cjJqF4QFtAOKzfTz+48=.
   These release-scoped values are useful provenance, not a tested/pinned
   SDK/server-image/ORK build matrix. No SDK version set or ORK revision is
   selected. The linked 0.14.28 detailed GitHub changelog returned 404.
2. **SOC quorum not established.** Focused MCP iga-change-requests-api lookup
   had no JIT heading. Its threshold/approver section describes administrative
   gates (including the signed tide-realm-admin policy and different ADOPT/
   FirstAdmin cases), not the SOC signing rule. The official Admin API Reference
   has no JIT, policy-sign or expiry match. Neither source specifies an existing
   signing rule enforcing two distinct eligible non-requester identities on
   exactly one requester/incident/field/duration, with verifiable completion.
   This is a documentation/compatibility gap, not proof no such feature exists.
3. **Custom deployment remains conditional.** If a supported built-in/delegated
   JIT signing rule satisfies the full SOC rule, no custom deployment is shown
   necessary. If a new rule is needed, previously retrieved current canon limits
   custom-contract deployment to Tide-operated experimental test networks. We
   cannot pick either branch conclusively from these sources, nor reconstruct
   an upload mechanism or replace the rule with administrator approvals.
4. **JIT changes issuance timing, not the acceptance requirement.** Signing near
   grant time can carry a signed deadline and holder binding, but does not by
   itself prove approver eligibility, requester exclusion, exact intent binding
   or 15/30/60 minutes from authoritative activation. New Fabric decrypts using
   cached ciphertext/policy must still fail at/after that deadline independently
   of the application and policy-row cleanup. Request expiry is not grant expiry.

Sources: [0.14.28](https://docs.tide.org/ReleaseNotes/Tidecloak-0.14.28),
[0.14.29](https://docs.tide.org/ReleaseNotes/Tidecloak-0.14.29),
[Admin API Reference](https://docs.tide.org/API/Admin%20API%20Reference), and
Tide MCP iga-change-requests-api, Threshold & approver resolution. The official
E2EE example is self-encryption/default-role setup, not a SOC emergency grant.
No realm/API operations in these examples were executed; the deployment is unchanged.

**Question for Tide — prepared only, not sent:**

Which exact SDK versions, TideCloak image, enclave SRI and ORK build support a
JIT grant where two distinct eligible SOC staff other than the requester sign
the same requester/incident/field/15-, 30- or 60-minute intent? Please provide the
existing signing-policy ID, API/intent/completion-verification format and trusted
activation/deadline semantics that reject new Fabric decryptions with cached
ciphertext/policy after expiry; if no existing policy supports this, specify the
Tide-operated custom-contract deployment required and supported network.

### Historical proposed preflight (completed above) — review only, no runtime implementation yet

Do not change evidence behaviour with current packages. First approve a bounded
compatible-version/JIT contract preflight: identify a published v4-capable SDK,
matching server/enclave/ORK build, and an existing signing policy that enforces
two eligible non-requester staff on the canonical grant. No installation, policy
or realm mutation follows from this proposal. If no supported signing rule
exists on that version set, the exact blocker is deployment of that rule, not a
missing React component or a missing DPoP asset. Trusted completion validation
and deadline semantics must be specified before code can be implementation-ready.

Conditional change boundary, only after contracts and versions are approved:

- frontend/src/lib/tidecloak/config.ts and frontend/src/providers/AuthProvider.tsx:
  approved public request-enclave settings and policy-aware SDK bridge; preserve
  current successful login, PKCE/state/nonce and fixed safe errors.
- frontend/src/lib/api/access.ts, frontend/src/types/access.ts and
  frontend/src/features/access-requests/components/AccessRequestView.tsx:
  one selected field, explicit signing/decrypt actions and safe no-store transport;
  no SDK-secret or raw-error display. No speculative UI implementation now.
- backend/src/access/types.ts, backend/src/access/service.ts,
  backend/src/routes/access.ts and backend/src/access/store.ts: immutable
  ciphertext/policy/version references, validated completion and durable job
  reconciliation; external calls outside retrying Firestore transactions.
- A reviewed authority-verification module and browser evidence-policy helper
  would be necessary; file/API names cannot be fixed before the supported
  contract/verification API is known. No invented verifier was scaffolded.
- Package manifests/lockfile only if separately approved exact dependencies are
  required. Public SDK imports must be declared directly, not reach into pnpm
  internals. No specific upgrade is approved here.
- Configuration actions requiring separate review: enable public enclave setup,
  confirm approved operation roles/mappers and trusted user-key mapping, provision
  only the reviewed signing/decryption policies, and any required SDK/server
  compatibility change. Do not assume roles or change accounts automatically.

Acceptance: exact-byte positive/negative signature fixtures; distinct/self/duplicate
approvers; wrong requester/field/incident/evidence version/policy; changed intent,
cross-grant replay and races; unsigned/malformed/unknown-key completion; deadline
and clock-boundary cases; safe failure and synthetic-secret non-disclosure.
Then owner-private live test with requester and two distinct eligible other staff:
real one-field encryption, signed completion and requester-only read; outsider and
scope substitution denied; all 15/30/60-minute grants deny NEW direct Fabric
decryptions at/after deadline using cached ciphertext/policy and fresh sessions,
without backend participation. Plaintext already copied cannot be revoked.
Mock fixtures, time simulation or a compile harness cannot replace those live tests.

### Retrieval provenance and limits

Focused read-only MCP calls this review: custom-contracts (both parts),
setup-forseti-e2ee, version-policy and relationship-attestation scenario, served
by Tide Agent Pack 1.9.23. All were guidance reads; no runtime methods described
in them were called. The relationship reference template is documented by the
pack; its revision-2 and revision-3 source/live claims are external to our app,
not independent verification here. Built-in availability on our network remains
unknown. Official release and Forseti pages were also read. No repeated failed
DPoP lookup, broad template search, SDK execution, policy/grant creation or tests.
Earlier statements below about no further calls describe the earlier review's
scope, not this newly authorised read-only investigation.

## Owner Docker evidence — 22 October 2026

Owner private login and persisted application workflow/restart passed, including
two other staff decisions and retained audit. Requester evidence remained locked.
This corroborates the existing authority blocker, not a genuine Tide grant,
cryptographic completion or Fabric expiry test. F8/DPoP remains unresolved;
ordinary successful local login does not resolve the peer's original failure.
See [deployment evidence](SOC-WEEK9-DEPLOYMENT.md). No new Tide lookup performed.

## Historical authority gate — controlled review, 16 October 2026

**No supported evidence-unlocking implementation can yet be selected.** Reused
completed setup-forseti-e2ee, custom-contracts and version-policy evidence;
none of those lookups was repeated. Application source still deliberately
returns evidenceAvailable: false, creates a blocked authority job at quorum,
and rejects every evidence operation. No user data or Tide setting was read.

### Application enforcement versus Fabric enforcement

Verified-token issuer/subject hashes identify application actors. Transactions
exclude the requester, reject duplicate reviewers and retain immutable create
input, scope records, operation fingerprints and audit events. Durations are
900/1800/3600 seconds (60 only in the separately gated demo). These hashes,
rows and deadlines are application controls, **not** cryptographic identities,
signed endorsements, authority or trusted Fabric expiry. No active production
grant is created. A backend clock or requestView cannot validate direct SDK
use of cached ciphertext. QEA administration is not SOC endorsement quorum.

### Exact missing contracts/API semantics — one consolidated list

1. **Immutable intent/policy contract:** versioned canonical encoding and signed
   field definitions for request ID/version, one requester, incident, selected
   field, read permission, duration and authoritative time bounds; bind exact
   ciphertext/evidence version and policy/contract identity. Specify hashing,
   domain separation and substitution rejection; the application's scope hash
   is not a replacement. No format is invented here.
2. **Identity and eligibility:** supported mapping from verified issuer/subject
   to a Tide signing identity/key and the eligible four SOC staff identities; how
   Fabric verifies membership,
   two distinct other signers and requester exclusion at endorsement/use time.
3. **Endorsement API:** exact compatible SDK/contract calls, signed bytes and
   verification/trust rules for both signers endorsing the same immutable intent;
   duplicate, changed-intent, cross-request and replay rejection semantics.
4. **Completion/activation receipt:** exact aggregation/completion artifact,
   signature/trust verification and scope/ciphertext/policy correlation; how
   the requester becomes the sole holder and how a durable job is reconciled
   idempotently across retries/races without trusting Firestore flags.
5. **Trusted expiry:** which component defines activation/start/deadline, trusted
   clock/skew and 15/30/60-minute calculation; confirmation that every new Fabric
   decryption is rejected at/after that deadline even with cached ciphertext/
   old authority or direct SDK calls. Expiry cannot erase copied plaintext.
6. **Tested compatibility and failures:** exact policy/contract, server/image,
   SDK/React/JS, enclave and ORK versions plus public prerequisites, encryption/
   policy forwarding APIs and safe failure categories. Current React 0.14.20
   does not forward the JS helper's optional policy argument. A type signature,
   policy v4 or a newer release note is not a tested end-to-end contract.

### Draft question for Tide — not sent

Can Tide supply one versioned worked SOC contract covering: (1) canonical signed
intent binding requester, incident, selected field, read scope, duration and exact
ciphertext/policy; (2) verified issuer/subject-to-Tide identity mapping and four-user
eligibility; (3) exact APIs and signed bytes for two distinct non-requester
endorsements of that same intent, rejecting replay/substitution; (4) verifiable
completion/activation receipt and idempotent reconciliation; (5) trusted Fabric
15/30/60-minute expiry denying new decryption even with cached ciphertext or old
authority; and (6) tested SDK/server/enclave/ORK/contract versions, policy-forwarding
APIs and safe failure semantics?

This question has not been sent. The separately authorised single DPoP relay
lookup returned only a missing-template error; it resolved none of these six
authority contracts. Genuine encryption, authority and expiry remain incomplete;
evidence stays locked. No additional Tide call is authorised.

### Concrete next phase, dependent implementation stopped

Obtain one versioned worked SOC contract/fixture answering those six questions,
not another generic Forseti/E2EE overview. Review it against the current request
schema and TIDE-01/02/03 cases before proposing exact SDK/version changes. No new
Tide MCP lookup is authorized by this review; any future call must be separately
approved by exact tool name and narrow purpose.

Once the contract is supported and approved, the smallest implementation boundary
is the existing authorityJobs -> reviewed completion verifier -> activation flow,
plus genuine encryption/ciphertext-policy correlation and requester-only decryption.
Keep external side effects outside retrying Firestore transactions. Design an
adapter to actual supported APIs only after their semantics are supplied; do not
add a guessed provider interface or completion endpoint now. Implement one-field
read access with real trusted expiry, then exercise negative fixtures before
owner-private live acceptance. Never activate from approval counts alone.

The current branch has no ciphertext fixture to decrypt, no validated receipt
and no live expiry result. Evidence remains locked; F8 and DPoP are separate
from cryptographic evidence authority. Remaining manual/live checks are in the
runbook's current completion checklist. Historical source assessment below is
retained, not a declaration that a newer SDK or policy fixes these gaps.

Updated 8 October 2026. This is a source and compatibility assessment, **not**
live Fabric verification. Evidence access remains disabled until every authority
requirement is supported, configured and exercised with real users.

## Completed guidance and remaining limits

The user reports that the specifically authorised setup-forseti-e2ee,
custom-contracts and version-policy lookups completed. They are not awaiting
approval. No call was repeated or further Tide research performed in this task.
Those sources did not establish the complete network-tested SOC integration.

| Requirement                                                     | Application evidence                                                                                                                       | Tide/Fabric evidence gap                                                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Two distinct recognised other approvers; no self-review         | Verified-token identity references, membership and transactional distinct-user checks; unit assertions; owner-reported real-emulator probe | No tested SOC contract or endorsement format proving recognised cryptographic endorsers and requester exclusion |
| One requester, incident, resource, read permission and duration | Strict immutable create input, scope/operation checks and safe projections                                                                 | Exact signed-intent binding, completion validation and evidence-policy correlation are unresolved               |
| 15, 30 or 60 minutes; no further access after deadline          | Requested duration is recorded; reserved/tampered active records test application denial only; no real grant starts                        | Fabric deadline enforcement, including direct SDK use of cached ciphertext/authority, is unverified             |
| Genuine encryption and authorised decryption                    | SDK helpers exist; application enclave/unlocking is disabled; evidence always denied                                                       | No live encryption, scoped authority, authorised decryption or expiry acceptance result                         |

Policy v3 versus v4, the minimum compatible SDK/enclave/ORK versions and whether
the installed 0.14.20 packages can satisfy the required flow remain unconfirmed.
Historical release-note mentions of signed expiry or React policy forwarding do
not establish the required end-to-end semantics. **Neither policy v4 nor an SDK
upgrade is a confirmed solution.** No version change is proposed as sufficient.

## Historical source/SDK assessment — 7 October 2026

These references preserve the earlier helper and general-engine observations.
They are not a working SOC contract specification or live authority proof.

| Requirement                            | Historical mechanism/source                                                                         | Local prerequisite                                                                               | Status                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Browser encryption                     | `doEncrypt` with string/bytes and tags, JS tutorial and installed JS 0.14.20 types                  | QEA-enabled realm, Tide-linked encryption identity, full compatible public enclave configuration | Available in SDK; application enclave currently disabled; no encryption performed |
| Browser decryption                     | `doDecrypt`, JS tutorial and installed SDK                                                          | Supported scoped policy and authorised user session                                              | Helper exists; deliberately not wired                                             |
| Two distinct other SOC users           | Forseti `ValidateApprovers`, explicit policies, self-approval constraints                           | Reviewed SOC-specific contract and authenticated cryptographic endorsements                      | General mechanism documented; exact integration unverified                        |
| Requester/incident/resource/read scope | Forseti executor/data checks; JIT holder-bound intent described in 0.14.28 notes                    | Verified immutable grant intent and evidence-policy binding                                      | Contract/wire format and verification unresolved                                  |
| Tampering cannot create authority      | Fabric-enforced contract/policy rather than application database flags                              | Verify signed authority independently of Firestore state                                         | Production denies all evidence access until real verifier exists                  |
| Expiry also denies cached ciphertext   | Earlier 0.14.28 release-note summary mentions signed expiry; required semantics are not established | Compatible realm/ORK/enclave/SDK; verified expiry on every Fabric operation                      | Unverified; v4 is not a confirmed solution                                        |

Installed `@tidecloak/nextjs`, React and JS packages are 0.14.20. The JS
`IAMService` types include an optional `Uint8Array` decryption policy argument.
The installed React context exposes single-argument helpers; the newer release
notes specifically introduce policy forwarding in React. A JS type alone does
not prove deployed Fabric support, policy verification or expiry semantics.

The current frontend only supplies public OIDC connection fields and explicitly
disables the request enclave. Do not publish a full private adapter as browser
configuration. User must provide approved public enclave setup independently.

An administrative QEA queue is not this application's business approval queue.
The documented administrative quorum is not automatically the required two of
the other three SOC staff. Each application approver must be cryptographically
bound to the same immutable grant intent with the requester excluded.

## Sources

- [JS tutorial](https://docs.tide.org/Languages/JavaScript/tidecloak-js-tutorial)
- [E2EE administration](https://docs.tide.org/Admin/e2ee)
- [Forseti policy engine](https://docs.tide.org/Core-Concepts/forseti-engine)
- [0.14.28 release](https://docs.tide.org/ReleaseNotes/Tidecloak-0.14.28)
- Installed SDK declarations in `node_modules/.pnpm`, inspected without private
  configuration. The requested Next.js reference URL failed retrieval through
  the documentation tool; no content was assumed from that failure.

## Required next evidence

Obtain the supported E2EE policy workflow, exact contract and intent format,
signature/completion validation, two-user endorsement flow and signed expiry
semantics. Confirm minimum compatible versions before requesting any dependency
or Tide image change. Test with four distinct authorised accounts, including
direct SDK attempts using cached ciphertext and previous authority at expiry.
Never assign permanent global selfdecrypt permission as an emergency-access fix.
