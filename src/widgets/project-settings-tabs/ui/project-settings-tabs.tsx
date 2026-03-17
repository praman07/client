import { Link, useRouterState } from '@tanstack/react-router'
import { Settings2, Shield, Users } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const SETTINGS_TABS = [
  { label: 'General', path: 'general', icon: Settings2 },
  { label: 'Members', path: 'members', icon: Users },
  { label: 'Roles', path: 'roles', icon: Shield },
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
  const { location } = useRouterState()

  return (
    <div className="flex gap-8 items-start">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 border-r pr-4 flex flex-col gap-0.5">
        {SETTINGS_TABS.map((tab) => {
          const href = `/workspace/${workspaceSlug}/project/${projectSlug}/settings/${tab.path}`
          const isActive = location.pathname.endsWith(`/settings/${tab.path}`)
          const Icon = tab.icon
          return (
            <Link
              key={tab.path}
              to={href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </Link>
          )
        })}
      </aside>

      {/* Page content */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
