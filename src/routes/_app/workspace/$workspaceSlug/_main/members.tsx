import { createFileRoute } from '@tanstack/react-router'
import { MembersPage } from '@/pages/workspace'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/members',
)({
  component: MembersPage,
})
