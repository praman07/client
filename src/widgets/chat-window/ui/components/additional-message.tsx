import {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventContent,
  MessageEventDescription,
} from './message'
import type { MessageRowData } from '../../model/message-list.types'

function getSafeContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text
  }
  return JSON.stringify(content)
}

interface AdditionalMessageProps {
  message: MessageRowData
}

export function AdditionalMessage({ message }: AdditionalMessageProps) {
  return (
    <MessageEvent className="hover:bg-accent/50 group h-auto py-0.5">
      <MessageEventAddon>
        <MessageEventDescription className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible select-none">
          {new Intl.DateTimeFormat('en-US', {
            timeStyle: 'short',
          }).format(new Date(message.createdAt))}
        </MessageEventDescription>
      </MessageEventAddon>
      <MessageEventBody>
        <MessageEventContent>
          {getSafeContent(message.content)}
        </MessageEventContent>
      </MessageEventBody>
    </MessageEvent>
  )
}
