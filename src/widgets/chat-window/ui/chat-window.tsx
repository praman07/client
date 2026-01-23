import { useParams } from '@tanstack/react-router'
import { DUMMY_MESSAGES } from '../lib/dummy-messages'
import { ChatHeader } from './chat-header'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import {
  DUMMY_CHANNELS,
  DUMMY_DMS,
} from '@/widgets/chat-sidebar/lib/dummy-data'

export function ChatWindow() {
  const { channelId } = useParams({ strict: false })

  // Simple lookup for dummy data
  const channel = DUMMY_CHANNELS.find((c) => c.id === channelId)
  const dm = DUMMY_DMS.find((d) => d.id === channelId)

  const name = channel?.name || dm?.name || 'Unknown Channel'
  const isPrivate = channel?.type === 'private' || !!dm

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        channelName={name}
        isPrivate={isPrivate}
        description={
          channel
            ? 'Topic: General discussion about the project'
            : 'Direct Message'
        }
      />
      <MessageList messages={DUMMY_MESSAGES} />
      <MessageInput />
    </div>
  )
}
