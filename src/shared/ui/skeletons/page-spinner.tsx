import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface PageSpinnerProps {
  /** Optional label shown below the spinner */
  label?: string
  /** Full-screen centering (default: true) */
  fullHeight?: boolean
  className?: string
}

/**
 * PageSpinner
 *
 * Used for secondary/transition loading states — e.g. navigation between sub-routes
 * where a Skeleton isn't appropriate (data is already partial / transitional).
 *
 * Placement:
 * - TanStack Router `pendingComponent` when we don't have a proper Skeleton yet
 * - Inside widgets for mutation/refetch loading states (e.g. submit button area)
 * - Route children that depend on a parent promise resolving (e.g. waiting for Redux sync)
 */
export function PageSpinner({ label, fullHeight = true, className }: PageSpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-muted-foreground',
        fullHeight && 'h-full w-full min-h-[200px]',
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  )
}
