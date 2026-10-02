import { Lock } from 'lucide-react'
import Link from 'next/link'

interface LockedFieldProps {
  /** Human-readable field label, e.g. "Victim Host". Never a protected value. */
  label: string
  /** Optional navigation target for preparing a request for this resource. */
  requestHref?: string
}

/**
 * Renders a locked-field indicator: the field name, a "locked" state and an
 * optional request link, never a protected value. Intentionally accepts no
 * value prop at all.
 */
export function LockedField({ label, requestHref }: LockedFieldProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between gap-3 sm:flex-1">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Locked
        </span>
      </div>
      {requestHref && (
        <Link
          href={requestHref}
          aria-label={`Request access to ${label}`}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Request Access
        </Link>
      )}
    </div>
  )
}
