import { MemberCacheProvider } from '../lib/member-cache-context'
import { ChatHeader } from './chat-header'
import { MessageInput } from './message-input'
import { ChatContainer } from './components/chat-layout'
import { MessageList } from './message-list'
import { useConversationSubscription } from '@/features/chat/subscribe-conversation'
import { SyncStatusIndicator, useResequencerStatus  } from '@/entities/chat-session'
import { useConversation } from '@/entities/conversation'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:window')

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
  // 0. Fetch conversation with members for cache
  const { data: conversationData } = useConversation(channelId, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  // Extract members array (undefined if not loaded yet, filter out nulls and unwrap fragment refs)
  const members = conversationData?.getConversation?.members
    ? (conversationData.getConversation.members.filter(
        (m): m is NonNullable<typeof m> => m != null,
      ) as unknown as Array<{
        userId: string
        role: string
        isMuted: boolean
        joinedAt: string
        user: {
          id: string
          fullName: string
          email: string
          avatarUrl?: string | null
        }
      }>)
    : undefined

  // DEBUG: Log member data
  log.debug('Conversation data:', conversationData)
  log.debug('Members count:', members?.length)
  log.debug('Members:', members)

  // 1. Activate Subscription (Data Plane)
  useConversationSubscription(channelId || '', projectId, 'CHANNEL')

  // 2. Monitoring (Control Plane)
  const status = useResequencerStatus(channelId || '')

  return (
    <MemberCacheProvider members={members}>
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
    </MemberCacheProvider>
  )
}
