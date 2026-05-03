import type { OnboardingStatusResponse, OnboardingStep } from '../model/types'

/**
 * deriveOnboardingStep — simplified to 3 states.
 *
 * hasUser check removed: the useSafeUser DB guard ensures a User row
 * exists before /_app routes render, so hasUser will always be true here.
 */
export const deriveOnboardingStep = (
  isLoading: boolean,
  error: unknown,
  status: OnboardingStatusResponse['onboardingStatus'] | undefined,
): OnboardingStep => {
  if (error) return 'error'
  if (isLoading || !status) return 'loading'
  if (!status.hasWorkspace) return 'needs_workspace'
  return 'redirecting'
}
