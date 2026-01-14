import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/pages/workspace'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/settings',
)({
  component: SettingsPage,
})
