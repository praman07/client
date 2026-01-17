import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  selectCurrentWorkspace,
  selectMyWorkspaces,
} from '@/entities/workspace/model/selectors'
import { useAppSelector } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  WidgetError,
  buttonVariants,
} from '@/shared/ui'
import { useMyWorkspaces } from '@/entities/workspace'

export function WorkspaceSwitcher() {
  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <WorkspaceSwitcherContent />
    </ErrorBoundary>
  )
}

function WorkspaceSwitcherContent() {
  const navigate = useNavigate()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const myWorkspaces = useAppSelector(selectMyWorkspaces)

  // Ensure query runs to sync data
  useMyWorkspaces()

  const workspaceSlug = currentWorkspace?.slug

  return (
    <div className="flex items-center gap-1">
      {/* 1. Navigate to Workspace Home */}
      <Link
        to="/workspace/$workspaceSlug"
        params={{ workspaceSlug: workspaceSlug || '' }}
        disabled={!workspaceSlug}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 gap-2 px-2 text-muted-foreground hover:text-foreground font-medium',
          !workspaceSlug && 'pointer-events-none opacity-50',
        )}
      >
        <Avatar className="h-5 w-5 rounded-md">
          <AvatarImage src={currentWorkspace?.logoUrl || undefined} />
          <AvatarFallback className="rounded-md">
            {currentWorkspace?.name[0] || 'W'}
          </AvatarFallback>
        </Avatar>
        <span>{currentWorkspace?.name || 'Select Workspace'}</span>
      </Link>

      {/* 2. Dropdown Trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'h-8 w-6 text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100',
          )}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {myWorkspaces.map((workspace) => (
              <DropdownMenuItem key={workspace.id}>
                <Link
                  to="/workspace/$workspaceSlug"
                  params={{ workspaceSlug: workspace.slug }}
                  className="flex items-center gap-2 cursor-pointer w-full"
                >
                  <Avatar className="h-4 w-4 rounded-md">
                    <AvatarImage src={workspace.logoUrl || undefined} />
                    <AvatarFallback className="rounded-md bg-muted text-[10px]">
                      {workspace.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{workspace.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/workspace/new' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
