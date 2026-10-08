# Tide capability assessment

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
