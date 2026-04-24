import { ChevronRight, Folder } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link, useParams } from '@tanstack/react-router'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { useWorkspaceOverview } from '@/entities/workspace/hooks'

const PROJECT_ICON_COLORS = [
  { bg: 'bg-accent-subtle', color: 'text-accent-primary' },
  { bg: 'bg-layer-2', color: 'text-secondary' },
  { bg: 'bg-success-subtle', color: 'text-success-primary' },
]

function RecentProjectsSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg bg-layer-1"
        >
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="w-4 h-4 rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}

function ProjectIcon({ logoUrl, bg, color }: { logoUrl?: string; bg: string; color: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full ${bg} shrink-0`}
    >
      <Folder className={`w-4 h-4 ${color}`} />
    </div>
  )
}

export function RecentProjects() {
  const { data, isLoading } = useWorkspaceOverview()
  const { workspaceSlug } = useParams({ strict: false })

  if (isLoading) return <RecentProjectsSkeleton />

  const projects = (data?.workspaceOverview?.activeProjects ?? []).slice(0, 3)

  return (
    <div className="flex flex-col gap-1.5">
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Folder className="w-6 h-6 text-disabled mb-2.5" />
          <p className="text-13 text-secondary">No projects yet</p>
          <p className="text-12 text-tertiary mt-0.5">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        projects.map((project, index) => {
          const { bg, color } = PROJECT_ICON_COLORS[index % PROJECT_ICON_COLORS.length]
          const updatedAt = formatDistanceToNow(new Date(project.updatedAt), {
            addSuffix: true,
          })

          return (
            <Link
              key={project.id}
              to="/workspace/$workspaceSlug/project/$projectSlug"
              params={{ workspaceSlug: workspaceSlug!, projectSlug: project.key }}
              className="group flex items-center gap-3 p-3 rounded-lg bg-layer-1 hover:bg-layer-1-hover transition-all duration-100"
            >
              <ProjectIcon
                logoUrl={project.logoUrl ?? undefined}
                bg={bg}
                color={color}
              />

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-13 font-medium text-primary truncate group-hover:text-accent-primary transition-colors">
                  {project.name}
                </span>
                <span className="text-12 text-secondary truncate mt-0.5">
                  {updatedAt}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-secondary shrink-0 transition-colors" />
            </Link>
          )
        })
      )}
    </div>
  )
}