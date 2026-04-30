'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cn } from '@/shared/lib/utils'

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Base
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full outline-none',
        'border border-transparent shadow-xs',
        // Transition
        'hardware-accelerated active:scale-[0.95] transition-all duration-150',
        // Unchecked track
        'data-unchecked:bg-layer-2 data-unchecked:border-subtle-1',
        // Checked track
        'data-checked:bg-accent-primary data-checked:border-accent-strong',
        // Sizes
        'data-[size=default]:h-[18px] data-[size=default]:w-8',
        'data-[size=sm]:h-3.5 data-[size=sm]:w-6',
        // Focus
        'focus-visible:ring-2 focus-visible:ring-accent-strong/30 focus-visible:border-accent-strong',
        // Error
        'aria-invalid:ring-2 aria-invalid:ring-danger-strong/20 aria-invalid:border-danger-strong',
        // Extended tap area
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        // Disabled
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-white rounded-full pointer-events-none block ring-0 transition-transform',
          // Sizes
          'group-data-[size=default]/switch:size-3.5',
          'group-data-[size=sm]/switch:size-2.5',
          'group-data-[size=default]/switch:data-unchecked:translate-x-[2px]',
          'group-data-[size=sm]/switch:data-unchecked:translate-x-[2px]',
          // Position: checked
          'group-data-[size=default]/switch:data-checked:translate-x-[calc(100%+2px)]',
          'group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%+2px)]',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
