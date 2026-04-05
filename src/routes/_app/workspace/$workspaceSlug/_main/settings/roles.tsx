import { createFileRoute } from '@tanstack/react-router'
import { RolesSettingsPage } from '@/pages/workspace'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/settings/roles'
)({
  component: RolesSettingsPage,
})
