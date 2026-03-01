import { createFileRoute } from '@tanstack/react-router'
import { VaultPage } from '@/pages/vault'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace/model/selectors'
import { selectCurrentProject } from '@/entities/project/model/selectors'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/vault/',
)({
  component: VaultIndexRoute,
})

/**
 * Vault Index Route
 *
 * Reads workspaceId + projectId from Redux (synced by parent layout)
 * and renders the full VaultPage.
 */
function VaultIndexRoute() {
  const { workspaceSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  if (!workspace?.id || !project?.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return <VaultPage workspaceId={workspace.id} projectId={project.id} />
}
