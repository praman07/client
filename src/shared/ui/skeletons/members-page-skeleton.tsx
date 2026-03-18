import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * MembersPageSkeleton
 * Settings members table placeholder.
 */
export function MembersPageSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      {/* Table header */}
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24 ml-auto" />
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Table rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-1">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28 ml-auto" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}
