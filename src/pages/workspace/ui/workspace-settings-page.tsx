import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router'
import { Settings, Shield, ShieldOff } from 'lucide-react'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/shared/ui/primitives/sidebar'

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
      icon: Shield,
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
        <div className="p-3 rounded-full bg-danger-subtle">
          <ShieldOff className="h-7 w-7 text-danger-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-16 font-semibold text-primary">Access Restricted</h2>
          <p className="text-13 text-secondary max-w-sm">
            You don't have permission to view workspace settings. Contact an Owner or Admin
            to request access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col gap-8 animate-fade-in">
        {/* Page header */}
        <div>
          <h1 className="text-20 font-semibold tracking-tight">Workspace Settings</h1>
          <p className="text-13 text-secondary mt-1">
            Manage your workspace profile, security, and team roles.
          </p>
        </div>

        {/* Sidebar + content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 min-h-[600px]">
          {/* Sidebar navigation */}
          <SidebarGroup className="w-[var(--sidebar-width)] shrink-0">
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              {SETTINGS_TABS.map((tab) => {
                const isActive = pathname.endsWith(`/settings/${tab.segment}`)

                return (
                  <SidebarMenuItem key={tab.label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={tab.label}
                      render={
                        <Link
                          to={tab.to}
                          params={{ workspaceSlug: workspaceSlug! }}
                        />
                      }
                    >
                      <tab.icon className="size-4 shrink-0" />
                      <span>{tab.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
