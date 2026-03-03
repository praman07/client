/**
 * Creates a new issue label.
 * Server resolver: createIssueLabel
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueLabelKeys } from '@/entities/issue-label'
import { CREATE_ISSUE_LABEL } from '../api/fragments'
import { mapLabelError } from '../lib/error-mapping'
import type { CreateLabelVariables } from '../model/types'

export function useCreateLabel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, name, color }: CreateLabelVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(CREATE_ISSUE_LABEL, {
        input: { projectId, name, color },
      })
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: issueLabelKeys.list(projectId),
      })
    },
    onError: (error) => {
      toast.error(mapLabelError(error))
    },
  })
}
