import { Link } from '@tanstack/react-router'
import { FolderGit2, Plus } from 'lucide-react'

import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { PROJECT_FRAGMENT, ProjectCard, useMyProjects } from '@/entities/project'
import { useCreateProjectModal } from '@/features/project/create-project'
import {
  Button,
  Card,
  CardContent,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Skeleton,
} from '@/shared/ui'
import { useFragment } from '@/gql'
import { Guard } from '@/shared/lib/auth/guard'

function ProjectCardSkeleton() {
  return (
    <Card className="h-full bg-layer-1 border border-subtle rounded-lg shadow-raised-100 animate-fade-in">
      <CardContent className="p-4 flex flex-col h-full gap-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-layer-2 animate-pulse-subtle shrink-0" />
          <div className="h-4 w-1/2 bg-layer-2 animate-pulse-subtle rounded-md" />
        </div>

        {/* Title + Desc */}
        <div className="flex-1 pt-1 space-y-2">
          <div className="h-3 w-full bg-layer-2 animate-pulse-subtle rounded-md" />
          <div className="h-3 w-2/3 bg-layer-2 animate-pulse-subtle rounded-md" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-subtle">
          <div className="flex -space-x-2">
            <div className="size-6 rounded-full border-2 border-subtle bg-layer-2 animate-pulse-subtle" />
            <div className="size-6 rounded-full border-2 border-subtle bg-layer-2 animate-pulse-subtle" />
            <div className="size-6 rounded-full border-2 border-subtle bg-layer-2 animate-pulse-subtle" />
          </div>
          <div className="h-3 w-16 bg-layer-2 animate-pulse-subtle rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

interface ProjectsPageProps {
  workspaceSlug: string
}

export function ProjectsPage({ workspaceSlug }: ProjectsPageProps) {
  // 1. Get Workspace ID from State
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  // 2. Fetch Projects
  const { data, isLoading } = useMyProjects(workspace?.id || '')
  const projects = useFragment(PROJECT_FRAGMENT, data?.myProjects)

  // 3. UI State
  const { open } = useCreateProjectModal()

  if (!workspace) return <Skeleton className="h-full w-full min-h-[50vh]" />

  const hasProjects = projects && projects.length > 0

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-20 md:text-24 font-bold tracking-tight">Projects</h1>
        <Guard permission="project:create">
          <Button onClick={() => open()} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </Guard>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <ProjectCardSkeleton />
            </div>
          ))}

        {!isLoading &&
          hasProjects &&
          projects.map((project) => (
            <Link
              key={project.id}
              to="/workspace/$workspaceSlug/project/$projectSlug"
              params={{ workspaceSlug, projectSlug: project.key }}
              className="block group/link outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl h-full"
            >
              <ProjectCard project={project} />
            </Link>
          ))}

        {!isLoading && hasProjects && (
          <Guard permission="project:create">
            <button
              onClick={() => open()}
              className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-subtle hover:border-strong hover:bg-layer-transparent transition-colors duration-100 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
            >
              <div className="flex items-center justify-center size-12 rounded-2xl bg-layer-transparent group-hover:bg-layer-transparent-hover transition-colors duration-100 mb-3">
                <Plus className="w-6 h-6 text-secondary group-hover:text-primary transition-colors duration-100" />
              </div>
              <span className="font-medium text-13 text-secondary group-hover:text-primary transition-colors duration-100 tracking-tight">
                New Project
              </span>
            </button>
          </Guard>
        )}
      </div>

      {/* Empty State (when 0 projects) */}
      {!isLoading && !hasProjects && (
        <Empty className="mt-8 border-subtle">
          <EmptyMedia variant="icon">
            <FolderGit2 className="text-secondary" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No projects found</EmptyTitle>
            <EmptyDescription>
              Create your first project to start collaborating with your team.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Guard permission="project:create">
              <Button onClick={() => open()} variant="outline" className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </Guard>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
