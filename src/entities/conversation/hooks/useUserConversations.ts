import { useQuery } from '@tanstack/react-query'
import { GET_USER_CONVERSATIONS, conversationKeys } from '../api'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  ConversationType,
  GetUserConversationsQuery,
  GetUserConversationsQueryVariables,
} from '@/gql/graphql'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { selectCurrentWorkspaceId } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'

export function useUserConversations(
  params?: {
    workspaceId?: string
    projectId?: string
    type?: ConversationType
    includeArchived?: boolean
    limit?: number
    cursor?: string
  },
  options?: Omit<
    UseQueryOptions<GetUserConversationsQuery>,
    'queryKey' | 'queryFn'
  >,
) {
  const { getToken } = useAuth()

  // Use Redux state as default, allow override via params
  const defaultWorkspaceId = useAppSelector(selectCurrentWorkspaceId)
  const defaultProject = useAppSelector(selectCurrentProject)
  const defaultProjectId = defaultProject?.id

  const workspaceId = params?.workspaceId || defaultWorkspaceId
  const projectId = params?.projectId || defaultProjectId
  const type = params?.type
  const includeArchived = params?.includeArchived

  // Generate query key based on type filter AND includeArchived flag
  // This ensures active and archived queries don't collide
  let queryKey: ReadonlyArray<unknown>

  if (type) {
    queryKey = includeArchived
      ? [
          ...conversationKeys.byType(workspaceId || '', projectId || '', type),
          'archived',
        ]
      : conversationKeys.byType(workspaceId || '', projectId || '', type)
  } else {
    queryKey = includeArchived
      ? [
          ...conversationKeys.all(workspaceId || '', projectId || ''),
          'archived',
        ]
      : conversationKeys.all(workspaceId || '', projectId || '')
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!workspaceId) throw new Error('No workspace selected')
      if (!projectId) throw new Error('No project selected')

      const token = await getToken()
      const client = GqlClient(token)

      // Build variables - only include optional params if provided
      // Backend Zod schema rejects null for optional fields
      const variables: GetUserConversationsQueryVariables = {
        workspaceId,
        projectId,
      }

      // Only add optional params if they have values
      if (params?.type !== undefined) {
        variables.type = params.type
      }
      if (params?.includeArchived !== undefined) {
        variables.includeArchived = params.includeArchived
      }
      if (params?.limit !== undefined) {
        variables.limit = params.limit
      }
      if (params?.cursor !== undefined) {
        variables.cursor = params.cursor
      }

      return client.request(GET_USER_CONVERSATIONS, variables)
    },
    enabled: !!workspaceId && !!projectId,
    ...options,
  })
}
