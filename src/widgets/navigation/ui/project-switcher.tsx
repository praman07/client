import { ChevronsUpDown, Layers } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  buttonVariants,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { PROJECT_FRAGMENT, useMyProjects } from '@/entities/project'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { useFragment } from '@/gql'

/**
 * ProjectSwitcher
 *
 * Displays the active project name (from Redux — instant, no loading state)
 * and opens a dropdown listing all projects in the current workspace.
 *
 * Does NOT re-fetch the current project — it reads from Redux which is
 * hydrated by the parent project route via useProjectSync.
 * Only the project list (useMyProjects) is fetched here for the dropdown.
 *
 * @layer Widgets/Navigation
 */
export function ProjectSwitcher() {
  const { workspaceSlug } = useParams({ strict: false })

  // Current project — read from Redux (set by useProjectSync in the project route)
  // This is instant — no fetch, no skeleton on the trigger.
  const currentProject = useAppSelector(selectCurrentProject)

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
        <span className="font-medium text-foreground">
          {currentProject?.name || 'Select Project'}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <ProjectDropdownContent workspaceSlug={workspaceSlug} />
    </DropdownMenu>
  )
}

/**
 * The dropdown content — split so the project list fetch only triggers
 * when the dropdown is opened (DropdownMenuContent mounts on open).
 */
function ProjectDropdownContent({ workspaceSlug }: { workspaceSlug?: string }) {
  // Read workspaceId from Redux — workspace is always synced before the project route renders
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const { data } = useMyProjects(workspace?.id ?? '')
  const allProjects = useFragment(PROJECT_FRAGMENT, data?.myProjects)

  if (!workspaceSlug) return <Skeleton className="h-8 w-32" />

  return (
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        {allProjects?.map((project) => (
          <DropdownMenuItem key={project.id} className="p-0">
            <Link
              to="/workspace/$workspaceSlug/project/$projectSlug"
              params={{
                workspaceSlug,
                projectSlug: project.key,
              }}
              className="w-full cursor-pointer flex items-center px-2 py-1.5"
            >
              <Layers className="mr-2 h-4 w-4" />
              {project.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="p-0">
          <Link
            to="/workspace/$workspaceSlug/projects"
            params={{ workspaceSlug }}
            className="w-full cursor-pointer flex items-center px-2 py-1.5"
          >
            View All Projects
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
