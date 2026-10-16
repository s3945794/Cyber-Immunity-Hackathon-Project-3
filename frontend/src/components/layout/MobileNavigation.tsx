import Link from 'next/link'
import { navItems } from './navigation'
export function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="flex shrink-0 gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-2 lg:hidden dark:border-zinc-800 dark:bg-zinc-900"
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="shrink-0 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
