import { ChevronsUpDown, Layers, Plus } from 'lucide-react'
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
import { selectWorkspaceBySlug } from '@/entities/workspace/model/selectors'
import { useMyProjects, useProjectBySlug } from '@/entities/project/hooks'
import { useFragment } from '@/gql'
import { PROJECT_FRAGMENT } from '@/entities/project/api/fragments'

export function ProjectSwitcher() {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  // 1. Fetch Current Project
  const { data: currentProjectData, isLoading: isProjectLoading } =
    useProjectBySlug(workspace?.id || '', projectSlug || '')
  const currentProject = useFragment(
    PROJECT_FRAGMENT,
    currentProjectData?.projectBySlug,
  )

  // 2. Fetch All Projects (for list)
  const { data: allProjectsData } = useMyProjects(workspace?.id || '')
  const allProjects = useFragment(PROJECT_FRAGMENT, allProjectsData?.myProjects)

  if (!workspace || isProjectLoading) return <Skeleton className="h-8 w-32" />

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
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {allProjects?.map((project) => (
            <DropdownMenuItem key={project.id} className="p-0">
              <Link
                to="/workspace/$workspaceSlug/project/$projectSlug"
                params={{ workspaceSlug: workspaceSlug!, projectSlug: project.key }}
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
              params={{ workspaceSlug: workspaceSlug! }}
              className="w-full cursor-pointer flex items-center px-2 py-1.5"
            >
              <Plus className="mr-2 h-4 w-4" />
              View All Projects
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
