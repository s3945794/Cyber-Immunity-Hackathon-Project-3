---
description: Add a new server-side Firestore collection — creates the TypeScript type, an adminDb-backed backend accessor, Firestore security rules confirmation, and a FIRESTORE-SCHEMA.md entry. Use when adding a new collection to the data model. All access is server-side, via the backend, after TideCloak authorization — the browser never talks to Firestore directly.
argument-hint: '[CollectionName e.g. AccessRequests]'
---

# Skill: /firebase-collection

Add a new typed Firestore collection with full integration across backend types, backend data
access, security rules, and docs. Firestore is server-only in this project — `firebase/firestore.rules`
denies all direct client reads/writes, and the browser has no Firebase SDK at all. Every read or
write goes through the Express backend's `adminDb` (`backend/src/lib/firebase.ts`), after the
TideCloak auth middleware has verified and authorized the caller.

## Step 1 — Gather requirements

Ask the user:

1. **Collection name** (plural, snake_case, e.g., `access_requests`, `audit_events`)
2. **Model name** (PascalCase singular, e.g., `AccessRequest`, `AuditEvent`)
3. **Fields** — list with types
4. **Access pattern** — which SOC roles (or TideCloak claims) may read/write this collection? Authorization is enforced in the backend route/middleware (`requireRole`/`requireAnyRole` in `backend/src/middleware/auth.ts`), not in Firestore security rules.
5. **Which API route(s) will read/write it?** (new or existing — see `backend/src/routes/`)

## Step 2 — Files to update/create

### 1. `backend/src/types/{feature}.ts` (or alongside the route file) — add the type

```typescript
export interface {Model} {
  id: string
  // ... fields
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
  _schemaVersion: 1 // required on every collection — see docs/FIRESTORE-SCHEMA.md
}
```

### 2. Backend route or a small `backend/src/lib/{feature}.ts` helper — read/write via `adminDb`

```typescript
import { adminDb } from '../lib/firebase'
import type { {Model} } from '../types/{feature}'

export async function get{Model}(id: string): Promise<{Model} | null> {
  const snap = await adminDb.collection('{collection_name}').doc(id).get()
  return snap.exists ? (snap.data() as {Model}) : null
}
```

Call this only from inside a route handler that runs after the TideCloak auth middleware
(mounted in `app.ts`), and after any `requireRole`/`requireAnyRole` check for this operation.

### 3. `firebase/firestore.rules` — no per-collection rule is needed

The rules file uses a single default-deny-all rule because Firestore is server-only. Do not add
a `match /{collection_name}/{docId}` block with `request.auth`-based conditions — there is no
Firebase Auth session for TideCloak-authenticated users, so any such rule would either be dead
(if it checks `request.auth`) or would incorrectly open up direct client access. Authorization
belongs in the backend route, not in Firestore rules.

### 4. `docs/FIRESTORE-SCHEMA.md` — document the schema

Add a section with the collection name, field descriptions, access pattern (which backend
route(s) touch it, which roles are required), and confirm it's read/written only via `adminDb`.

## Step 3 — Remind user

After all files are created:

> "This collection is only reachable through the backend route(s) you wired it into — verify with a request carrying a valid TideCloak access token and the required role."
> "If you added a composite index, add it to `firebase/firestore.indexes.json` and deploy with `npx firebase-tools deploy --only firestore:indexes`. Do not deploy from an agent session without explicit user approval."

## Checklist

- [ ] Type defined and exported (backend-side; add a matching frontend response type only for what the API actually returns)
- [ ] Backend accessor uses `adminDb` from `backend/src/lib/firebase.ts` — no other file imports `firebase-admin` directly (enforced by `backend/tests/unit/conventions.test.ts`)
- [ ] Backend route requires TideCloak auth + the correct role via `requireRole`/`requireAnyRole`
- [ ] Route response uses an explicit field allow-list — never spread a raw Firestore document
- [ ] No Firestore security rule references `request.auth` for this collection
- [ ] Schema documented in `FIRESTORE-SCHEMA.md`
