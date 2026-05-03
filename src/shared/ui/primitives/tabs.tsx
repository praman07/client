'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        'gap-2 group/tabs flex data-[orientation=horizontal]:flex-col',
        className,
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  [
    'inline-flex w-fit items-center justify-center',
    'group/tabs-list text-secondary',
    'group-data-[orientation=horizontal]/tabs:h-8',
    'group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
  ],
  {
    variants: {
      variant: {
        // Pill/capsule background style
        default: 'bg-layer-1 rounded-lg p-0.5 gap-0.5 border border-subtle',
        // Underline / border-bottom style
        line: 'border-b border-subtle gap-1 rounded-none bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // Layout
        'relative inline-flex flex-1 h-[calc(100%-2px)] items-center justify-center whitespace-nowrap',
        'gap-1.5 rounded-md px-2.5 py-1 border border-transparent',
        // Typography
        'text-13 font-medium',
        // Default (inactive) state
        'text-secondary',
        // Hover
        'hover:text-primary hover:bg-layer-transparent-hover',
        // Active / selected
        'data-active:bg-surface-2 data-active:text-primary data-active:border-subtle data-active:shadow-raised-100',
        // Line variant active — underline indicator
        'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:border-transparent',
        'group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
        // Line indicator pseudo-element
        'after:absolute after:opacity-0 after:transition-opacity',
        'group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=horizontal]/tabs:after:bg-accent-primary after:rounded-full',
        'group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-px group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[orientation=vertical]/tabs:after:bg-accent-primary',
        // Sizing
        'group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start',
        // Transition + press
        'hardware-accelerated active:scale-[0.98] transition-all duration-100',
        // Focus
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-1',
        // Disabled
        'disabled:pointer-events-none disabled:text-disabled',
        // Icons
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('text-13 text-primary flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
