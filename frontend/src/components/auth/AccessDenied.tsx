import Link from 'next/link'

/**
 * Shown when an authenticated user does not have any of the SOC roles
 * required for the area they tried to reach. Styled consistently with
 * `frontend/src/app/not-found.tsx`.
 */
export function AccessDenied() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-6xl font-bold text-zinc-200 dark:text-zinc-700">403</h1>
      <p className="text-xl font-semibold">Access denied</p>
      <p className="max-w-md text-center text-zinc-500">
        Your account does not have a recognised SOC role for this area. Contact your SOC
        administrator if you believe this is a mistake.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black"
      >
        Go home
      </Link>
    </main>
  )
}
