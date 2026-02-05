import { ChatHeader } from './chat-header'
import { MessageInput } from './message-input'
import { ChatContainer } from './components/chat-layout'
import { MessageList } from '@/widgets/chat-window/ui/message-list'
import { useChannelSubscription } from '@/features/chat/subscribe-channel'
import { useResequencerStatus } from '@/entities/chat-session'
import { SyncStatusIndicator } from '@/entities/chat-session/ui/SyncStatusIndicator'
import { MemberCacheProvider } from '../lib/member-cache-context'
import { useConversation } from '@/entities/conversation'

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
  console.log('[ChatWindow] Conversation data:', conversationData)
  console.log('[ChatWindow] Members count:', members?.length)
  console.log('[ChatWindow] Members:', members)


  // 1. Activate Subscription (Data Plane)
  useChannelSubscription(channelId || '', projectId)

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
