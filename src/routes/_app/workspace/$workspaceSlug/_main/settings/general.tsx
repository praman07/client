import { createFileRoute } from '@tanstack/react-router'
import { GeneralSettingsPage } from '@/pages/workspace'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/settings/general'
)({
  component: GeneralSettingsPage,
})
