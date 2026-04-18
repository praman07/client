import * as React from 'react'

import { cn } from '@/shared/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Layout
        'flex w-full min-h-16 rounded-md px-2.5 py-2',
        // Typography
        'text-13 text-primary placeholder:text-placeholder',
        // Background + border
        'bg-layer-1 border border-subtle-1',
        // Resize
        'field-sizing-content',
        // Transition
        'transition-colors duration-100',
        // Focus
        'focus-visible:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/20',
        // Error
        'aria-invalid:border-danger-strong aria-invalid:ring-2 aria-invalid:ring-danger-strong/20',
        // Disabled
        'disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-disabled disabled:border-subtle',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
