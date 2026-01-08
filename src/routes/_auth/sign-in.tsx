import { createFileRoute } from '@tanstack/react-router'

import { AuthSigninPage } from '@/widgets/auth/sign-in-page'

export const Route = createFileRoute('/_auth/sign-in')({
  component: AuthSigninPage,
})
