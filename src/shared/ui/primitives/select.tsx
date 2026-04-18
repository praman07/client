'use client'

import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // Layout
        'flex w-fit items-center justify-between gap-1.5 whitespace-nowrap rounded-md outline-none',
        'px-2.5 pr-2 py-1.5',
        // Typography
        'text-13 text-primary',
        // Background + border
        'bg-layer-1 border border-subtle-1',
        // Sizes
        'data-[size=default]:h-8 data-[size=sm]:h-7',
        // Placeholder
        'data-placeholder:text-placeholder',
        // Transition
        'transition-colors duration-100 hardware-accelerated active:scale-[0.98]',
        // Focus
        'focus-visible:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/20',
        // Error
        'aria-invalid:border-danger-strong aria-invalid:ring-2 aria-invalid:ring-danger-strong/20',
        // Disabled
        'disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-disabled disabled:border-subtle',
        // Icon children
        "*:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:items-center",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            strokeWidth={2}
            className="text-tertiary size-4 pointer-events-none shrink-0"
          />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-[var(--z-dropdown)]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            // Container
            'bg-surface-2 border border-subtle rounded-lg p-1',
            'shadow-overlay-100 text-13 text-primary',
            // Sizing
            'min-w-36 max-h-[--available-height] w-[--anchor-width]',
            'overflow-x-hidden overflow-y-auto',
            'origin-[--transform-origin] relative isolate',
            // Animations
            'data-open:animate-in data-closed:animate-out',
            'data-closed:fade-out-0 data-open:fade-in-0',
            'data-closed:zoom-out-95 data-open:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            'duration-150',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('px-2 py-1 text-11 font-medium text-tertiary uppercase tracking-wide', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Layout
        'relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2',
        'text-13 text-primary outline-none select-none',
        // Hover / focus
        'focus:bg-layer-1-hover data-highlighted:bg-layer-1-hover',
        // Icons
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // Press animation
        'hardware-accelerated active:scale-[0.98] transition-all duration-100',
        // Disabled
        'data-disabled:pointer-events-none data-disabled:text-disabled',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 gap-2 shrink-0 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center text-accent-primary" />
        }
      >
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2}
          className="pointer-events-none size-3.5"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-subtle -mx-1 my-1 h-px pointer-events-none', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-surface-2 z-10 flex cursor-default items-center justify-center py-1 top-0 w-full text-secondary",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-surface-2 z-10 flex cursor-default items-center justify-center py-1 bottom-0 w-full text-secondary",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
