import { Skeleton } from '@/shared/ui'

interface DataTableSkeletonProps {
  columnCount: number  // number of <td> cells per row
  rowCount?: number    // default: 5
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 5,
}: DataTableSkeletonProps) {
  return (
    <div className="rounded-xl border border-border/40 overflow-hidden bg-card/20">
      {/* Header skeleton */}
      <div className="flex items-center gap-8 px-4 py-3 border-b border-border/40 bg-muted/30">
        {Array.from({ length: columnCount }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rowCount }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-8 px-4 py-3.5 border-b border-border/20 last:border-0"
        >
          {Array.from({ length: columnCount }).map((_, j) => (
            <Skeleton key={j} className="h-3.5 w-32" />
          ))}
        </div>
      ))}
    </div>
  )
}
