import { createFileRoute } from '@tanstack/react-router'
import { MessageSquare } from 'lucide-react'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/',
)({
  component: ChatIndex,
})

function ChatIndex() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-tertiary p-4 text-center">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <MessageSquare className="h-10 w-10 text-tertiary/50" />
      </div>
      <h3 className="text-18 font-medium text-primary">Welcome to Chat</h3>
      <p className="max-w-xs text-14 mt-2">
        Select a channel from the sidebar to start a conversation.
      </p>
    </div>
  )
}
