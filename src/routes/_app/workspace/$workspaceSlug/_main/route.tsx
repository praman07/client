import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { WORKSPACE_TABS } from '@/shared/config/navigation'
import { NavTabs } from '@/widgets/navigation'
import { PageSpinner, RouteError } from '@/shared/ui'
import { CreateProjectModal } from '@/features/project/create-project'
import { InviteMemberDialog } from '@/features/invite-member'
import { CreateWorkspaceRoleDialog } from '@/features/workspace/manage-workspace-role'
import { useCurrentWorkspace } from '@/entities/workspace/hooks'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main')({
  component: WorkspaceMainLayout,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function WorkspaceMainLayout() {
  const currentWorkspace = useCurrentWorkspace()

  return (
    <>
      <NavTabs items={WORKSPACE_TABS as any} from={Route.fullPath} />
      <main className="flex-1 overflow-auto bg-surface-1">
        <div className="mx-auto max-w-7xl w-full p-6 lg:p-8">
          <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
            <RouteError error={error} reset={resetErrorBoundary} />
          )}>
            <Suspense fallback={<PageSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Workspace-scoped modal registry — portaled to <body>, zero visual impact */}
      <CreateProjectModal />
      <InviteMemberDialog />
      {currentWorkspace && (
        <CreateWorkspaceRoleDialog 
          workspaceId={currentWorkspace.id} 
          existingRoleNames={[]} // Handled internally by the form via useWorkspaceRoles
        />
      )}
    </>
  )
}
