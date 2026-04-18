import { Skeleton } from '@/shared/ui'

interface SkeletonNavTabsProps {
  /** Number of skeleton tab placeholders to render. Default: 4 */
  count?: number
}

/**
 * SkeletonNavTabs — CLS-safe placeholder for NavTabs during plugin data loading.
 *
 * Matches the exact h-12 (48px) height and flex layout of <NavTabs> so the
 * surrounding layout does not shift when the real tabs hydrate.
 */
export function SkeletonNavTabs({ count = 4 }: SkeletonNavTabsProps) {
  return (
    <div className="w-full shrink-0 border-b border-subtle bg-layer-1 px-6">
      <nav className="flex items-center gap-6 overflow-x-auto overflow-y-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="relative flex h-12 items-center"
          >
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </nav>
    </div>
  )
}
