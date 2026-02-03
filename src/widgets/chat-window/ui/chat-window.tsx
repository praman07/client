import { ChatHeader } from './chat-header'
import { MessageInput } from './message-input'
import { ChatContainer } from './components/chat-layout'
import { MessageList } from '@/widgets/chat-window/ui/message-list'
import { useChannelSubscription } from '@/features/chat/subscribe-channel'
import { useResequencerStatus } from '@/entities/chat-session'
import { SyncStatusIndicator } from '@/entities/chat-session/ui/SyncStatusIndicator'

// TODO: Fetch real channel details via Query

interface ChatWindowProps {
  channelId: string
  projectId: string
  channelName: string
  isPrivate: boolean
  description?: string
}

export function ChatWindow({
  channelId,
  projectId,
  channelName,
  isPrivate,
  description,
}: ChatWindowProps) {
  // 1. Activate Subscription (Data Plane)
  useChannelSubscription(channelId || '', projectId)

  // 2. Monitoring (Control Plane)
  const status = useResequencerStatus(channelId || '')

  return (
    <ChatContainer>
      <ChatHeader
        channelId={channelId}
        channelName={channelName}
        isPrivate={isPrivate}
        description={
          description || 'Topic: General discussion about the project'
        }
      >
        <SyncStatusIndicator status={status} />
      </ChatHeader>
      <MessageList channelId={channelId || ''} projectId={projectId} />
      <MessageInput channelId={channelId || ''} projectId={projectId} />
    </ChatContainer>
  )
}
