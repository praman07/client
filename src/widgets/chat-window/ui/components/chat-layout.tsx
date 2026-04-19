import * as React from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@/shared/lib/utils'

function ChatContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat"
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-surface-1 @container/chat min-h-0',
        className,
      )}
      {...props}
    />
  )
}

function ChatHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="chat-header"
      className={cn(
        'sticky top-0 z-[var(--z-sticky)] flex h-[var(--height-header)] w-full shrink-0 items-center gap-2 bg-surface-1 px-4 backdrop-blur-sm border-b border-subtle',
        className,
      )}
      {...props}
    />
  )
}

function ChatHeaderStart({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-header-start"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
}

function ChatHeaderMain({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-header-main"
      className={cn(
        'flex flex-1 flex-col justify-center overflow-hidden',
        className,
      )}
      {...props}
    />
  )
}

function ChatHeaderEnd({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-header-end"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
}

function ChatMessages({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-messages"
      className={cn(
        'flex flex-1 flex-col-reverse overflow-y-auto overflow-x-hidden p-4 no-scrollbar min-h-0',
        className,
      )}
      {...props}
    />
  )
}

function ChatToolbar({ className, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer
      data-slot="chat-toolbar"
      className={cn(
        'sticky bottom-0 z-[var(--z-sticky)] w-full min-h-[var(--height-header)] shrink-0 bg-surface-1 p-4 backdrop-blur-sm border-t border-subtle',
        className,
      )}
      {...props}
    />
  )
}

function ChatToolbarAddonStart({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-toolbar-addon-start"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function ChatToolbarAddonEnd({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-toolbar-addon-end"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function ChatToolbarTextarea({
  className,
  render,
  ...props
}: useRender.ComponentProps<'textarea'> & React.ComponentProps<'textarea'>) {
  return useRender({
    defaultTagName: 'textarea',
    props: mergeProps<'textarea'>(
      {
        className: cn(
          'flex min-h-[40px] w-full resize-none bg-transparent py-2 text-14 placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled overflow-hidden',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'chat-toolbar-textarea',
    },
  })
}

export {
  ChatContainer,
  ChatHeader,
  ChatHeaderStart,
  ChatHeaderMain,
  ChatHeaderEnd,
  ChatMessages,
  ChatToolbar,
  ChatToolbarAddonStart,
  ChatToolbarAddonEnd,
  ChatToolbarTextarea,
}
