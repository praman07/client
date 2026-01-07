import { createFileRoute } from '@tanstack/react-router'

import { AuthSigninPage } from '@/pages/sign-in'

export const Route = createFileRoute('/_auth/sign-in')({
  component: AuthSigninPage,
})
