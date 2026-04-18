import { cn } from '@/shared/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-layer-1 rounded-md animate-pulse-subtle',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
