/** The only protected resource keys the frontend may use in request links. */
export const LOCKED_RESOURCE_KEYS = ['victimHost', 'exposureEvidence', 'suspiciousProcess'] as const

export type LockedResourceKey = (typeof LOCKED_RESOURCE_KEYS)[number]

/** Safe display labels for the allow-listed protected resource keys. */
export const LOCKED_FIELD_LABELS: Record<LockedResourceKey, string> = {
  victimHost: 'Victim Host',
  exposureEvidence: 'Exposure Evidence',
  suspiciousProcess: 'Suspicious Process',
}

export function isLockedResourceKey(key: string): key is LockedResourceKey {
  return LOCKED_RESOURCE_KEYS.some((resourceKey) => resourceKey === key)
}

/**
 * Returns a safe label for a locked-field key. Existing incident views retain
 * their fallback so an unexpected backend key remains visibly locked.
 */
export function lockedFieldLabel(key: string): string {
  return isLockedResourceKey(key) ? LOCKED_FIELD_LABELS[key] : key
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
