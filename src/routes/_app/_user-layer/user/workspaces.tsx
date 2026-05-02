import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserWorkspacesPage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/_user-layer/user/workspaces')({
  component: () => (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-screen-2xl w-full px-(--padding-page) py-6 md:py-8">
        <UserWorkspacesPage />
      </div>
    </main>
  ),
  errorComponent: RouteError,
})
