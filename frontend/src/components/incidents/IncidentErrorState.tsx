import { AlertTriangle } from 'lucide-react'

interface IncidentErrorStateProps {
  message?: string
  onRetry?: () => void
}

/** Inline error state for a failed incident API call — distinct from ErrorBoundary,
 * which only catches render-time exceptions, not async fetch failures. */
export function IncidentErrorState({
  message = 'Could not load incident data. Please try again.',
  onRetry,
}: IncidentErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 py-16 text-center dark:border-red-900/50 dark:bg-red-950/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-red-700 dark:text-red-300">Something went wrong</p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
        >
          Try again
        </button>
      )}
    </div>
  )
}
