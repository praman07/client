import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { VaultPage } from '@/pages/vault'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'
import { PageSpinner, RouteError, VaultSkeleton, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/vault/',
)({
  component: VaultIndexRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    folderId: typeof search.folderId === 'string' ? search.folderId : undefined,
  }),
  pendingComponent: VaultSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function VaultIndexRoute() {
  const { workspaceSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  if (!workspace?.id || !project?.id) {
    return <PageSpinner label="Loading workspace…" />
  }

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <Suspense fallback={<VaultSkeleton />}>
        <VaultPage workspaceId={workspace.id} projectId={project.id} />
      </Suspense>
    </ErrorBoundary>
  )
}
