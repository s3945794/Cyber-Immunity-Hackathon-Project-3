'use client'

import { useAuthContext } from '@/providers/AuthProvider'

/**
 * Access the authenticated user and TideCloak auth actions.
 *
 * Must be used inside a component wrapped by {@link AuthProvider} (i.e. any
 * client component rendered under the root layout).
 *
 * @example
 * const { user, authenticated, loading, login, logout } = useAuth()
 */
export const useAuth = useAuthContext
