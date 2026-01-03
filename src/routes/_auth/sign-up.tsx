import { createFileRoute } from '@tanstack/react-router'

import { AuthSignupPage } from '@/pages/auth-signup'

export const Route = createFileRoute('/_auth/sign-up')({
  component: AuthSignupPage,
})
