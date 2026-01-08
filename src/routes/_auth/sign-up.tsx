import { createFileRoute } from '@tanstack/react-router'

import { AuthSignupPage } from '@/widgets/auth/sign-up-page'

export const Route = createFileRoute('/_auth/sign-up')({
  component: AuthSignupPage,
})
