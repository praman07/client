import { createFileRoute } from '@tanstack/react-router'

import { RouteError } from '@/shared/ui'

import { OnboardingPage } from '@/pages/onboarding'

export const Route = createFileRoute('/_app/onboarding')({
  component: OnboardingPage,
  errorComponent: RouteError,
})
