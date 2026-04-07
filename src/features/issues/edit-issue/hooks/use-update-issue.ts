/**
 * Updates issue metadata (title, priority, assignee, labels, dueDate).
 * Does NOT handle status change (that is drag-issue) or description (use-description-upload).
 *
 * Optimistic: dispatch(updateIssue) before mutation.
 * On error: invalidate list to restore server state.
 *
 * Server resolver: updateIssue
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { UPDATE_ISSUE } from '../api/fragments'
import { mapUpdateIssueError } from '../lib/error-mapping'
import type { AppDispatch } from '@/app/store'
import type { UpdateIssueVariables } from '../model/types'
import type { UpdateIssueInput } from '@/gql/graphql'
import type { Issue } from '@/entities/issue'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys, updateIssue } from '@/entities/issue'
import { projectKeys } from '@/entities/project/api/query-keys'

/**
 * Converts a date-only string ("YYYY-MM-DD") to a full ISO datetime string
 * required by the graphql-scalars DateTime scalar.
 */
function toDateTime(
  date: string | null | undefined,
): string | null | undefined {
  if (!date) return date
  return date.length === 10 ? `${date}T00:00:00.000Z` : date
}

export function useUpdateIssue(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({
      issueId,
      title,
      priority,
      assigneeId,
      labelIds,
      dueDate,
    }: UpdateIssueVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(UPDATE_ISSUE, {
        input: {
          issueId,
          ...(title !== undefined && { title }),
          ...(priority !== undefined && { priority }),
          ...(assigneeId !== undefined && { assigneeId }),
          ...(labelIds !== undefined && { labelIds }),
          ...(dueDate !== undefined && { dueDate: toDateTime(dueDate) }),
        } as UpdateIssueInput,
      })
    },
    onMutate: ({ issueId, statusId: _statusId, ...patch }) => {
      // Strip undefined values to avoid overwriting valid Redux state with undefined.
      // statusId is excluded: the Issue entity uses `status` (object), not `statusId`.
      const cleanPatch = Object.fromEntries(
        Object.entries(patch).filter(([, v]) => v !== undefined),
      ) as Partial<Issue>
      dispatch(updateIssue({ id: issueId, patch: cleanPatch }))
    },
    onSuccess: (_, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) })
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.overview(projectId) })
    },
    onError: (error, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) })
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) })
      toast.error(mapUpdateIssueError(error))
    },
  })
}
