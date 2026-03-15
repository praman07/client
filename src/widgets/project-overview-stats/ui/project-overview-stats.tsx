import { useProjectOverview } from '@/entities/project'
import { AlertCircle, CheckCircle2, Clock, FileText, Users } from 'lucide-react'

interface ProjectOverviewStatsProps {
  projectId: string
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon: any
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export function ProjectOverviewStats({ projectId }: ProjectOverviewStatsProps) {
  const { data, isLoading } = useProjectOverview(projectId)
  const overview = data?.projectOverview

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 h-20 animate-pulse bg-muted"
          />
        ))}
      </div>
    )
  }

  if (!overview) return null

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Open Issues"
          value={overview.openIssues}
          icon={AlertCircle}
        />
        <StatCard
          label="Completed"
          value={overview.completedIssues}
          icon={CheckCircle2}
        />
        <StatCard label="Overdue" value={overview.overdueIssues} icon={Clock} />
        <StatCard label="Pages" value={overview.pageCount} icon={FileText} />
      </div>

      {/* Recent issues */}
      {overview.recentIssues && overview.recentIssues.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Recent Issues</h3>
          <div className="rounded-lg border divide-y">
            {overview.recentIssues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: issue.statusColor ?? '#888' }}
                />
                <span className="text-sm flex-1 truncate">{issue.title}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {issue.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members avatars */}
      {overview.members && overview.members.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" /> Members ({overview.members.length})
          </h3>
          <div className="flex -space-x-2">
            {overview.members.slice(0, 8).map((m) => (
              <div
                key={m.userId}
                title={m.name ?? ''}
                className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
              >
                {m.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            ))}
            {overview.members.length > 8 && (
              <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                +{overview.members.length - 8}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
