import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Lock, MessageSquare } from 'lucide-react'
import type { Conversation } from '@/entities/conversation'
import { ChatWindow } from '@/widgets/chat-window'
import { RecoveryListener } from '@/entities/chat-session'
import { useConversation } from '@/entities/conversation'
import { ChannelSettingsModal } from '@/widgets/channel-settings-modal'
import { ChatSkeleton, ErrorStateCard, RouteError, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId',
)({
  component: ConversationPage,
  pendingComponent: ChatSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function ConversationPage() {
  const { conversationId } = Route.useParams()

  const { data: conversationData, isLoading } = useConversation(conversationId)

  const conversation = conversationData?.getConversation as
    | Conversation
    | undefined

  if (isLoading) {
    return <ChatSkeleton />
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <ErrorStateCard
          icon={MessageSquare}
          title="Conversation Not Found"
          description="This conversation doesn't exist or you don't have access to it."
        />
      </div>
    )
  }

  switch (conversation.type) {
    case 'CHANNEL':
      return (
        <ErrorBoundary FallbackComponent={WidgetError}>
          <Suspense fallback={<ChatSkeleton />}>
            <RecoveryListener />
            <ChatWindow
              channelId={conversation.id}
              projectId={conversation.projectId || ''}
              channelName={conversation.name || 'Unnamed Channel'}
              isPrivate={!conversation.isPublic}
              description={conversation.description ?? undefined}
            />
            <ChannelSettingsModal />
          </Suspense>
        </ErrorBoundary>
      )

    case 'DM':
    case 'GROUP_DM':
      return (
        <div className="h-full flex items-center justify-center p-8">
          <ErrorStateCard
            icon={Lock}
            title="Coming Soon"
            description={
              conversation.type === 'DM'
                ? 'Direct messages are not yet implemented.'
                : 'Group conversations are not yet implemented.'
            }
          />
        </div>
      )

    default:
      return (
        <div className="h-full flex items-center justify-center p-8">
          <ErrorStateCard
            icon={MessageSquare}
            title="Unknown Conversation Type"
            description="This conversation type is not supported."
          />
        </div>
      )
  }
}
