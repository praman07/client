import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/shared/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Layout
        'h-8 w-full min-w-0 rounded-md px-2.5 py-1.5',
        // Typography
        'text-13 text-primary placeholder:text-placeholder',
        // Background + border
        'bg-layer-1 border border-subtle-1',
        // Transition
        'transition-colors duration-100',
        // Focus — no ring classes, handled by global :focus-visible but add border change
        'focus-visible:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/20',
        // Error state
        'aria-invalid:border-danger-strong aria-invalid:ring-2 aria-invalid:ring-danger-strong/20',
        // Disabled
        'disabled:pointer-events-none disabled:text-disabled disabled:border-subtle disabled:cursor-not-allowed',
        // File input
        'file:h-6 file:text-12 file:font-medium file:text-primary file:border-0 file:bg-transparent',
        // Number input — hide spinners
        '[[type=number]&]:[appearance:textfield] [[type=number]&]:[&::-webkit-outer-spin-button]:appearance-none [[type=number]&]:[&::-webkit-inner-spin-button]:appearance-none',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
