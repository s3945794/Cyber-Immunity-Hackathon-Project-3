---
description: Scaffold a complete feature module — frontend types/hook/component that call a protected Express API, plus the backend route that verifies TideCloak auth before any future Firestore access. Use when building a new business domain feature.
argument-hint: '[feature-name e.g. invoices]'
---

# Skill: /new-feature

Scaffold a complete feature module under `frontend/src/features/{feature}/` (client) and
`backend/src/routes/{feature}.ts` (server). The browser never talks to Firestore directly —
`firebase/firestore.rules` denies all direct client access. Every feature is: frontend calls the
Express API over HTTP with a TideCloak access token → backend's TideCloak auth middleware
verifies and authorizes the request → (once needed) the route reads/writes Firestore via
`backend/src/lib/firebase.ts`'s `adminDb`.

## Step 1 — Gather requirements

Ask the user:

1. **Feature name** (e.g., `invoices`, `team-members`, `projects`) — use kebab-case for the folder, PascalCase for types/components
2. **Data model fields** — what fields does the primary record have?
3. **Access pattern** — which SOC roles / TideCloak claims can call this endpoint? (see `requireRole`/`requireAnyRole` in `backend/src/middleware/auth.ts`)
4. **Does this feature need Firestore yet**, or is synthetic/in-memory data acceptable for now (see `backend/src/data/incidents.ts` for the existing pattern)?

## Step 2 — Files to create

Given feature name `{feature}` and model name `{Model}`:

### `frontend/src/types/{feature}.ts`

```typescript
export interface {Model} {
  id: string
  // ... user-defined fields
}
```

### `frontend/src/lib/api/{feature}.ts`

Follow the existing pattern in `frontend/src/lib/api/incidents.ts` — a typed `fetch{Model}s(tokenSource)` / `fetch{Model}ById(tokenSource, id)` helper that calls the backend API with `Authorization: Bearer <TideCloak access token>` (from `useAuth().getToken()`), against `NEXT_PUBLIC_API_URL`.

### `frontend/src/features/{feature}/hooks/use{Feature}.ts`

- Calls the `@/lib/api/{feature}` helper (not Firestore) inside a `useEffect`
- Return `{ data, loading, error }` shape

### `frontend/src/components/{feature}/{Model}List.tsx`

Basic list/table component using raw Tailwind classes (not shadcn, to keep it simple) — follow `frontend/src/components/incidents/IncidentTable.tsx` as the reference pattern.

### `backend/src/routes/{feature}.ts`

Follow `backend/src/routes/incidents.ts` as the reference pattern:

```typescript
import { Router, type Router as ExpressRouter } from 'express'
import { requireAnyRole } from '../middleware/auth'
// import { adminDb } from '../lib/firebase' // only once this feature actually needs Firestore

const router: ExpressRouter = Router()
const requireSocMembership = requireAnyRole(/* accepted roles */)

router.get('/', requireSocMembership, (req, res) => {
  // Return an explicit field allow-list — never spread an internal record.
})

export { router as {feature}Router }
```

Mount it in `backend/src/routes/index.ts`.

## Step 3 — Cross-cutting updates (only if this feature uses Firestore)

1. **`firebase/firestore.rules`** — this file default-denies all client access; it does not need
   a rule for a new collection, since Firestore is server-only. Do not add client-facing rules
   for `request.auth`-based access — there is no Firebase Auth session to check.
2. **`backend/src/lib/firebase.ts`** — import `adminDb` from here inside the route handler, after
   the TideCloak auth middleware has already run.
3. **`docs/FIRESTORE-SCHEMA.md`** — document the new collection's schema and access pattern.

## Checklist

- [ ] Frontend types defined and exported
- [ ] Frontend API helper added under `@/lib/api/`
- [ ] Backend route added under `backend/src/routes/`, mounted in `routes/index.ts`
- [ ] Route requires TideCloak auth + appropriate role via `requireRole`/`requireAnyRole`
- [ ] Response uses an explicit field allow-list, never a raw spread of internal data
- [ ] Hook returns `{ data, loading, error }`
- [ ] If Firestore is used: schema documented in `FIRESTORE-SCHEMA.md`, access happens only through `backend/src/lib/firebase.ts`
