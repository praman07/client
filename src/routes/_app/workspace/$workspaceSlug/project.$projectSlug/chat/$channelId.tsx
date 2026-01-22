import { createFileRoute } from '@tanstack/react-router'
import { ChatWindow } from '@/widgets/chat-window'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/$channelId',
)({
  component: ChatChannelPage,
})

function ChatChannelPage() {
  return <ChatWindow />
}
