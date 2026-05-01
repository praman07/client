import { createFileRoute, redirect } from '@tanstack/react-router'
import { PageSpinner, RouteError } from '@/shared/ui'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/workspace/$workspaceSlug/projects',
      params,
    })
  },
  pendingComponent: PageSpinner,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})
