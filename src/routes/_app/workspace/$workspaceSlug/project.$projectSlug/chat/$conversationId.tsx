import { createFileRoute } from '@tanstack/react-router'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { MessageSquare } from 'lucide-react'
import type { Conversation } from '@/entities/conversation'
import type { ConversationMemberFieldsFragment } from '@/gql/graphql'
import { ChatWindow } from '@/widgets/chat-window'
import { RecoveryListener } from '@/entities/chat-session'
import { useConversation } from '@/entities/conversation'
import { ChannelSettingsModal } from '@/widgets/channel-settings-modal'
import { ChatSkeleton, ErrorStateCard, RouteError, WidgetError  } from '@/shared/ui'
import { useAuth } from '@/shared/hooks'

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
  const { userId: currentUserId } = useAuth()

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

  let content: React.ReactNode

  switch (conversation.type) {
    case 'CHANNEL':
      content = (
        <ErrorBoundary FallbackComponent={WidgetError}>
          <Suspense fallback={<ChatSkeleton />}>
            <RecoveryListener />
            <ChatWindow
              channelId={conversation.id}
              projectId={conversation.projectId || ''}
              workspaceId={conversation.workspaceId}
              channelName={conversation.name || 'Unnamed Channel'}
              isPrivate={!conversation.isPublic}
              topic={conversation.topic ?? undefined}
            />
          </Suspense>
        </ErrorBoundary>
      )
      break

    case 'DM':
    case 'GROUP_DM': {
      const otherMember = (conversation.members ?? [])
        .map((m) => m as unknown as ConversationMemberFieldsFragment)
        .find((m) => m.userId !== currentUserId)
      content = (
        <ErrorBoundary FallbackComponent={WidgetError}>
          <Suspense fallback={<ChatSkeleton />}>
            <RecoveryListener />
            <ChatWindow
              channelId={conversation.id}
              projectId={conversation.projectId || ''}
              workspaceId={conversation.workspaceId}
              channelName={conversation.name || 'Direct Message'}
              isPrivate={true}
              isDm={true}
              otherUser={{
                fullName: otherMember?.user?.fullName ?? null,
                avatarUrl: otherMember?.user?.avatarUrl ?? null,
              }}
            />
          </Suspense>
        </ErrorBoundary>
      )
      break
    }

    default:
      content = (
        <div className="h-full flex items-center justify-center p-8">
          <ErrorStateCard
            icon={MessageSquare}
            title="Unknown Conversation Type"
            description="This conversation type is not supported."
          />
        </div>
      )
  }

  return (
    <>
      {content}
      <ChannelSettingsModal />
    </>
  )
}
