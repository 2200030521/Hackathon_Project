'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, PieChart, Home, Activity, ShieldAlert, KeyRound, BellRing, Settings } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Investors', href: '/investors', icon: Users },
  { name: 'Portfolios', href: '/portfolios', icon: PieChart },
  { name: 'Real Estate', href: '/properties', icon: Home },
  { name: 'Operations', href: '/operations', icon: Activity },
  { name: 'Audit Logs', href: '/audit', icon: ShieldAlert },
  { name: 'RBAC Admin', href: '/admin', icon: KeyRound },
  { name: 'Alerts', href: '/alerts', icon: BellRing },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="font-bold text-lg tracking-tight text-primary">WealthIntel Pro</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            AD
          </div>
          <div>
            <p className="text-foreground">Admin User</p>
            <p className="text-xs">Superadmin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
