import React from 'react'
import { MessageTimestamp } from './MessageTimestamp'
import type { Message } from '../model/types'
import { cn } from '@/shared/lib/utils'

interface MessageBubbleProps {
  message: Message
  isMe: boolean
  isContinuous?: boolean
  className?: string
}

export function MessageBubble({
  message,
  isMe,
  isContinuous,
  className,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'group flex flex-col max-w-[85%] relative',
        isMe ? 'items-end' : 'items-start',
        className,
      )}
    >
      <div
        className={cn(
          'px-4 py-2 text-sm rounded-2xl relative',
          // Color logic
          isMe
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none',
          // Continuous logic (if same author next to each other, reduce radius)
          isContinuous && isMe && 'rounded-tr-md',
          isContinuous && !isMe && 'rounded-tl-md',
          // Optimistic
          message.deliveryStatus === 'pending' && 'opacity-70',
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>

      <div
        className={cn(
          'flex items-center gap-1 mt-0.5 px-1',
          isMe ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        <MessageTimestamp date={message.createdAt} />
        {/* delivery status icon could go here check */}
      </div>
    </div>
  )
}
