import { createFileRoute } from '@tanstack/react-router'
import { PagesEditorPage } from '@/pages/pages'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId',
)({
  component: PagesEditorRoute,
})

/**
 * Page editor route — shown at /pages/:pageId.
 * Delegates to PagesEditorPage (Tiptap editor stub for now).
 */
function PagesEditorRoute() {
  const { pageId } = Route.useParams()
  return <PagesEditorPage key={pageId} pageId={pageId} />
}
