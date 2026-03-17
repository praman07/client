import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/pages/workspace'
import { RouteError, SettingsSkeleton  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/settings',
)({
  component: SettingsPage,
  pendingComponent: SettingsSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})
