import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const badgeVariants = cva(
  // Base — shared
  [
    'inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0',
    'gap-1 rounded-full border border-transparent px-2 py-0.5',
    'text-11 font-medium leading-none',
    'transition-colors duration-100',
    "[&>svg]:size-3! [&>svg]:pointer-events-none",
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        // Default — neutral
        default:    'bg-layer-2 text-secondary border-subtle',
        // Brand accent
        accent:     'bg-accent-subtle text-accent-primary border-accent-subtle',
        // Success / positive
        success:    'bg-success-subtle text-success-primary',
        // Warning
        warning:    'bg-warning-subtle text-warning-primary',
        // Danger / error
        destructive: 'bg-danger-subtle text-danger-primary',
        // Outline only
        outline:    'bg-transparent border-subtle text-primary',
        // Ghost — very subtle
        ghost:      'bg-layer-transparent hover:bg-layer-transparent-hover text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}

export { Badge, badgeVariants }
