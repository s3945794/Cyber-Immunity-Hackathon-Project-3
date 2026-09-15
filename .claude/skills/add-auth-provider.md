---
description: Explains how to add or configure an identity provider for this project. Frontend authentication is TideCloak, not Firebase Authentication — providers are configured in the TideCloak realm admin console, not in application code. Use when asked to add Google, GitHub, or another sign-in method.
argument-hint: '[provider e.g. github|google|microsoft]'
---

# Skill: /add-auth-provider

**This project's frontend authentication is TideCloak, not Firebase Authentication.** The
Firebase Authentication client SDK, `frontend/src/lib/firebase/auth.ts`, and the old
`signInWithGoogle`/`signInWithPopup` pattern have been **removed** from this codebase. Do not
recreate them.

## How identity providers work in this project

TideCloak's frontend integration is `frontend/src/providers/AuthProvider.tsx` (wraps
`<TideCloakProvider>`) plus `frontend/src/lib/tidecloak/config.ts`. The app never talks to an
OAuth provider directly — TideCloak's realm brokers sign-in, and the app only ever calls
`login()` / `logout()` from `useAuth()` (see `frontend/src/hooks/useAuth.ts`).

Adding or configuring an identity provider (Google, GitHub, Microsoft, etc.) is **realm
configuration**, not application code:

1. Open the TideCloak admin console for the local realm (see `docs/TIDECLOAK-LOCAL.md` for how
   to reach it and sign in with the bootstrap administrator).
2. Configure the identity provider under the realm's **Identity Providers** settings, following
   TideCloak/Keycloak's standard identity broker configuration for that provider (client ID,
   client secret, redirect URI supplied by TideCloak).
3. Any realm change that requires a QEA (governed-change) approval must be reviewed and
   authorized in the admin console before it takes effect — see `docs/TIDECLOAK-LOCAL.md` for
   what QEA approval means in this project.
4. No changes to `frontend/src/lib/tidecloak/config.ts`, `AuthProvider.tsx`, or `useAuth()` are
   needed to add a provider — the existing `login()` call already redirects to whatever sign-in
   options the realm offers.

## What NOT to do

- Do not add `firebase/auth` imports, `signInWithPopup`, `GoogleAuthProvider`, or any Firebase
  Authentication code — that surface has been removed and reintroducing it creates a second,
  competing auth system.
- Do not add a `{Provider}SignInButton` component that bypasses TideCloak's `login()` flow.
- Do not hard-code provider client secrets anywhere in the repo — provider credentials belong in
  the TideCloak realm configuration, never in application code or `.env`.

## If server-side identity is needed for a new provider's claims

Reading additional identity-provider-specific claims server-side (e.g. a GitHub username) would
require server-side TideCloak JWT verification, which is **not yet implemented** in this project
— see `feature/tidecloak-protect`. Do not attempt to read those claims through the current
`getServerSession()`/`requireAuth()` stubs; they always fail closed.
