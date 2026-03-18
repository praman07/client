import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * Explorer grid loading skeleton.
 * @layer Widgets
 */
export function VaultExplorerSkeleton() {
  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
