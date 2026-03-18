/**
 * Reorders a status column via fractional position.
 * Optimistic: dispatch(reorderStatus) before mutation.
 * Server resolver: reorderIssueStatus
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { REORDER_ISSUE_STATUS } from '../api/fragments'
import type { AppDispatch } from '@/app/store'
import type { ReorderStatusVariables } from '../model/types'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueStatusKeys } from '@/entities/issue-status'
import { reorderStatus } from '@/entities/issue'

export function useReorderStatus(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({ statusId, newPosition }: ReorderStatusVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(REORDER_ISSUE_STATUS, {
        input: { statusId, newPosition },
      })
    },
    onMutate: ({ statusId, newPosition }) => {
      dispatch(reorderStatus({ id: statusId, newPosition }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
      toast.error('Failed to reorder column. Please try again.')
    },
  })
}
