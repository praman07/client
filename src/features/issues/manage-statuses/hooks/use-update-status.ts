/**
 * Updates an issue status (name / color / icon).
 * Optimistic: dispatch(updateStatus) before mutation.
 * Server resolver: updateIssueStatus
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { UPDATE_ISSUE_STATUS } from '../api/fragments'
import { mapStatusError } from '../lib/error-mapping'
import type { AppDispatch } from '@/app/store'
import type { UpdateStatusVariables } from '../model/types'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueStatusKeys } from '@/entities/issue-status'
import { updateStatus } from '@/entities/issue'

export function useUpdateStatus(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({
      statusId,
      name,
      color,
      icon,
    }: UpdateStatusVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(UPDATE_ISSUE_STATUS, {
        input: { statusId, name, color, icon },
      })
    },
    onMutate: ({ statusId, ...patch }) => {
      dispatch(updateStatus({ id: statusId, patch }))
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
