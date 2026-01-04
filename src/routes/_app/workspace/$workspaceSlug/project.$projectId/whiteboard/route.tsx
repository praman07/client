import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectId/whiteboard',
)({
  component: WhiteboardPage,
})

function WhiteboardPage() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
      <h2 className="text-2xl font-semibold text-foreground">Whiteboard</h2>
      <p>Infinite canvas for brainstorming and diagrams.</p>
    </div>
  )
}
