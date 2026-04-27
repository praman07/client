import { ChevronsUpDown, Plus } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
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
  Skeleton,
  buttonVariants,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useAppSelector } from '@/shared/hooks'
import { PROJECT_FRAGMENT, selectCurrentProject, useMyProjects  } from '@/entities/project'
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
          'h-8 gap-2 px-2 text-secondary hover:text-primary',
        )}
      >
        <Avatar className="h-5 w-5 rounded-md">
          <AvatarImage src={currentProject?.logoUrl || undefined} />
          <AvatarFallback className="rounded-md">
            {currentProject?.name[0] || 'P'}
          </AvatarFallback>
        </Avatar>
        <span className="text-13 font-medium text-primary">
          {currentProject?.name || 'Select Project'}
        </span>
        <ChevronsUpDown className="h-4 w-4 text-disabled" />
      </DropdownMenuTrigger>
      <ProjectDropdownContent workspaceSlug={workspaceSlug} currentProjectId={currentProject?.id} />
    </DropdownMenu>
  )
}

/**
 * The dropdown content — split so the project list fetch only triggers
 * when the dropdown is opened (DropdownMenuContent mounts on open).
 */
function ProjectDropdownContent({ workspaceSlug, currentProjectId }: { workspaceSlug?: string; currentProjectId?: string }) {
  const navigate = useNavigate()
  // Read workspaceId from Redux — workspace is always synced before the project route renders
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const { data } = useMyProjects(workspace?.id ?? '')
  const allProjects = useFragment(PROJECT_FRAGMENT, data?.myProjects)

  if (!workspaceSlug) return <Skeleton className="h-8 w-32" />

  return (
    <DropdownMenuContent align="start" className="w-56 bg-surface-2 border border-subtle rounded-lg shadow-overlay-100 p-1">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="px-2 py-1 text-11 text-tertiary font-medium uppercase tracking-wide">Projects</DropdownMenuLabel>
        {allProjects?.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => {
              navigate({
                to: '/workspace/$workspaceSlug/project/$projectSlug',
                params: { workspaceSlug: workspaceSlug || '', projectSlug: project.key },
              })
            }}
            className={cn(
              'flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5',
              project.id === currentProjectId && 'bg-layer-1-selected',
            )}
          >
            <Avatar className="h-5 w-5 rounded-md">
              <AvatarImage src={project.logoUrl || undefined} />
              <AvatarFallback className="rounded-md bg-layer-2 text-10">
                {project.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-13 font-medium text-primary">{project.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            navigate({ to: '/workspace/$workspaceSlug/projects', params: { workspaceSlug: workspaceSlug || '' } })
          }}
          className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 text-13 text-secondary hover:bg-layer-transparent-hover hover:text-primary transition-colors"
        >
          View All Projects
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
