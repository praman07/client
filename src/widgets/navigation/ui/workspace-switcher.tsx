import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  selectCurrentWorkspace,
  selectMyWorkspaces, useMyWorkspaces 
} from '@/entities/workspace'
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
          'h-8 gap-2 px-2 text-secondary hover:text-primary font-medium',
          !workspaceSlug && 'pointer-events-none opacity-50',
        )}
      >
        <Avatar className="h-5 w-5 rounded-md">
          <AvatarImage src={currentWorkspace?.logoUrl || undefined} />
          <AvatarFallback className="rounded-md">
            {currentWorkspace?.name[0] || 'W'}
          </AvatarFallback>
        </Avatar>
        <span className="text-13 font-medium text-primary">{currentWorkspace?.name || 'Select Workspace'}</span>
      </Link>

      {/* 2. Dropdown Trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'h-8 w-6 text-secondary hover:text-primary hover:opacity-100',
          )}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-surface-2 border border-subtle rounded-lg shadow-overlay-100 p-1">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1 text-11 text-tertiary font-medium uppercase tracking-wide">Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {myWorkspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => {
                  navigate({ to: '/workspace/$workspaceSlug', params: { workspaceSlug: workspace.slug } })
                }}
                className={cn(
                  'flex items-center gap-2 cursor-pointer w-full rounded-md px-2 py-1.5',
                  workspace.id === currentWorkspace?.id && 'bg-layer-1-selected',
                )}
              >
                <Avatar className="h-5 w-5 rounded-md">
                  <AvatarImage src={workspace.logoUrl || undefined} />
                  <AvatarFallback className="rounded-md bg-layer-2 text-10">
                    {workspace.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-13 font-medium text-primary">{workspace.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/workspace/new' })}
              className="flex items-center gap-2 cursor-pointer w-full rounded-md px-2 py-1.5 text-13 text-secondary hover:bg-layer-transparent-hover hover:text-primary transition-colors"
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
