import * as React from 'react'

import { cn } from '@/shared/lib/utils'

interface TextareaProps extends React.ComponentProps<'textarea'> {
  maxHeight?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const maxHeightMap = {
  none: 'max-h-none',
  sm: 'max-h-16',
  md: 'max-h-24',
  lg: 'max-h-32',
  xl: 'max-h-40',
  '2xl': 'max-h-60',
}

function Textarea({ className, maxHeight = 'none', ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex w-full min-h-16 rounded-md px-2.5 py-2',
        'text-13 text-primary placeholder:text-placeholder',
        'bg-layer-1 border border-subtle-1',
        'field-sizing-content',
        'transition-colors duration-100',
        'focus-visible:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/20',
        'aria-invalid:border-danger-strong aria-invalid:ring-2 aria-invalid:ring-danger-strong/20',
        'disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-disabled disabled:border-subtle',
        maxHeight !== 'none' && maxHeightMap[maxHeight],
        maxHeight !== 'none' && 'overflow-y-auto',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
