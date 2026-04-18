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
        // Backdrop — use semantic backdrop token
        'fixed inset-0 isolate z-[var(--z-overlay)] bg-backdrop',
        'supports-backdrop-filter:backdrop-blur-sm',
        // Transitions
        'transition-opacity duration-200 ease-out',
        'data-starting-style:opacity-0',
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
          // Positioning
          'fixed top-1/2 left-1/2 z-[var(--z-modal)] w-full -translate-x-1/2 outline-none',
          // Container — surface-2 sits on a different plane than surface-1
          'grid max-w-[calc(100%-2rem)] gap-6 rounded-xl',
          'bg-surface-2 border border-subtle shadow-dialog p-6 text-13',
          // Animation
          '[transition:transform_220ms_cubic-bezier(0.16,1,0.3,1),opacity_200ms_ease]',
          '[will-change:transform,opacity]',
          '-translate-y-1/2 opacity-100 scale-100',
          'data-starting-style:-translate-y-[calc(50%-16px)] data-starting-style:opacity-0 data-starting-style:scale-[0.96]',
          'data-ending-style:-translate-y-[calc(50%-8px)] data-ending-style:opacity-0 data-ending-style:scale-[0.97]',
          '[&[data-ending-style]]:[transition-duration:150ms]',
          'sm:max-w-md lg:max-w-xl',
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
                size="icon-sm"
                className="absolute top-4 right-4"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={16} />
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
      className={cn('flex flex-col gap-1.5', className)}
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
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
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
      className={cn('text-16 font-semibold leading-snug text-primary tracking-tight', className)}
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
        'text-13 text-secondary',
        '*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-primary',
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
