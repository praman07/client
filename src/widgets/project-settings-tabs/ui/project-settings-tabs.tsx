import { Link, useLocation } from '@tanstack/react-router'
import { Settings2, Shield, ShieldOff, Users } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'

const SETTINGS_TABS = [
  { label: 'General', path: 'general', icon: Settings2 },
  { label: 'Members', path: 'members', icon: Users },
  { label: 'Roles & Permissions', path: 'roles', icon: Shield },
] as const

interface ProjectSettingsTabsProps {
  workspaceSlug: string
  projectSlug: string
  children: React.ReactNode
}

export function ProjectSettingsTabs({
  workspaceSlug,
  projectSlug,
  children,
}: ProjectSettingsTabsProps) {
  const { pathname } = useLocation()
  const { isLoading } = useAuthorizationContext()
  const canViewSettings = usePermission('project:settings:view')

  // Avoid a flash before auth context resolves
  if (isLoading) return null

  if (!canViewSettings) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="p-3 rounded-full bg-destructive/10">
          <ShieldOff className="h-7 w-7 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You don't have permission to view project settings. Contact a project Manager
            to request access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage this project's configuration, members, and access roles.
        </p>
      </div>

      {/* Sidebar + content */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 min-h-[600px]">
        {/* Sidebar navigation */}
        <aside className="w-full md:w-56 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
          <nav className="flex flex-row md:flex-col gap-2 md:gap-1 w-max md:w-full">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname.endsWith(`/settings/${tab.path}`)
              const href = `/workspace/${workspaceSlug}/project/${projectSlug}/settings/${tab.path}`

              return (
                <Link
                  key={tab.path}
                  to={href}
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

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
