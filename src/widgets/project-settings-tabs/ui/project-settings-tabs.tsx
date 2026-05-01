import { Link, useLocation } from '@tanstack/react-router'
import { Settings2, Shield, Users } from 'lucide-react'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/shared/ui/primitives/sidebar'

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
        <div className="p-3 rounded-full bg-danger-subtle">
          <Shield className="h-7 w-7 text-danger-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-16 font-semibold">Access Restricted</h2>
          <p className="text-13 text-secondary max-w-sm">
            You don't have permission to view project settings. Contact a project Manager
            to request access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col gap-8 animate-fade-in-in">
        {/* Page header */}
        <div>
          <h1 className="text-20 font-semibold tracking-tight">Project Settings</h1>
          <p className="text-13 text-secondary mt-1">
            Manage this project's configuration, members, and access roles.
          </p>
        </div>

        {/* Sidebar + content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 min-h-[600px]">
          {/* Sidebar navigation */}
          <SidebarGroup className="w-[var(--sidebar-width)] shrink-0">
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              {SETTINGS_TABS.map((tab) => {
                const isActive = pathname.endsWith(`/settings/${tab.path}`)
                const href = `/workspace/${workspaceSlug}/project/${projectSlug}/settings/${tab.path}`

                return (
                  <SidebarMenuItem key={tab.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={tab.label}
                      render={<Link to={href} />}
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
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
