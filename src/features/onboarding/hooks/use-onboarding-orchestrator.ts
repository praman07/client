import { useClerk } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { deriveOnboardingStep } from '../lib/onboarding-machine'
import { mapOnboardingError } from '../lib/error-mapping'
import {
  useCreateOnboardingWorkspace,
  useOnboardingStatus,
  useSyncUser,
} from './index'
import { generateIdempotencyKey } from '@/shared/lib/idempotency'

export function useOnboardingOrchestrator() {
  const { user } = useClerk()
  const navigate = useNavigate()

  // Stable Idempotency Key
  const [creationKey] = useState(() => generateIdempotencyKey())
  const [internalError, setInternalError] = useState<unknown>(null)

  // 1. Data Layer
  const { data, isLoading, error: queryError } = useOnboardingStatus()
  const { mutateAsync: syncUser } = useSyncUser()
  const { mutateAsync: createWorkspace } = useCreateOnboardingWorkspace()

  // 2. Logic Layer (Derived State)
  const status = data?.onboardingStatus
  const calculatedStep = deriveOnboardingStep(isLoading, queryError, status)

  // Override: If we caught a mutation error, force error state
  const step = internalError ? 'error' : calculatedStep
  const finalError = internalError || queryError

  const reset = () => {
    setInternalError(null)
    window.location.reload() // Or we could just invalidate queries, but for "Death Screen" reload is safer
  }

  // 3. Side Effects Layer (The Orchestrator)
  useEffect(() => {
    // If not ready or error, do nothing
    if (!user || !status) return

    const orchestrate = async () => {
      switch (step) {
        case 'loading':
        case 'error':
          // Do nothing
          break

        case 'syncing': {
          const email = user.primaryEmailAddress?.emailAddress
          if (!email) return
          try {
            await syncUser({
              clerkId: user.id,
              email: email,
              fullName: user.fullName || '',
              avatarUrl: user.imageUrl,
            })
          } catch (e) {
            console.error('Sync failed', e)
            setInternalError(mapOnboardingError(e))
          }
          break
        }

        case 'creating_workspace': {
          try {
            await createWorkspace({ idempotencyKey: creationKey })
          } catch (e) {
            console.error('Workspace creation failed', e)
            setInternalError(mapOnboardingError(e))
          }
          break
        }

        case 'redirecting': {
          const slug = status.workspaceSlug
          if (!status.hasProject) {
            navigate({
              to: '/workspace/$workspaceSlug',
              params: { workspaceSlug: slug || '' },
              search: { action: 'create-project' },
            })
          } else {
            navigate({
              to: '/workspace/$workspaceSlug',
              params: { workspaceSlug: slug || '' },
            })
          }
          break
        }
      }
    }

    orchestrate()
  }, [step, user, status, syncUser, createWorkspace, navigate, creationKey])

  return { step, error: finalError, reset }
}
