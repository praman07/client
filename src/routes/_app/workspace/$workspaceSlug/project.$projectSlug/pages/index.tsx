import { createFileRoute } from '@tanstack/react-router'
import { PagesIndexPage } from '@/pages/pages'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { PageSpinner } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/',
)({
  component: PagesIndexRoute,
  pendingComponent: PageSpinner,
})

/**
 * Pages index — shown when no page is selected.
 * Reads route params and project/workspace IDs from Redux.
 */
function PagesIndexRoute() {
  const { workspaceSlug, projectSlug } = Route.useParams()
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector((state) => selectWorkspaceBySlug(state, workspaceSlug))

  // Wait until both project and workspace are loaded
  if (!project?.id || !workspace?.id) {
    return <PageSpinner label="Loading pages..." />
  }

  return (
    <PagesIndexPage
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
      workspaceId={workspace.id}
      projectId={project.id}
    />
  )
}
