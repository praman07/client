import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { Circle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid gap-3 w-full', className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        'border-subtle-1 bg-layer-1 text-accent-primary focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/20 aria-invalid:ring-2 aria-invalid:ring-danger-strong/20 aria-invalid:border-danger-strong flex size-4 rounded-full group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 hardware-accelerated active:scale-[0.90] transition-all duration-100',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="group-aria-invalid/radio-group-item:text-danger-primary text-accent-primary flex size-4 items-center justify-center"
      >
        <Circle className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
