# Firestore schema

Only the backend Firebase Admin SDK accesses storage, after verified Tide
authentication and SOC membership. Browser rules remain deny-all. Explicit local
demo mode requires the dedicated demo project and emulator; it cannot fall back
to cloud storage. No new cloud writes or deployments were performed.

## Collections

| Collection / key                                      | Purpose and safe fields                                                                                                                                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accessRequests / UUID                                 | Immutable requesterRef, incidentId, one resource, read permission, trimmed reason, durationSeconds, acknowledgement, version; status, distinct approvals, server millisecond timestamps, rejectionReason, authorityStatus |
| requestScopes / SHA-256 of identity/incident/resource | Points to the newest request for atomic duplicate prevention; no hard deletes                                                                                                                                             |
| requestOperations / SHA-256 of actor/operation UUID   | Fingerprint and requestId enforce safe identical retries; conflicting input returns 409                                                                                                                                   |
| approvalRecords / operation hash                      | Actor reference, requestId, approve/reject, rejection reason and server timestamp; append-only                                                                                                                            |
| authorityJobs / request UUID                          | Stable immutable version/scope/duration correlation; currently blocked with tide_authority_unavailable; no fabricated authority bytes                                                                                     |
| auditEvents / operation hash or stable lifecycle ID   | Event type, actor reference, request/version, incident/resource, permission, duration, safe reason, effective and observation timestamps; append-only                                                                     |

All documents include _schemaVersion: 1 and deletedAt: null. No deletion or
audit-update API exists. Hashes are stable pseudonymous identifiers, not encryption,
signatures or Tide capabilities. The actor reference hashes the verified issuer
and subject. Display names and submitted identities never determine ownership.

Timestamps are integers in Unix milliseconds. Durations are explicitly seconds:
900, 1800 or 3600; optional 60 only when trusted local-demo configuration enables
it. Active grant timestamps are reserved; current code never activates a grant.

## Transactions and state

Creation reads the operation ledger and scope pointer in one transaction, checks
the current lifecycle, creates the request, replaces the pointer and appends an
audit event atomically. Decisions/cancellation also write their operation, safe
decision record and audit atomically. Firestore transaction writes are buffered
until all reads complete. Retried transactions do not call Tide or any external
authority service.

State machine:
pending -> pending after first distinct approval;
pending -> authorising after second;
pending -> rejected after one eligible rejection;
pending -> cancelled by requester.
Rejected/cancelled/expired are terminal. Authorising remains blocked until a
real verified Tide integration exists. There is no current authorising -> active
operation, server-signed substitute or configuration switch.

Reserved active -> expired reconciliation checks server time at each operation.
The effective expiry timestamp is separate from the observation timestamp.
Expiry audit uses a stable ID and is materialised once. Public views never accept
an active database flag as authority; they report authorising/locked.

A rejected/cancelled/expired scope can be requested again. Pending/authorising
or unexpired active records block duplicate scope creation atomically. Read paths
validate stored request shape and distinct-user/quorum invariants.

## Queries and indexes

My Requests filters requesterRef and sorts createdAt/name descending. Approvals
filters pending status and applies requester/previous-approver exclusions. Each
page examines at most 50 rows plus a sentinel; a page can be empty after eligibility
filtering while an older-page cursor still exists. Audit uses createdAt/name
descending. Cursors contain only a timestamp/document ID and are validated.
Required composite indexes are in firebase/firestore.indexes.json.

Incident status reads three exact scope pointers instead of scanning an unbounded
history list. Current incident data remains synthetic in backend/src/data/incidents.ts.

## Evidence storage boundary

Ciphertext/authority persistence, evidence seeding and real grant records are
blocked pending the verified Tide contract/wire format. No protected plaintext,
mock ciphertext, private policy bytes or master keys are stored in these
collections. Future evidence storage must contain only validated Tide ciphertext,
safe scope metadata and references, and must not be exposed through ordinary
incident/request/audit APIs.

These are normal Firestore records, append-only through application APIs.
They are not cryptographically tamper-proof. Fabric authority must be verified
independently of every status/count/metadata flag.

## Retention

Native and Docker demos export/import a dedicated ignored demo-data/ directory.
Graceful export/import retention is implemented in scripts but not verified in
this restricted environment. Crashes can lose changes since the last completed
export. Isolated tests use a different project, ports and .emulator-tests/ directory.
