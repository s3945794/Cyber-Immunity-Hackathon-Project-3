'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { accessApi, AccessApiError } from '@/lib/api/access'

/** Drop stale responses on refresh, context/session changes and unmount. No persistence. */
export function useAccessData<T>(path: string) {
  const { user, authenticated, loading: authLoading, getToken } = useAuth()
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<{ key: string; data: T | null; error: string | null }>({
    key: '',
    data: null,
    error: null,
  })
  const key = JSON.stringify([user?.uid, authenticated, path, revision])
  const refresh = useCallback(() => setRevision((n) => n + 1), [])
  useEffect(() => {
    if (!authenticated || authLoading) return
    let cancelled = false
    accessApi<T>({ getToken }, path)
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            key,
            data: null,
            error:
              err instanceof AccessApiError ? err.message : 'Could not load history. Please retry.',
          })
      })
    return () => {
      cancelled = true
    }
  }, [key, path, getToken, authenticated, authLoading])
  useEffect(() => {
    const visible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && navigator.onLine) refresh()
    }, 30000)
    document.addEventListener('visibilitychange', visible)
    window.addEventListener('online', refresh)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', visible)
      window.removeEventListener('online', refresh)
    }
  }, [refresh])
  const current = authenticated && !authLoading && state.key === key
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: !current,
    refresh,
  }
}

/** Reuse a write's UUID after an ambiguous network failure, only for identical input. */
export function useOperation() {
  const previous = useRef<{ signature: string; id: string } | null>(null)
  return (action: string, input: unknown): string => {
    const signature = JSON.stringify([action, input])
    if (previous.current?.signature !== signature)
      previous.current = { signature, id: crypto.randomUUID() }
    return previous.current.id
  }
}
