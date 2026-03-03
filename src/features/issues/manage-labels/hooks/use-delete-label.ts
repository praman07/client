/**
 * Deletes an issue label.
 * Server resolver: deleteIssueLabel
 *
 * Note: Deleting a label removes it from all issues in the project.
 * The confirmation UI is in label-list-row.tsx.
 *
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueLabelKeys } from '@/entities/issue-label'
import { issueKeys } from '@/entities/issue'
import { DELETE_ISSUE_LABEL } from '../api/fragments'
import { mapLabelError } from '../lib/error-mapping'

export function useDeleteLabel(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (labelId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(DELETE_ISSUE_LABEL, {
        input: { labelId },
      })
    },
    onSuccess: () => {
      // Refresh labels list and all issues (label removed from issue cards)
      queryClient.invalidateQueries({
        queryKey: issueLabelKeys.list(projectId),
      })
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) })
    },
    onError: (error) => {
      toast.error(mapLabelError(error))
    },
  })
}
