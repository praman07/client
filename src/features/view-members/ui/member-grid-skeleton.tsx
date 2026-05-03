import { Skeleton } from '@/shared/ui'

/**
 * MemberGridSkeleton
 * 
 * Displays a loading skeleton for the member grid.
 * Matches the layout and dimensions of the MemberGridCard.
 */
export function MemberGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-pulse-subtle">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-subtle bg-layer-1 p-5 flex flex-col items-center gap-4">
          {/* Avatar Skeleton */}
          <Skeleton className="h-16 w-16 rounded-full" />
          
          {/* Info Skeleton */}
          <div className="flex flex-col items-center gap-2 w-full">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
          
          {/* Role + Joined Skeleton */}
          <div className="flex flex-col items-center gap-2 w-full pt-1 border-t border-subtle">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-2 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
