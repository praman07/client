import * as React from 'react'
import { cn } from '@/shared/lib/utils'

function MessageEvent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event"
      className={cn(
        'group relative flex w-full gap-3 px-4 py-1.5 transition-colors',
        className,
      )}
      {...props}
    />
  )
}

function MessageEventAddon({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event-addon"
      className={cn(
        'flex w-8 shrink-0 flex-col items-center @md/chat:w-10',
        className,
      )}
      {...props}
    />
  )
}

function MessageEventBody({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event-body"
      className={cn('flex min-w-0 flex-1 flex-col gap-1', className)}
      {...props}
    />
  )
}

function MessageEventTitle({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="chat-event-title"
      className={cn('text-14 font-semibold leading-tight', className)}
      {...props}
    />
  )
}

function MessageEventDescription({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="chat-event-description"
      className={cn('text-11 text-secondary leading-tight', className)}
      {...props}
    />
  )
}

function MessageEventContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event-content"
      className={cn('text-14 leading-relaxed min-w-0 wrap-break-words', className)}
      {...props}
    />
  )
}

export {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventTitle,
  MessageEventDescription,
  MessageEventContent,
}
