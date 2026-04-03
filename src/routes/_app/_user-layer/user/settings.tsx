import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserSettingsPage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/_user-layer/user/settings')({
  component: UserSettingsPage,
  errorComponent: RouteError,
})
