import { createFileRoute } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { Comment01Icon } from '@hugeicons/core-free-icons'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat/',
)({
  component: ChatIndex,
})

function ChatIndex() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <HugeiconsIcon
          icon={Comment01Icon}
          className="h-10 w-10 text-muted-foreground/50"
        />
      </div>
      <h3 className="text-lg font-medium text-foreground">Welcome to Chat</h3>
      <p className="max-w-xs text-sm mt-2">
        Select a channel from the sidebar to start a conversation.
      </p>
    </div>
  )
}
