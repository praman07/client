/**
 * Creates a new issue status (Kanban column).
 * Optimistic: dispatch(addStatus) before mutation.
 * Server resolver: createIssueStatus
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { CREATE_ISSUE_STATUS } from '../api/fragments'
import { mapStatusError } from '../lib/error-mapping'
import type { AppDispatch } from '@/app/store'
import type { CreateStatusVariables } from '../model/types'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueStatusKeys } from '@/entities/issue-status'
import { addStatus } from '@/entities/issue'

export function useCreateStatus() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({
      projectId,
      name,
      color,
      icon,
    }: CreateStatusVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(CREATE_ISSUE_STATUS, {
        input: { projectId, name, color, icon },
      })
    },
    onSuccess: (data, { projectId }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- GQL mutation result is nullable on auth/validation errors
      const status = data.createIssueStatus?.status
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- status can be null/undefined when createIssueStatus itself is null
      if (status != null) dispatch(addStatus(status as any))
      queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
    },
    onError: (error) => {
      toast.error(mapStatusError(error))
    },
  })
}
