import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { Conversation } from '@/entities/conversation'
import { ChatWindow } from '@/widgets/chat-window'
import { RecoveryListener } from '@/entities/chat-session/ui'
import { useUserConversations } from '@/entities/conversation'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/$channelId',
)({
  component: ChatChannelPage,
})

function ChatChannelPage() {
  const { channelId } = Route.useParams()

  // Fetch all conversations for validation
  const { data: conversationsData, isLoading } = useUserConversations()

  // Find and validate the conversation
  const conversation = useMemo(() => {
    if (!conversationsData?.getUserConversations?.edges) return null

    const edges = conversationsData.getUserConversations
      .edges as Array<Conversation>

    // Find conversation by ID and ensure it's a channel
    const found = edges.find((c) => c.id === channelId && c.type === 'CHANNEL')

    return found || null
  }, [conversationsData, channelId])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading channel...
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <h2 className="text-xl font-bold">Channel Not Found</h2>
        <p className="text-muted-foreground">
          You don't have access to this channel or it doesn't exist.
        </p>
      </div>
    )
  }

  return (
    <>
      <RecoveryListener />
      <ChatWindow
        channelId={conversation.id}
        projectId={conversation.projectId || ''}
        channelName={conversation.name || 'Unnamed Channel'}
        isPrivate={!conversation.isPublic}
        description={conversation.description ?? undefined}
      />
    </>
  )
}
