import { useEffect, useRef } from 'react'
import type { MessageItem as MessageItemType } from '../model/types'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'

interface MessageListProps {
  messages: Array<MessageItemType>
}

function MessageItem({ message }: { message: MessageItemType }) {
  return (
    <div
      className={`group flex gap-3 py-2 px-4 hover:bg-muted/50 ${message.isMe ? 'bg-muted/10' : ''}`}
    >
      <Avatar className="h-8 w-8 rounded-md mt-1 cursor-pointer">
        <AvatarImage src={message.senderAvatar} />
        <AvatarFallback className="rounded-md">
          {message.senderName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold hover:underline cursor-pointer">
            {message.senderName}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>
        <div className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, i) => (
              <div
                key={i}
                className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-0.5 text-xs border border-transparent hover:border-border cursor-pointer"
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Hover Actions (Hidden by default, shown on group-hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 -mt-2 bg-background border shadow-sm rounded-md p-1 flex">
        {/* Actions would go here */}
      </div>
    </div>
  )
}

export function MessageList({ messages }: MessageListProps) {
  // Auto-scroll to bottom dummy implementation
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col py-4">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
