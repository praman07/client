/**
 * Updates an issue label (name / color).
 * Server resolver: updateIssueLabel
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UPDATE_ISSUE_LABEL } from '../api/fragments'
import { mapLabelError } from '../lib/error-mapping'
import type { UpdateLabelVariables } from '../model/types'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueLabelKeys } from '@/entities/issue-label'

export function useUpdateLabel(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ labelId, name, color }: UpdateLabelVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(UPDATE_ISSUE_LABEL, {
        input: { labelId, name, color },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueLabelKeys.list(projectId),
      })
    },
    onError: (error) => {
      toast.error(mapLabelError(error))
    },
  })
}
