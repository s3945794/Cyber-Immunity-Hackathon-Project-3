# Frontend

## Overview

Next.js 16 App Router with React 19, TypeScript (strict), and Tailwind CSS v4.

## Key Conventions

### Server vs Client Components

- **Default: Server Component** — no `'use client'` directive needed
- Add `'use client'` only when you need: React hooks, event handlers, browser APIs, or Firebase client SDK
- Pages in `app/` are Server Components; extract interactivity to `*Client.tsx` components

### Route Groups

| Group         | Path                                             | Purpose                                                                                                                                                             |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(auth)`      | `/auth/signin`, `/auth/signup`, `/auth/redirect` | Minimal centered layout, no sidebar. `signin`/`signup` are "Continue with TideCloak" buttons — no password fields. `/auth/redirect` is the TideCloak PKCE callback. |
| `(dashboard)` | `/dashboard`, `/profile`, `/settings`            | Full app shell with sidebar + navbar. Gated **client-side only** via `useAuth()` — a UX redirect, not a security boundary.                                          |
| _(root)_      | `/`                                              | Landing/marketing page                                                                                                                                              |

### Feature Modules

New business domains go in `src/features/{feature}/`:

```
src/features/invoices/
├── types.ts          TypeScript interfaces
├── hooks/
│   └── useInvoices.ts  Firestore subscription hook
├── actions/
│   └── invoices.actions.ts  Server Actions
└── components/
    └── InvoiceList.tsx
```

Use the `/new-feature` skill to scaffold this structure.

### Data Fetching

| Context          | Method                            | When                   |
| ---------------- | --------------------------------- | ---------------------- |
| Server Component | `adminDb.collection(...).get()`   | One-time, SSR          |
| Client Component | `useCollection()` hook            | Real-time subscription |
| Server Action    | `adminDb` + `requireAuth()`       | Mutations              |
| Route Handler    | `adminAuth.verifySessionCookie()` | Session management     |

### Styling

Tailwind CSS v4 uses CSS-first config. Key patterns:

```tsx
// Conditional classes
import { cn } from '@/lib/utils'
<div className={cn('base-class', isActive && 'active-class', className)} />

// Dark mode: use Tailwind dark: prefix
<div className="bg-white dark:bg-zinc-900" />
```

## Authentication UI Flow (TideCloak)

```
/ (landing) → /auth/signin → login() redirects to TideCloak → /auth/redirect (PKCE callback) → /dashboard
                  ↓
             /auth/signup → same TideCloak flow (no password fields — TideCloak owns account creation)
```

- `AuthProvider` wraps `<TideCloakProvider>` (config from `NEXT_PUBLIC_TIDECLOAK_*`) and bridges the SDK onto `useAuth()`
- `useAuth()` hook → `{ user: { uid, username, email } | null, authenticated, loading, login, logout }`
- The `(dashboard)` layout gates **client-side only** via `useAuth()` — spinner while `loading`, calls `login()` when `!authenticated`. This is a UX gate, not server-side security.
- `requireAuth()` (a Server Action) is currently a **fail-closed stub** — it always redirects to `/auth/signin`. It does not yet verify a real TideCloak session server-side. Server-side verification is `feature/tidecloak-protect`.
- Removed: Firebase Authentication (client SDK), the `__session` cookie, `proxy.ts`, and `/api/auth/session`.

## Adding a Page

Use the `/new-page` skill. Key checklist:

- Correct route group (`(auth)` or `(dashboard)`)
- Export `metadata` object
- Call `requireAuth()` in protected pages
- Put client interactivity in a `*Client.tsx` component
