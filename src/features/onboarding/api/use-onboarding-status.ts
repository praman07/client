import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useClerk, useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  ONBOARDING_STATUS_QUERY,
  SYNC_USER_MUTATION,
  CREATE_ONBOARDING_WORKSPACE_MUTATION,
} from '@/features/onboarding/api/documents'

import { authenticatedGraphQLRequest } from '@/shared/api/graphql-client'

// ... (imports remain)

// The Orchestrator Hook
export function useOnboardingOrchestrator() {
  const { user } = useClerk()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [step, setStep] = useState<
    'loading' | 'syncing' | 'creating_workspace' | 'redirecting' | 'error'
  >('loading')

  // Helper wrapper to get token and call shared client
  const performRequest = async <T>(document: any, variables?: any) => {
    const token = await getToken()
    return authenticatedGraphQLRequest<T>(document, token, variables)
  }

  // 1. Fetch Composite Status
  const {
    data: statusData,
    isLoading: isStatusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: () => performRequest(ONBOARDING_STATUS_QUERY),
    // Only run if we have a user loaded in Clerk client
    enabled: !!user,
    // ...

    refetchInterval: (query) => {
      // Build-in polling if we are waiting for webhook
      const data = query.state.data
      // @ts-ignore - Generated types might be tricky with raw request return
      if (data && !data.onboardingStatus.hasUser) return 1000
      return false
    },
    retry: true,
  })

  // Mutations
  const { mutateAsync: syncUser } = useMutation({
    mutationFn: (variables: {
      clerkId: string
      email: string
      fullName?: string
      avatarUrl?: string
    }) => performRequest(SYNC_USER_MUTATION, variables),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] }),
  })

  const { mutateAsync: createWorkspace } = useMutation({
    mutationFn: () => performRequest(CREATE_ONBOARDING_WORKSPACE_MUTATION),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] }),
  })

  // State Machine Effect
  useEffect(() => {
    if (isStatusLoading || !user) return
    if (statusError) {
      setStep('error')
      return
    }

    // @ts-ignore
    const status = statusData?.onboardingStatus
    if (!status) return

    const orchestrate = async () => {
      // Step 1: Ensure User (Fallback Sync)
      // Note: If polling is active, we might wait. BUT if we want to force sync:
      if (!status.hasUser) {
        setStep('syncing')
        const email = user.primaryEmailAddress?.emailAddress
        if (!email) return // Should not happen for authenticated user

        try {
          await syncUser({
            clerkId: user.id,
            email: email,
            fullName: user.fullName || '',
            avatarUrl: user.imageUrl,
          })
          // After sync, query invalidate will trigger re-run
        } catch (e) {
          console.error('Sync failed', e)
          // If sync failed (e.g. race condition), the next poll might succeed
        }
        return
      }

      // Step 2: Ensure Workspace
      if (!status.hasWorkspace) {
        setStep('creating_workspace')
        try {
          await createWorkspace()
        } catch (e) {
          console.error('Workspace creation failed', e)
        }
        return
      }

      // Step 3: Routing
      setStep('redirecting')
      const slug = status.workspaceSlug

      if (!status.hasProject) {
        // Go to workspace with modal trigger
        navigate({
          to: '/workspace/$workspaceSlug',
          params: { workspaceSlug: slug! },
          search: { action: 'create-project' },
        })
      } else {
        // Go to first project (or dashboard)
        navigate({
          to: '/workspace/$workspaceSlug',
          params: { workspaceSlug: slug! },
        })
      }
    }

    orchestrate()
  }, [
    user,
    statusData,
    isStatusLoading,
    statusError,
    navigate,
    syncUser,
    createWorkspace,
  ])

  return { step, error: statusError }
}
