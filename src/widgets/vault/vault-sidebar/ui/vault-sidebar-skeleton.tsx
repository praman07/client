import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * Sidebar loading shimmer — shown while useVaultSidebar is pending.
 * @layer Widgets
 */
export function VaultSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      {/* Section header */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <Skeleton className="h-3 w-14" />
      </div>
      {/* Folder rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      ))}
      {/* Second section */}
      <div className="flex items-center justify-between px-2 py-1.5 mt-2">
        <Skeleton className="h-3 w-20" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      ))}
    </div>
  )
}
