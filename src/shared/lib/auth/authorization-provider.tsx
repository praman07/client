/**
 * authorization-provider.tsx
 *
 * Fetches the user's full authorization context (role, permissions, feature flags)
 * for the current workspace/project scope via the `activeContext` GraphQL query.
 *
 * Design:
 *  - React Context (not Redux) — derived server state, not app state
 *  - Disabled when workspaceId is null (home, onboarding routes)
 *  - staleTime matches server Redis TTL (5 min) to avoid redundant refetches
 *  - WS push invalidation via registerHandler for near-instant propagation
 */
import React, {
  createContext,
  useContext,
  useMemo,
} from 'react'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { ACTIVE_CONTEXT_QUERY } from './active-context.query'
import { authContextKeys } from './query-keys'
import {
  AUTH_SCOPE_CONTEXT_DEFAULT
  
} from './auth-context'
import type {AuthScopeContext} from './auth-context';
import { GqlClient } from '@/shared/api'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'

export const AuthorizationContext = createContext<AuthScopeContext>(
  AUTH_SCOPE_CONTEXT_DEFAULT,
)

const FIVE_MINUTES = 5 * 60 * 1000

export function AuthorizationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { getToken, isSignedIn } = useAuth()

  // Resolve scope from Redux — already synced by workspace/project route hierarchy
  const workspace = useAppSelector(selectCurrentWorkspace)
  const project = useAppSelector(selectCurrentProject)

  const workspaceId = workspace?.id ?? null
  const projectId = project?.id ?? undefined

  const queryKey = workspaceId
    ? authContextKeys.scope(workspaceId, projectId)
    : authContextKeys.all

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!workspaceId) return null
      const token = await getToken()
      if (!token) throw new Error('No auth token')
      const client = GqlClient(token)
      const res = await client.request(ACTIVE_CONTEXT_QUERY, {
        workspaceId,
        projectId: projectId ?? null,
      })
      return res.activeContext
    },
    enabled: !!isSignedIn && !!workspaceId,
    staleTime: FIVE_MINUTES,
    retry: false,
  })


  // Map featureFlags array → Record<string, boolean> for O(1) lookups in hooks
  const featureFlags = useMemo(() => {
    if (!data?.featureFlags) return {}
    return Object.fromEntries(
      data.featureFlags.map((f: { key: string; enabled: boolean }) => [f.key, f.enabled]),
    )
  }, [data])


  const value = useMemo<AuthScopeContext>(
    () => ({
      isLoading: !!workspaceId && isLoading,
      workspaceId,
      projectId: projectId ?? null,
      workspaceRole: data?.workspaceRole ?? null,
      projectRole: data?.projectRole ?? null,
      grantedPermissions: data?.grantedPermissions ?? [],
      featureFlags,
    }),
    [
      workspaceId,
      projectId,
      isLoading,
      data?.workspaceRole,
      data?.projectRole,
      data?.grantedPermissions,
      featureFlags,
    ],
  )

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}

/** Internal hook — consume via usePermission / useFeatureFlag, not directly. */
export function useAuthorizationContext() {
  return useContext(AuthorizationContext)
}
