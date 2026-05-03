import { createFileRoute } from '@tanstack/react-router'
import { MembersPage } from '@/pages/workspace'
import { MembersPageSkeleton, RouteError } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/members',
)({
  component: MembersPage,
  pendingComponent: MembersPageSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})
