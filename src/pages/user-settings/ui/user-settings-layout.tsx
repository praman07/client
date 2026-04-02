import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { CreditCard, LayoutGrid, Shield, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Separator } from '@/shared/ui/primitives/separator'

const NAV_ITEMS = [
  { label: 'Profile', to: '/user/profile', icon: User },
  { label: 'Account', to: '/user/account', icon: Shield },
  { label: 'Billing', to: '/user/billing', icon: CreditCard },
  { label: 'Workspaces', to: '/user/workspaces', icon: LayoutGrid },
] as const

/**
 * UserSettingsLayout — sidebar + outlet for all /user/* routes.
 * Replaces the old Clerk <UserProfile> embedded shell.
 */
export function UserSettingsLayout() {
  const { location } = useRouterState()

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-2">
          <Link to="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile, security, and preferences.</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar nav */}
          <nav className="w-44 shrink-0 space-y-1">
            {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <Separator orientation="vertical" className="h-auto" />

          {/* Page content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
