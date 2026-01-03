import { createFileRoute } from '@tanstack/react-router'

import { AuthSigninPage } from '@/pages/auth-signin'

export const Route = createFileRoute('/_auth/sign-in')({
  component: AuthSigninPage,
})
