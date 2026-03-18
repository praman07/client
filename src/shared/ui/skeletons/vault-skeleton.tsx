import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * VaultSkeleton
 * File-tree sidebar + detail pane placeholder.
 */
export function VaultSkeleton() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar tree */}
      <div className="w-64 border-r flex flex-col gap-1 p-3 shrink-0">
        <Skeleton className="h-8 w-full rounded-md mb-2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-1 py-0.5" style={{ paddingLeft: i % 3 === 0 ? 4 : i % 2 === 0 ? 20 : 36 }}>
            <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
            <Skeleton className={`h-3.5 ${i % 3 === 0 ? 'w-28' : i % 2 === 0 ? 'w-24' : 'w-20'}`} />
          </div>
        ))}
      </div>
      {/* Main explorer */}
      <div className="flex-1 flex flex-col gap-3 p-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* File grid */}
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-lg border">
              <Skeleton className="h-12 w-10 rounded" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
