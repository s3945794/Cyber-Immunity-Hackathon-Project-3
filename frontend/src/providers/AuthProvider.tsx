'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { TideCloakProvider, useTideCloak } from '@tidecloak/nextjs'
import { getTideCloakConfig } from '@/lib/tidecloak/config'
import type { AuthContextValue, AuthUser } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

function claim(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

/**
 * Bridges the TideCloak SDK context onto the app's small {@link AuthContextValue}
 * surface. Must render inside `<TideCloakProvider>`.
 */
function AuthBridge({ children }: { children: ReactNode }) {
  const tc = useTideCloak()

  const value = useMemo<AuthContextValue>(() => {
    const user: AuthUser | null = tc.authenticated
      ? {
          uid: claim(tc.getValueFromIdToken('sub')) ?? claim(tc.getValueFromToken('sub')) ?? '',
          username: claim(tc.getValueFromIdToken('preferred_username')),
          email: claim(tc.getValueFromIdToken('email')),
        }
      : null

    return {
      user,
      authenticated: tc.authenticated,
      loading: tc.isInitializing,
      login: tc.login,
      logout: tc.logout,
    }
    // Re-derive whenever auth state or the tokens change; the SDK accessor
    // identities are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tc.authenticated, tc.isInitializing, tc.idToken, tc.token, tc.login, tc.logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Root client provider: initialises the TideCloak SDK and exposes `useAuth()`.
 * Wrapped by `@/providers` and mounted once in the root layout.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <TideCloakProvider config={getTideCloakConfig()}>
      <AuthBridge>{children}</AuthBridge>
    </TideCloakProvider>
  )
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
