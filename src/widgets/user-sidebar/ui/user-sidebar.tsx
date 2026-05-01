import { Link, useLocation } from '@tanstack/react-router'
import {
  ChevronsUpDown,
  Home,
  Layers,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/primitives/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { useUser } from '@/entities/user'
import { useAuth } from '@/shared/hooks'

export function UserSidebar() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const location = useLocation()

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader className="border-b border-subtle p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="w-full justify-start"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-lg bg-layer-2">
                  <AvatarImage
                    src={user?.avatarUrl ?? undefined}
                    alt={user?.fullName ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-14 leading-tight">
                  <span className="truncate font-semibold">
                    {user?.fullName}
                  </span>
                  <span className="truncate text-12 text-secondary">
                    {user?.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width)"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => void signOut()}
                >
                  <LogOut className="size-4 text-danger-primary" />
                  <span className="text-danger-primary font-medium">
                    Log out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* General Group */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to="/home" />}
                tooltip="Home"
                isActive={location.pathname === '/home'}
              >
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to="/user/workspaces" />}
                tooltip="Workspaces"
                isActive={location.pathname.startsWith('/user/workspaces')}
              >
                <Layers />
                <span>Workspaces</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Account Group */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to="/user/profile" />}
                tooltip="Profile"
                isActive={location.pathname.startsWith('/user/profile')}
              >
                <UserIcon />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to="/user/settings" />}
                tooltip="Settings"
                isActive={location.pathname.startsWith('/user/settings')}
              >
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
