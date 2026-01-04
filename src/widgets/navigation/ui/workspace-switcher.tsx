import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { buttonVariants } from '@/shared/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils'

// Define the params shape we are looking for
type WorkspaceParams = { workspaceSlug?: string }

export function WorkspaceSwitcher() {
  const matches = useRouterState({ select: (s) => s.matches })
  const workspaceSlugMatch = matches.find(
    (d) => (d.params as unknown as WorkspaceParams).workspaceSlug,
  )
  const workspaceSlug = workspaceSlugMatch
    ? (workspaceSlugMatch.params as unknown as WorkspaceParams).workspaceSlug
    : undefined

  return (
    <div className="flex items-center gap-1">
      {/* 1. Navigate to Workspace Home */}
      <Link
        to="/workspace/$workspaceSlug"
        params={{ workspaceSlug: workspaceSlug || '' }}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 gap-2 px-2 text-muted-foreground hover:text-foreground font-medium',
        )}
      >
        <Avatar className="h-5 w-5 rounded-md">
          <AvatarImage src={`https://avatar.vercel.sh/${workspaceSlug}`} />
          <AvatarFallback className="rounded-md">W</AvatarFallback>
        </Avatar>
        <span>{workspaceSlug || 'Select Workspace'}</span>
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
            {/* Mock Workspaces */}
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-primary" />
                <span>Acme Corp</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-muted-foreground" />
                <span>Personal</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
