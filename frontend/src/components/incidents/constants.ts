/**
 * Display labels for locked-field keys returned by the API's `lockedFields`
 * array. Falls back to the raw key if an unrecognised name ever appears —
 * still renders as "locked", never breaks.
 */
export const LOCKED_FIELD_LABELS: Record<string, string> = {
  victimHost: 'Victim Host',
  exposureEvidence: 'Exposure Evidence',
  suspiciousProcess: 'Suspicious Process',
}

export function lockedFieldLabel(key: string): string {
  return LOCKED_FIELD_LABELS[key] ?? key
}

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export function severityBadgeClass(severity: string): string {
  return SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.low!
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  investigating: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  contained: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

export function statusBadgeClass(status: string): string {
  return STATUS_STYLES[status] ?? STATUS_STYLES.new!
}
