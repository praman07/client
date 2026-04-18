import { Skeleton } from '@/shared/ui'

/** Row-accurate skeleton that matches the exact visual structure of each MemberRow */
export function MemberListSkeleton() {
  return (
    <div className="rounded-lg border border-subtle overflow-hidden">
      {/* Table header skeleton */}
      <div className="flex items-center gap-4 px-3 py-2.5 border-b border-subtle bg-layer-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-24 ml-16" />
        <Skeleton className="h-3 w-12 ml-28" />
        <Skeleton className="h-3 w-16 ml-28" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
      {/* 5 row skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-3 py-3.5 border-b border-subtle last:border-0"
        >
          {/* Avatar + name */}
          <div className="flex items-center gap-2.5 w-48">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          {/* Email */}
          <Skeleton className="h-3 w-44" />
          {/* Role badge */}
          <Skeleton className="h-5 w-16 rounded" />
          {/* Joined at */}
          <Skeleton className="h-3 w-24 ml-auto" />
          {/* Actions */}
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      ))}
    </div>
  )
}
