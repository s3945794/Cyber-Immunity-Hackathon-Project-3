# Frontend — Claude Instructions

Loaded automatically when editing files in `frontend/`. Supplements root `CLAUDE.md`.

---

## Next.js 16 (App Router)

This is **Next.js 16** — APIs, file conventions, and routing differ from earlier versions.
Before writing any Next.js code, check `node_modules/next/dist/docs/` for breaking changes.

Key Next.js 16 changes from training data:

- `middleware.ts` is deprecated — use `proxy.ts` with `export function proxy()`
- App Router is the only supported router
- Server Actions are stable and the preferred mutation pattern

---

## Server vs Client Components

**Default: Server Component.** Add `'use client'` only when you need:

- React hooks (`useState`, `useEffect`, `useContext`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, `navigator`, etc.)
- Third-party client-only libraries

**Never add `'use client'` to:**

- Files that only fetch data and render HTML
- Files that only import server-only libraries
- Layout files unless they truly need client state

**Never import in a Server Component:**

- `firebase/auth`, `firebase/firestore` (client SDK)
- `@/lib/firebase/client` (client SDK)
- Any hook from `@/hooks/` (they're all client hooks)

**For server-side Firebase always use:** `@/lib/firebase/admin`

---

## File Organization

```
src/
├── app/
│   ├── (auth)/           # signin / signup (→ TideCloak) + auth/redirect callback
│   ├── (dashboard)/      # Pages gated client-side by useAuth() in the layout
│   ├── layout.tsx        # Root layout — Server Component (mounts <Providers>)
│   └── page.tsx          # Landing page — Server Component
├── components/
│   ├── layout/           # DashboardShell, Sidebar, Navbar, PageHeader
│   └── shared/           # ErrorBoundary, LoadingSpinner, EmptyState
├── features/             # One folder per business domain
│   └── [domain]/
│       ├── components/   # Domain-specific UI
│       ├── hooks/        # Domain-specific hooks
│       ├── actions/      # Server Actions
│       └── types.ts      # Domain types
├── lib/
│   ├── firebase/
│   │   ├── client.ts     # Client SDK singleton (browser only)
│   │   ├── admin.ts      # Admin SDK (server-only, never client)
│   │   ├── auth.ts       # Sign-in helpers
│   │   └── firestore.ts  # typedCollection<T>() factory
│   ├── validations/      # Zod schemas for forms and actions
│   └── utils.ts          # cn(), formatDate(), truncate()
├── hooks/                # Cross-domain React hooks (all 'use client')
├── providers/            # AuthProvider, Toaster (all 'use client')
├── actions/              # Cross-domain Server Actions
└── types/                # Shared TypeScript types
```

**Import rules:**

- Always use `@/` alias — never `../../` more than one level
- Features import from `@/lib/`, `@/hooks/`, `@/types/` but not from other features
- `app/` pages import from `@/components/`, `@/features/`, `@/actions/`

---

## Server Actions

All Server Actions live in `src/features/[domain]/actions/` or `src/actions/` for cross-domain.

```typescript
'use server'

import { requireAuth } from '@/actions/auth.actions'
import type { ActionResult } from '@/types'

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult<void>> {
  const session = await requireAuth() // fail-closed placeholder until feature/tidecloak-protect

  // validate input with zod
  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid input' }
  }

  try {
    await adminDb.collection('users').doc(session.uid).update(parsed.data)
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update profile' }
  }
}
```

- Always return `ActionResult<T>`: `{ success: boolean, error?: string, data?: T }`
- Always call `requireAuth()` first (currently a fail-closed stub — real server-side TideCloak verification is `feature/tidecloak-protect`)
- Always validate with Zod before any database operation
- Never throw from a Server Action — return `{ success: false, error: '...' }`

---

## Auth Flow (TideCloak — front-channel)

1. `@/providers/AuthProvider` mounts `<TideCloakProvider>` (config from `NEXT_PUBLIC_TIDECLOAK_*` via `@/lib/tidecloak/config`) and bridges the SDK onto `useAuth()` → `{ user, authenticated, loading, login, logout }`.
2. `/auth/signin` & `/auth/signup` are "Continue with TideCloak" buttons — `login()` redirects the browser to TideCloak. **This app never collects a password.**
3. TideCloak redirects back to `/auth/redirect` with a `code`; `useAuthCallback` runs the PKCE token exchange, then sends the user to their original destination.
4. `(dashboard)/layout.tsx` gates client-side: spinner while `loading`, `login()` when `!authenticated`. UX gating only.
5. `logout()` ends the TideCloak session and returns to the app.

**Not in this branch** (→ `feature/tidecloak-protect`): server-side JWT verification, route/API protection, RBAC. `actions/auth.actions.ts` (`getServerSession`/`requireAuth`) are fail-closed placeholders, so Server Actions that need identity (e.g. `createNote`) are disabled until then. Client Firestore reads also need a TideCloak↔Firestore bridge (later phase).

---

## Design System

See `docs/DESIGN.md` for the full design reference:

- Tailwind v4 CSS-first config, `@theme` tokens
- Color system, typography scale, spacing
- Button, input, card, badge patterns
- Loading/error/empty state patterns
- Icon sizing conventions (lucide-react)
- Form pattern (react-hook-form + zod + sonner)

---

## Testing

Tests live in `frontend/tests/unit/` mirroring `src/`.

- `vi.mock('@/lib/firebase/client')` in setup
- `vi.mock('@/lib/firebase/admin')` in setup
- Use `@testing-library/react` for components, `renderHook` for hooks
- Do not test `src/app/` pages (or `src/components/ui/` if shadcn is added later)
