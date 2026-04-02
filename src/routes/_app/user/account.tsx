import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserAccountPage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/user/account')({
  component: UserAccountPage,
  errorComponent: RouteError,
})
