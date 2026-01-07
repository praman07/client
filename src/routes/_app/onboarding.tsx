import { createFileRoute } from '@tanstack/react-router'
import { useOnboardingOrchestrator } from '@/features/onboarding/api/use-onboarding-status'
import { OnboardingWizard } from '@/widgets/onboarding/onboarding-wizard'
import { RouteError } from '@/shared/ui/error/route-error'

export const Route = createFileRoute('/_app/onboarding')({
  component: OnboardingPage,
  errorComponent: RouteError,
  // Note: Data loading is handled via client-side hook (FE-02 Exception)
  // due to dependency on Clerk auth readiness and client-side orchestration.
})

function OnboardingPage() {
  const { step, error, reset } = useOnboardingOrchestrator()

  if (error) {
    return <RouteError error={error} reset={reset} />
  }

  return <OnboardingWizard step={step} />
}
