import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router'
import { Settings, ShieldCheck, ShieldOff } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'

export function WorkspaceSettingsPage() {
  const { workspaceSlug } = useParams({ strict: false })
  const { pathname } = useLocation()
  const { isLoading } = useAuthorizationContext()
  const canViewSettings = usePermission('workspace:settings:view')

  const SETTINGS_TABS = [
    {
      label: 'General',
      icon: Settings,
      to: '/workspace/$workspaceSlug/settings/general' as const,
      segment: 'general',
    },
    {
      label: 'Roles & Permissions',
      icon: ShieldCheck,
      to: '/workspace/$workspaceSlug/settings/roles' as const,
      segment: 'roles',
    },
  ]

  // Don't render anything until the auth context is resolved — avoids a flash
  if (isLoading) return null

  // Backend enforces this too, but we give a better UX by not showing the page at all.
  if (!canViewSettings) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="p-3 rounded-full bg-destructive/10">
          <ShieldOff className="h-7 w-7 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You don't have permission to view workspace settings. Contact an Owner or Admin
            to request access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace profile, security, and team roles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 min-h-[600px]">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-56 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
          <nav className="flex flex-row md:flex-col gap-2 md:gap-1 w-max md:w-full">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname.endsWith(`/settings/${tab.segment}`)

              return (
                <Link
                  key={tab.label}
                  to={tab.to}
                  params={{ workspaceSlug: workspaceSlug! }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
