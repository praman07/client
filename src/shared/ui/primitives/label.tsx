'use client'

import * as React from 'react'

import { cn } from '@/shared/lib/utils'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        // Typography
        'text-13 font-medium leading-none text-secondary',
        // Layout
        'flex items-center gap-2 select-none',
        // Disabled (when peer/group is disabled)
        'peer-disabled:cursor-not-allowed peer-disabled:text-disabled',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-disabled',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
