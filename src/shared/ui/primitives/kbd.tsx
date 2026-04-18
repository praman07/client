import { cn } from '@/shared/lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // Base
        'bg-layer-2 text-secondary border border-subtle',
        'h-5 w-fit min-w-5 gap-1 rounded px-1',
        'font-sans text-11 font-medium leading-none',
        "[&_svg:not([class*='size-'])]:size-3",
        'pointer-events-none inline-flex items-center justify-center select-none',
        // When inside tooltip — slightly lighter appearance
        '[[data-slot=tooltip-content]_&]:bg-layer-3 [[data-slot=tooltip-content]_&]:text-primary [[data-slot=tooltip-content]_&]:border-strong',
        className,
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('gap-1 inline-flex items-center', className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
