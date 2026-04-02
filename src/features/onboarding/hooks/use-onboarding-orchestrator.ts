import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { deriveOnboardingStep, mapOnboardingError } from '../lib'
import { useOnboardingStatus } from './index'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('app:onboarding')

/**
 * useOnboardingOrchestrator — simplified orchestrator.
 *
 * After the useSafeUser DB guard, the only states are:
 *   - loading       : waiting for onboardingStatus query
 *   - needs_workspace: user has no workspace → UI prompts workspace creation
 *   - redirecting   : workspace exists → navigate to /workspace/:slug (or /home)
 *   - error         : query or redirect failure
 */
export function useOnboardingOrchestrator() {
  const navigate = useNavigate()
  const [internalError, setInternalError] = useState<unknown>(null)

  const { data, isLoading, error: queryError } = useOnboardingStatus()

  const status = data?.onboardingStatus
  const calculatedStep = deriveOnboardingStep(isLoading, queryError, status)
  const step = internalError ? 'error' : calculatedStep
  const finalError = internalError || queryError

  const reset = () => {
    setInternalError(null)
    window.location.reload()
  }

  useEffect(() => {
    if (step !== 'redirecting' || !status) return

    const orchestrate = async () => {
      try {
        const slug = status.workspaceSlug
        if (!slug) {
          // Workspace record exists but slug missing — fall back to /home
          await navigate({ to: '/home' as never })
          return
        }
        if (!status.hasProject) {
          await navigate({
            to: '/workspace/$workspaceSlug',
            params: { workspaceSlug: slug },
            search: { action: 'create-project' },
          })
        } else {
          await navigate({
            to: '/workspace/$workspaceSlug',
            params: { workspaceSlug: slug },
          })
        }
      } catch (e) {
        log.error('Redirect failed', e)
        setInternalError(mapOnboardingError(e))
      }
    }

    void orchestrate()
  }, [step, status, navigate])

  return { step, error: finalError, reset }
}
