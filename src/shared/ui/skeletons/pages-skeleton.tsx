import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * PagesSkeleton
 * Pages sidebar list + editor content area placeholder.
 */
export function PagesSkeleton() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar list */}
      <div className="w-56 border-r flex flex-col gap-1 p-3 shrink-0">
        <Skeleton className="h-8 w-full rounded-md mb-2" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 py-0.5 px-1">
            <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
            <Skeleton className={`h-3.5 ${i % 2 === 0 ? 'w-28' : 'w-20'}`} />
          </div>
        ))}
      </div>
      {/* Editor area */}
      <div className="flex-1 flex flex-col gap-4 p-8 max-w-3xl">
        {/* Title */}
        <Skeleton className="h-10 w-2/3" />
        {/* Content paragraphs */}
        <div className="flex flex-col gap-3 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-px w-full mt-2" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
