import { ChatHeader } from './chat-header'
import { MessageList } from '@/widgets/message-list'
import { MessageInput } from './message-input'
import { useChannelSubscription } from '@/features/subscribe-channel'
import { useResequencerStatus } from '@/entities/chat-session/hooks/use-resequencer-status'
import { SyncStatusIndicator } from '@/entities/chat-session/ui/SyncStatusIndicator'

import { Chat } from '@/shared/ui/primitives/chat-layout'

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
    <Chat>
      <ChatHeader
        channelName={channelName}
        isPrivate={isPrivate}
        description={
          description || 'Topic: General discussion about the project'
        }
      >
        {/* Sync Status Indicator */}
        <SyncStatusIndicator status={status} />
      </ChatHeader>
      <MessageList channelId={channelId || ''} projectId={projectId} />
      <MessageInput channelId={channelId || ''} projectId={projectId} />
    </Chat>
  )
}
