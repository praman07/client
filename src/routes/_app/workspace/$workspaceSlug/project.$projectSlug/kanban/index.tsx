import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { IssuesBoard } from '@/widgets/issues-board'
import { IssuesBoardSkeleton, PageSpinner, RouteError, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/kanban/',
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    issueId: typeof search.issueId === 'string' ? search.issueId : undefined,
  }),
  pendingComponent: IssuesBoardSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function RouteComponent() {
  const project = useAppSelector(selectCurrentProject)

  // Project is always loaded by the parent layout before this renders.
  // PageSpinner handles the rare edge case where Redux hasn't synced yet.
  if (!project) return <PageSpinner label="Loading project…" />

  const projectMembers = project.members.map((m) => ({
    id: m.userId,
    fullName: m.user.fullName ?? 'Unknown',
    avatarUrl: m.user.avatarUrl ?? undefined,
  }))

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <Suspense fallback={<IssuesBoardSkeleton />}>
        <div className="h-full overflow-hidden">
          <IssuesBoard
            projectId={project.id}
            projectKey={project.key}
            projectMembers={projectMembers}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
