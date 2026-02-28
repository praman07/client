import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import { CREATE_PAGE } from '../api/fragments'
import type { CreatePageFormData } from '../model'

export interface CreatePageVariables extends CreatePageFormData {
  workspaceId: string
  projectId: string
  /** null = root-level page; string cuid = sub-page under this parent */
  parentId?: string | null
  /** Fractional index position — pre-computed by caller */
  position: number
  /** Optional list of user IDs to add as collaborators at creation time */
  collaboratorIds?: string[]
}

/**
 * Mutation hook for creating a page.
 * Invalidates projectPages query on success so the sidebar tree updates.
 *
 * @layer Features
 */
export function useCreatePage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: CreatePageVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(CREATE_PAGE, {
        input: {
          workspaceId: variables.workspaceId,
          projectId: variables.projectId,
          parentId: variables.parentId ?? null,
          title: variables.title,
          icon: variables.icon,
          position: variables.position,
          collaboratorIds: variables.collaboratorIds ?? [],
        },
      })
    },
    onSuccess: (_, variables) => {
      // Targeted invalidation — only the project page tree
      queryClient.invalidateQueries({
        queryKey: pageKeys.projectPages(variables.projectId),
      })
    },
  })
}
