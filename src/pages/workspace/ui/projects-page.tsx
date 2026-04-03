import { Link } from '@tanstack/react-router'
import { Plus, FolderGit2 } from 'lucide-react'

import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { PROJECT_FRAGMENT, ProjectCard, useMyProjects } from '@/entities/project'
import { useCreateProjectModal } from '@/features/project/create-project'
import {
  Button,
  Skeleton,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Card,
  CardHeader,
  CardFooter,
} from '@/shared/ui'
import { useFragment } from '@/gql'
import { Guard } from '@/shared/lib/auth/guard'

function ProjectCardSkeleton() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-start px-6 pt-6 pb-0">
        {/* Logo Placeholder */}
        <Skeleton className="size-10 rounded-lg" />
        {/* Avatars Placeholder */}
        <div className="flex -space-x-2">
          <Skeleton className="size-8 rounded-full border-2 border-background" />
          <Skeleton className="size-8 rounded-full border-2 border-background" />
        </div>
      </div>

      <CardHeader className="py-0 flex-1 mt-4 space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>

      <CardFooter className="pt-4 border-t border-border/10 flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </CardFooter>
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
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

        {/* Append 'New Project' Inline Card */}
        {!isLoading && hasProjects && (
          <Guard permission="project:create">
            <button
              onClick={() => open()}
              className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-border/40 hover:border-border/80 hover:bg-muted/20 transition-all cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center justify-center size-12 rounded-2xl bg-muted/50 group-hover:bg-muted transition-colors mb-3">
                <Plus className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors" />
              </div>
              <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors tracking-tight">
                New Project
              </span>
            </button>
          </Guard>
        )}
      </div>

      {/* Empty State (when 0 projects) */}
      {!isLoading && !hasProjects && (
        <Empty className="mt-8 border-border/50">
          <EmptyMedia variant="icon">
            <FolderGit2 className="text-muted-foreground" />
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
