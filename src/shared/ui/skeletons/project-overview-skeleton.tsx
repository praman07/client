import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * ProjectOverviewSkeleton
 * Stats cards + recent activity placeholder for the project overview/dashboard page.
 */
export function ProjectOverviewSkeleton() {
  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Page title */}
      <Skeleton className="h-8 w-48" />

      {/* Stats cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <Skeleton className={`h-4 ${i % 2 === 0 ? 'w-64' : 'w-48'}`} />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
