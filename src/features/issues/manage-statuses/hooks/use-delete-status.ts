/**
 * Deletes a status column.
 * Server resolver: deleteIssueStatus
 *
 * Note: Server enforces that isSystem=true columns cannot be deleted.
 * Server also enforces that non-empty columns cannot be deleted (409).
 * These cases are handled in the error mapper.
 *
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { DELETE_ISSUE_STATUS } from '../api/fragments'
import { mapStatusError } from '../lib/error-mapping'
import type { AppDispatch } from '@/app/store'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueStatusKeys } from '@/entities/issue-status'
import { removeStatus } from '@/entities/issue'

export function useDeleteStatus(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async (statusId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(DELETE_ISSUE_STATUS, {
        input: { statusId },
      })
    },
    onMutate: (statusId) => {
      dispatch(removeStatus(statusId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
    },
    onError: (error) => {
      queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
      toast.error(mapStatusError(error))
    },
  })
}
