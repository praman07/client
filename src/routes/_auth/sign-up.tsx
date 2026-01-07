import { createFileRoute } from '@tanstack/react-router'

import { AuthSignupPage } from '@/pages/sign-up'

export const Route = createFileRoute('/_auth/sign-up')({
  component: AuthSignupPage,
})
