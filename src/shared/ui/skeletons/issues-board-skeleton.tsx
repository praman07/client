import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * IssuesBoardSkeleton
 * Kanban board placeholder: column headers with stacked card outlines.
 */
export function IssuesBoardSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <Skeleton className="h-7 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
      {/* Columns */}
      <div className="flex gap-3 overflow-hidden flex-1">
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-2 w-72 shrink-0">
            {/* Column header */}
            <div className="flex items-center gap-2 px-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-6 ml-auto rounded-full" />
            </div>
            {/* Cards */}
            <div className="flex flex-col gap-2">
              {Array.from({ length: col === 0 ? 4 : col === 1 ? 3 : 2 }).map((_fill, card) => (
                <div key={card} className="rounded-lg border bg-card p-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
