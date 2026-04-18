import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'

import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base
        'relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border outline-none peer',
        // Unchecked
        'border-subtle-1 bg-layer-1',
        // Checked
        'data-checked:bg-accent-primary data-checked:border-accent-strong data-checked:text-on-color',
        // Focus
        'focus-visible:ring-2 focus-visible:ring-accent-strong/30 focus-visible:border-accent-strong',
        // Error
        'aria-invalid:border-danger-strong aria-invalid:ring-2 aria-invalid:ring-danger-strong/20',
        // Press
        'hardware-accelerated active:scale-[0.95] transition-all duration-100',
        // Extended tap area
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        'group-has-disabled/field:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
