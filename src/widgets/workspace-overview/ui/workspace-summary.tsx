import { Card } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { useWorkspaceOverview } from '@/entities/workspace/hooks'

function WorkspaceSummarySkeleton() {
  return (
<Card className="flex flex-col p-6 w-full shadow-raised-100 border border-subtle bg-layer-1">
    <Skeleton className="h-3 w-28 mb-6" />
    <div className="flex flex-col sm:grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 pb-5 sm:pb-0 ${i === 1 ? 'sm:pr-6' : i === 2 ? 'sm:px-6 py-5 sm:py-0' : 'sm:pl-6 pt-5 sm:pt-0'}`}
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-16 mt-2" />
            <Skeleton className="h-3 w-20 mt-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function WorkspaceSummary() {
  const { data, isLoading } = useWorkspaceOverview()

  if (isLoading) return <WorkspaceSummarySkeleton />

  const overview = data?.workspaceOverview

  return (
<Card className="flex flex-col p-6 w-full shadow-raised-100 border border-subtle bg-layer-1">
  <h3 className="text-11 font-semibold uppercase tracking-wider text-secondary mb-6">
    Workspace Summary
  </h3>

  <div className="flex flex-col sm:grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle">

    {/* Metric 1 — Total Projects */}
    <div className="flex flex-col gap-1 sm:pr-6 pb-5 sm:pb-0">
      <span className="text-14 text-primary/80 font-medium">Total Projects</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-32 font-bold font-mono text-primary tracking-tight">
          {overview?.totalProjects ?? 0}
        </span>
        <span className="text-12 text-success-primary font-medium">Active</span>
      </div>
    </div>

    {/* Metric 2 — Total Members */}
    <div className="flex flex-col gap-1 sm:px-6 py-5 sm:py-0">
      <span className="text-14 text-primary/80 font-medium">Total Members</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-32 font-bold font-mono text-primary tracking-tight">
          {overview?.totalMembers ?? 0}
        </span>
        <span className="text-12 text-accent-primary font-medium">In workspace</span>
      </div>
    </div>

    {/* Metric 3 — Total Issues */}
    <div className="flex flex-col gap-1 sm:pl-6 pt-5 sm:pt-0">
      <span className="text-14 text-primary/80 font-medium">Total Issues</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-32 font-bold font-mono text-primary tracking-tight">
          {overview?.totalIssues ?? 0}
        </span>
        <span className="text-12 text-warning-primary font-medium">Tracked</span>
      </div>
    </div>

  </div>
</Card>
  )
}
