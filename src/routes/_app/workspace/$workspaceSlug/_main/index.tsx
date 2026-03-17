import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/workspace'
import { PageSpinner, RouteError  } from '@/shared/ui'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/')({
  component: DashboardPage,
  pendingComponent: PageSpinner,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})
