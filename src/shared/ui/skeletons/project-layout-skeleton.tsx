import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * ProjectLayoutSkeleton
 * Full-height shell: tab bar + content pane placeholder.
 * Used as `pendingComponent` on the project.$projectSlug route.
 */
export function ProjectLayoutSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="shrink-0 border-b bg-surface-1 px-6 h-12 flex items-center gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>
      {/* Content area */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
