import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserBillingPage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/_user-layer/user/billing')({
  component: UserBillingPage,
  errorComponent: RouteError,
})
