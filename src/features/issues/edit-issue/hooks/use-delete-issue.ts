/**
 * Deletes an issue.
 * Optimistic: dispatch(removeIssue) before mutation.
 * On error: invalidate list to restore server state.
 *
 * Server resolver: deleteIssue
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { DELETE_ISSUE } from '../api/fragments'
import { mapUpdateIssueError } from '../lib/error-mapping'
import type { AppDispatch } from '@/app/store'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys, removeIssue } from '@/entities/issue'

export function useDeleteIssue(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async (issueId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(DELETE_ISSUE, {
        input: { issueId },
      })
    },
    onMutate: (issueId) => {
      dispatch(removeIssue(issueId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) })
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) })
      toast.error(mapUpdateIssueError(error))
    },
  })
}
