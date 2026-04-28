import { createFileRoute } from '@tanstack/react-router'
import { PagesIndexPage } from '@/pages/pages'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/',
)({
  component: PagesIndexRoute,
})

/**
 * Pages index — shown when no page is selected.
 * Reads route params here (route boundary) and passes them to the page.
 */
function PagesIndexRoute() {
  const { workspaceSlug, projectSlug } = Route.useParams()
  return <PagesIndexPage workspaceSlug={workspaceSlug} projectSlug={projectSlug} />
}
