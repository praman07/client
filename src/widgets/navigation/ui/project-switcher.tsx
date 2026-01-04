import { ChevronsUpDown, Layers, Plus } from 'lucide-react'
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
import { cn } from '@/shared/lib/utils'

export function ProjectSwitcher() {
  // In a real app, you might fetch the project name based on ID, or get it from context.
  // For now, we are just mocking the specific project view.

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 gap-2 px-2 text-muted-foreground hover:text-foreground',
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
          <Layers className="h-3 w-3" />
        </div>
        <span className="font-medium text-foreground">Project Weave</span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuItem>
            <Layers className="mr-2 h-4 w-4" />
            Project Weave
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers className="mr-2 h-4 w-4" />
            Website Redesign
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
