'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/primitives'

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        // Layout
        'fixed inset-0 isolate z-50 bg-black/60 supports-backdrop-filter:backdrop-blur-sm',
        // Transition on GPU-composited property only
        'transition-opacity duration-200 ease-out',
        // Starting state (entering) — Base UI sets this on first-frame
        'data-starting-style:opacity-0',
        // Ending state (leaving) — Base UI sets this just before unmount
        'data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          // Positioning — translate-x stays -50%, translate-y animated below
          'fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 outline-none',
          // Container
          'grid max-w-[calc(100%-2rem)] gap-6 rounded-xl border border-border bg-background p-6 text-sm shadow-xl sm:max-w-md lg:max-w-xl',
          // GPU-accelerated transition on composited props only
          '[transition:transform_220ms_cubic-bezier(0.16,1,0.3,1),opacity_200ms_ease]',
          '[will-change:transform,opacity]',
          // Resting / open state
          '-translate-y-1/2 opacity-100 scale-100',
          // Enter from: nudged 16px down, scaled 96%, invisible
          'data-starting-style:-translate-y-[calc(50%-16px)] data-starting-style:opacity-0 data-starting-style:scale-[0.96]',
          // Exit to: nudged 8px down, scaled 97%, invisible
          'data-ending-style:-translate-y-[calc(50%-8px)] data-ending-style:opacity-0 data-ending-style:scale-[0.97]',
          // Faster exit
          '[&[data-ending-style]]:[transition-duration:150ms]',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                size="sm"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('gap-2 flex flex-col', className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'gap-2 flex flex-col-reverse sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('leading-none font-medium', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3',
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
