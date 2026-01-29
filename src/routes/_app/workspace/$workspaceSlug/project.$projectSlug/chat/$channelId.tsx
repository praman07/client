import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ChatWindow } from '@/widgets/chat-window'
import { RecoveryListener } from '@/entities/chat-session/ui'
import { CHANNEL_FIELDS_FRAGMENT, useChannels } from '@/entities/channel'
import { useFragment } from '@/gql'
import { ConversationType } from '@/gql/graphql'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/$channelId',
)({
  component: ChatChannelPage,
})

function ChatChannelPage() {
  const { channelId } = Route.useParams()
  const { data: channels, isLoading } = useChannels()

  // Validation Logic (Client-Side)
  // We check if the requested channelId exists in the user's visible channels
  const validChannel = useMemo(() => {
    if (!channels) return null
    return channels.getUserChannels.find((c: any) => c.id === channelId)
  }, [channels, channelId])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading channel...
      </div>
    )
  }

  if (!validChannel) {
    // Falls back to project home or shows 404
    // For now, simple textual 404
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <h2 className="text-xl font-bold">Channel Not Found</h2>
        <p className="text-muted-foreground">
          You typically see this if you lack access or the ID is incorrect.
        </p>
      </div>
    )
  }

  const channelData = useFragment(CHANNEL_FIELDS_FRAGMENT, validChannel)

  return (
    <>
      <RecoveryListener />
      <ChatWindow
        channelId={channelData.id}
        projectId={channelData.projectId || ''}
        channelName={channelData.name || 'Unknown Channel'}
        isPrivate={channelData.type === ConversationType.Channel}
        description={channelData.topic || undefined}
      />
    </>
  )
}
