import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const alertVariants = cva(
  [
    // Layout
    'grid gap-0.5 rounded-lg border px-4 py-3 text-left text-13',
    // Action support
    'has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18',
    // Icon layout
    "has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5",
    "*:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
    "*:[svg:not([class*='size-'])]:size-4",
    'w-full relative group/alert',
  ],
  {
    variants: {
      variant: {
        // Neutral / informational
        default:
          'bg-layer-1 text-primary border-subtle',
        // Accent / info
        info:
          'bg-accent-subtle text-accent-primary border-accent-subtle *:[svg]:text-accent-primary',
        // Success
        success:
          'bg-success-subtle text-success-primary border-success-subtle *:[svg]:text-success-primary',
        // Warning
        warning:
          'bg-warning-subtle text-warning-primary border-warning-subtle *:[svg]:text-warning-primary',
        // Danger / destructive
        destructive:
          'bg-danger-subtle text-danger-primary border-danger-subtle *:[svg]:text-danger-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'text-13 font-semibold leading-snug',
        'group-has-[>svg]/alert:col-start-2',
        '[&_a]:hover:underline [&_a]:underline-offset-3',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-12 opacity-90 text-balance md:text-pretty leading-relaxed',
        'group-has-[>svg]/alert:col-start-2',
        '[&_p:not(:last-child)]:mb-3',
        '[&_a]:underline [&_a]:underline-offset-3',
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-action"
      className={cn('absolute top-2.5 right-3', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
