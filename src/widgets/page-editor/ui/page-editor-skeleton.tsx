import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * Skeleton shown while Phase 1 (server sync) completes.
 * Prevents the editor from flashing empty on load.
 *
 * @layer Widgets
 */
export function PageEditorSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-12 space-y-4 animate-pulse-subtle">
      {/* Cover placeholder */}
      <Skeleton className="h-40 w-full rounded-xl" />
      {/* Title */}
      <Skeleton className="h-10 w-2/3 rounded-lg" />
      {/* Body lines */}
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-4/6 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
      </div>
    </div>
  )
}
