# Tide capability assessment

## Current authority gate — controlled review, 16 October 2026

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
