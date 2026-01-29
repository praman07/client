import * as React from 'react'
import { cn } from '@/shared/lib/utils'

function ChatEvent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event"
      className={cn(
        'group relative flex w-full gap-3 px-4 py-1 transition-colors',
        className,
      )}
      {...props}
    />
  )
}

function ChatEventAddon({ className, ...props }: React.ComponentProps<'div'>) {
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

function ChatEventBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event-body"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  )
}

function ChatEventTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="chat-event-title"
      className={cn('text-sm font-semibold leading-tight', className)}
      {...props}
    />
  )
}

function ChatEventDescription({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="chat-event-description"
      className={cn('text-xs text-muted-foreground leading-tight', className)}
      {...props}
    />
  )
}

function ChatEventContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-event-content"
      className={cn('text-sm leading-relaxed wrap-break-words', className)}
      {...props}
    />
  )
}

export {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventTitle,
  ChatEventDescription,
  ChatEventContent,
}
