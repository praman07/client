import { createFileRoute } from '@tanstack/react-router'
import type { Conversation } from '@/entities/conversation'
import { ChatWindow } from '@/widgets/chat-window'
import { RecoveryListener } from '@/entities/chat-session/ui'
import { useConversation } from '@/entities/conversation'
import { ChannelSettingsModal } from '@/widgets/channel-settings-modal'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId',
)({
  component: ConversationPage,
})

function ConversationPage() {
  const { conversationId } = Route.useParams()

  // Fetch the specific conversation by ID (works for any type)
  const { data: conversationData, isLoading } = useConversation(conversationId)

  // TypeScript requires assertion to unwrap GraphQL fragment refs
  const conversation = conversationData?.getConversation as
    | Conversation
    | undefined

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading conversation...
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <h2 className="text-xl font-bold">Conversation Not Found</h2>
        <p className="text-muted-foreground">
          You don't have access to this conversation or it doesn't exist.
        </p>
      </div>
    )
  }

  // Route based on conversation type
  switch (conversation.type) {
    case 'CHANNEL':
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
          <ChannelSettingsModal />
        </>
      )

    case 'DM':
    case 'GROUP_DM':
      // TODO: Implement DM/Group UI
      return (
        <div className="h-full flex items-center justify-center flex-col gap-2">
          <h2 className="text-xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground">
            {conversation.type === 'DM'
              ? 'Direct messages'
              : 'Group conversations'}{' '}
            are not yet implemented.
          </p>
        </div>
      )

    default:
      return (
        <div className="h-full flex items-center justify-center flex-col gap-2">
          <h2 className="text-xl font-bold">Unknown Conversation Type</h2>
          <p className="text-muted-foreground">
            This conversation type is not supported.
          </p>
        </div>
      )
  }
}
