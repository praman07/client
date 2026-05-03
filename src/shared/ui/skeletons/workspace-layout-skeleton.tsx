import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * WorkspaceLayoutSkeleton
 *
 * Full-page skeleton shown while switching workspaces.
 * Mirrors the workspace layout structure (header + tab bar + grid content)
 * to prevent Cumulative Layout Shift (CLS) while fresh data loads.
 *
 * @layer Shared/UI/Skeletons
 */
export function WorkspaceLayoutSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex h-12 items-center gap-6 border-b border-subtle px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>

      {/* Content area — card grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-subtle p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
