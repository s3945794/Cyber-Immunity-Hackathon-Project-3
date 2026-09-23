import { Lock } from 'lucide-react'

interface LockedFieldProps {
  /** Human-readable field label, e.g. "Victim Host". Never a protected value. */
  label: string
}

/**
 * Renders a locked-field indicator: the field name plus a "locked" state,
 * never a value. Intentionally accepts no value prop at all — there is no
 * way to pass a protected value to this component even by mistake, because
 * the type signature does not allow it.
 */
export function LockedField({ label }: LockedFieldProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        Locked
      </span>
    </div>
  )
}
