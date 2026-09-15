'use client'

import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your identity is managed by TideCloak. Details shown come from your ID token.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">Username</p>
          <p className="mt-1 text-sm">{user?.username ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">Email</p>
          <p className="mt-1 text-sm">{user?.email ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">User ID</p>
          <p className="mt-1 font-mono text-xs break-all">{user?.uid ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
