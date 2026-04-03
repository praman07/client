import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserProfilePage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/_user-layer/user/profile')({
  component: UserProfilePage,
  errorComponent: RouteError,
})
