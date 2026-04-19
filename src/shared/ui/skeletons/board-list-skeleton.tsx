import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * BoardListSkeleton
 * Grid of board card placeholders.
 * Used as loading fallback on the whiteboard index route.
 */
export function BoardListSkeleton() {
  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Board grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-subtle p-3">
            <Skeleton className="h-32 rounded-lg w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
