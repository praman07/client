import { ChevronRight, Folder, FolderArchive, FolderGit2, Layers } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link, useParams } from '@tanstack/react-router'
import { Card } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { useWorkspaceOverview } from '@/entities/workspace/hooks'

// Cycle through a set of distinct project icon styles
const PROJECT_ICON_STYLES = [
  { icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: FolderGit2, color: 'text-slate-400', bg: 'bg-white/5' },
  { icon: FolderArchive, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Folder, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Layers, color: 'text-violet-400', bg: 'bg-violet-500/10' },
]

function RecentProjectsSkeleton() {
  return (
    <Card className="flex flex-col p-6 shadow-sm border-none bg-surface-1">
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="flex flex-col space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-surface-2"
          >
            <div className="flex items-center gap-4 min-w-0">
              <Skeleton className="w-10 h-10 rounded-md shrink-0" />
              <div className="flex flex-col gap-1.5 overflow-hidden">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 pl-2">
              <div className="hidden sm:flex -space-x-2 mr-2">
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="w-7 h-7 rounded-full" />
              </div>
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function RecentProjects() {
  const { data, isLoading } = useWorkspaceOverview()
  const { workspaceSlug } = useParams({ strict: false })

  if (isLoading) return <RecentProjectsSkeleton />

  const projects = data?.workspaceOverview?.activeProjects ?? []


  return (
    <Card className="flex flex-col p-6 shadow-sm border-none bg-surface-1">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-foreground tracking-tight">Recent Projects</h2>
        <Link
          to="/workspace/$workspaceSlug/projects"
          params={{ workspaceSlug: workspaceSlug! }}
          className="text-[11px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Folder className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-2.5">
          {projects.map((project, index) => {
            const style = PROJECT_ICON_STYLES[index % PROJECT_ICON_STYLES.length]
            const IconComponent = style.icon
            const updatedAt = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })

            return (
              <Link
                key={project.id}
                to="/workspace/$workspaceSlug/project/$projectSlug"
                params={{ workspaceSlug: workspaceSlug!, projectSlug: project.key }}
                className="group p-4 flex items-center justify-between rounded-lg border border-border/50 bg-surface-2 hover:bg-surface-2/80 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-md ${style.bg} border border-white/5 shrink-0 group-hover:scale-105 transition-transform`}>
                    <IconComponent className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-[13px] text-foreground truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5 truncate">
                      Updated {updatedAt} · {project.memberCount} member{project.memberCount !== 1 ? 's' : ''} · {project.openIssues} open issue{project.openIssues !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-2">
                  {/* Member & issue count pills — hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 13c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      {project.memberCount}
                    </span>
                    {project.openIssues > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500/80">
                        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                        </svg>
                        {project.openIssues}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Card>
  )
}
