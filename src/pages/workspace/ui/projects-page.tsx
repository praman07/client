import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace/model/selectors'
import { useMyProjects } from '@/entities/project/hooks'
import { ProjectCard } from '@/entities/project/ui/project-card'
import { CreateProjectModal } from '@/features/project/create-project/ui/create-project-modal'
import { Button, Skeleton } from '@/shared/ui'
import { useFragment } from '@/gql'
import { PROJECT_FRAGMENT } from '@/entities/project/api/fragments'
import { useCreateProjectModal } from '@/features/project/create-project/hooks/use-create-project-modal'

interface ProjectsPageProps {
  workspaceSlug: string
}

export function ProjectsPage({ workspaceSlug }: ProjectsPageProps) {
  // 1. Get Workspace ID from State
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  // 2. Fetch Projects (only if we have the ID)
  // We pass empty string if no workspace to avoid query error, enabled check handles logic
  const { data, isLoading } = useMyProjects(workspace?.id || '')

  const projects = useFragment(PROJECT_FRAGMENT, data?.myProjects)

  // 3. UI State (Redux)
  const { open } = useCreateProjectModal()

  if (!workspace) return <Skeleton className="h-full w-full min-h-[50vh]" />

  return (
    <div className="space-y-6 container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button onClick={() => open()}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      {/* Project List / Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          : projects?.map((project) => (
              <Link
                key={project.id}
                to="/workspace/$workspaceSlug/project/$projectSlug"
                params={{ workspaceSlug, projectSlug: project.key }}
                className="block transition-transform hover:scale-[1.01]"
              >
                <ProjectCard project={project} />
              </Link>
            ))}

        {!isLoading && (!projects || projects.length === 0) && (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed">
            No projects found. Create one to get started!
          </div>
        )}
      </div>

      <CreateProjectModal />
    </div>
  )
}
