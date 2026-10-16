import { LayoutDashboard, ClipboardList, ShieldCheck, History, User, Settings } from 'lucide-react'
export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/requests', label: 'My Requests', icon: ClipboardList },
  { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { href: '/audit', label: 'Audit', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]
