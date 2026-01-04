import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectId/pages/$pageId',
)({
  component: DocsPage,
})

function DocsPage() {
  const { pageId } = Route.useParams()
  return <div>Wiki Page: {pageId}</div>
}
