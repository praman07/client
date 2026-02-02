import {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventContent,
  MessageEventDescription,
  MessageEventTitle,
} from './message'
import type { MessageRowData } from '../../model/message-list.types'
import { Avatar, AvatarFallback } from '@/shared/ui/primitives/avatar'
import { cn } from '@/shared/lib/utils'

function getSafeContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text
  }
  return JSON.stringify(content)
}

interface PrimaryMessageProps {
  message: MessageRowData
  avatarFallback: string
  className?: string
}

export function PrimaryMessage({
  message,
  avatarFallback,
  className,
}: PrimaryMessageProps) {
  return (
    <MessageEvent className={cn('hover:bg-accent/50', className)}>
      <MessageEventAddon>
        <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto border shadow-sm">
          <AvatarFallback className="text-xs font-bold bg-muted">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </MessageEventAddon>
      <MessageEventBody>
        <div className="flex items-baseline gap-2">
          <MessageEventTitle className="hover:underline cursor-pointer">
            {message.authorId}
          </MessageEventTitle>
          <MessageEventDescription>
            {new Intl.DateTimeFormat('en-US', {
              timeStyle: 'short',
            }).format(new Date(message.createdAt))}
          </MessageEventDescription>
        </div>
        <MessageEventContent>
          {getSafeContent(message.content)}
        </MessageEventContent>
      </MessageEventBody>
    </MessageEvent>
  )
}
