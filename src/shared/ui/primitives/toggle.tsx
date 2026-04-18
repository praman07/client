import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const toggleVariants = cva(
  [
    // Base
    'group/toggle inline-flex items-center justify-center whitespace-nowrap rounded-md',
    'gap-1 text-13 font-medium outline-none',
    // Hover (off)
    'hover:bg-layer-1 hover:text-primary text-secondary',
    // On / pressed state
    'aria-pressed:bg-layer-2 aria-pressed:text-primary',
    // Transition + press
    'hardware-accelerated active:scale-[0.95] transition-all duration-100',
    // Icons
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Disabled
    'disabled:pointer-events-none disabled:text-disabled',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-subtle bg-transparent hover:border-strong',
      },
      size: {
        default: 'h-8 min-w-8 px-2',
        sm:      'h-7 min-w-7 px-1.5',
        lg:      'h-9 min-w-9 px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
