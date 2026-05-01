import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('not-last:border-b not-last:border-subtle', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // Layout
          'relative flex flex-1 items-start justify-between py-3.5 border border-transparent',
          // Typography
          'text-13 font-medium text-primary text-left',
          // Hover
          'hover:bg-layer-transparent-hover rounded-md px-2 -mx-2',
          // Transition + press
          'hardware-accelerated active:scale-[0.98] transition-all duration-100',
          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-1',
          // Icon
          '**:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-tertiary',
          // Disabled
          'disabled:pointer-events-none disabled:text-disabled',
          'outline-none',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUp data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-13 text-secondary"
      {...props}
    >
      <div
        className={cn(
          'pt-0 pb-4 px-0',
          'h-[--accordion-panel-height] data-ending-style:h-0 data-starting-style:h-0',
          '[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-primary',
          '[&_p:not(:last-child)]:mb-4',
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
