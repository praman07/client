import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserWorkspacesPage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/user/workspaces')({
  component: UserWorkspacesPage,
  errorComponent: RouteError,
})
