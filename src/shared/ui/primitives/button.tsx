import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  // Base — shared across all variants
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-md',
    'text-13 font-medium leading-none',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-1 focus-visible:ring-offset-canvas',
    // Disabled — use token-based disabled, NOT opacity-50
    'disabled:pointer-events-none disabled:text-disabled disabled:bg-layer-1',
    // Press animation
    'active:scale-[0.98] hardware-accelerated',
    // SVG sizing
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Primary CTA
        default:
          'bg-accent-primary hover:bg-accent-primary-hover active:bg-accent-primary-active text-on-color',
        // Destructive / danger action
        destructive:
          'bg-danger-primary hover:bg-danger-primary-hover active:bg-danger-primary-active text-on-color',
        // Bordered secondary
        outline:
          'border border-subtle hover:bg-layer-1 hover:border-strong text-primary bg-transparent',
        // Subtle filled secondary
        secondary:
          'bg-layer-2 hover:bg-layer-2-hover active:bg-layer-2-active text-primary border border-subtle',
        // Ghost — toolbar / icon buttons
        ghost:
          'bg-layer-transparent hover:bg-layer-transparent-hover active:bg-layer-transparent-active text-secondary hover:text-primary',
        // Link-style
        link: 'text-accent-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto',
      },
      size: {
        default: 'h-8 px-3 py-1.5 gap-1.5',
        sm:      'h-7 px-2.5 py-1 gap-1 text-12 rounded-md',
        lg:      'h-9 px-4 py-2 gap-2',
        xl:      'h-10 px-5 py-2.5 gap-2 text-14',
        icon:    'h-8 w-8 p-1.5',
        'icon-sm': 'h-7 w-7 p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
