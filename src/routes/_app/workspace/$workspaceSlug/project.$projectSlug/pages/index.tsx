import { createFileRoute } from '@tanstack/react-router'
import { PagesIndexPage } from '@/pages/pages'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/',
)({
  component: PagesIndexRoute,
})

/**
 * Pages index — shown when no page is selected.
 * Delegates to PagesIndexPage (empty state + create shortcut).
 */
function PagesIndexRoute() {
  return <PagesIndexPage />
}
