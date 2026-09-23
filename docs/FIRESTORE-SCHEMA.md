# Firestore Schema

## Overview

Firestore is server-only — all access happens through the backend's `adminDb`
(`backend/src/lib/firebase.ts`), after the TideCloak auth middleware has verified and authorized
the request. The browser never connects to Firestore directly — `firebase/firestore.rules`
denies all direct client access with a single default-deny rule. No current collection exists
yet; the `users` collection below is a documented example pattern.

## Schema versioning

Every document in every collection **must** include a `_schemaVersion` field:

\`\`\`typescript
_schemaVersion: 1 // increment when doing a breaking schema change
\`\`\`

This enables **lazy migration** — when a document is read, check `_schemaVersion` and migrate on the fly if it's behind current.

**Rules:**

- `_schemaVersion` is always `1` on creation
- Non-breaking changes (adding optional fields with defaults) keep the same version
- Breaking changes (rename, remove, type change) increment the version and require a migration function
- Never remove `_schemaVersion` from a schema

---

## `users` collection

**Path:** `/users/{userId}`
**Access:** Owner-only (user can read/write their own document; admins can read all)

| Field            | Type                | Required | Description                                           |
| ---------------- | ------------------- | -------- | ----------------------------------------------------- |
| `uid`            | `string`            | Yes      | TideCloak subject (`sub`) claim (same as document ID) |
| `email`          | `string`            | Yes      | User's email address                                  |
| `displayName`    | `string \| null`    | Yes      | Display name from Auth or profile                     |
| `photoURL`       | `string \| null`    | Yes      | Profile photo URL                                     |
| `role`           | `'user' \| 'admin'` | Yes      | User role — immutable by user after creation          |
| `createdAt`      | `Timestamp`         | Yes      | When the document was created                         |
| `updatedAt`      | `Timestamp`         | Yes      | When the document was last updated                    |
| `_schemaVersion` | `1`                 | Yes      | Schema version for lazy migration                     |

**Creation:** Not yet implemented. This collection is a documented example only — no current
route creates, reads, or writes it. When implemented, creation would happen server-side (a
backend route using `adminDb`, called after TideCloak authentication), not from the frontend.
**Deletion:** Hard-delete would be disabled in security rules if implemented. Use `deletedAt`
field for soft-delete.

---

<!-- Add new collection schemas below -->

```

```
