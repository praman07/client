/**
 * Creates a new issue in the project.
 *
 * Optimistic update: dispatches addIssue to the Redux store immediately.
 * On success: invalidates issueKeys.list to sync any server-generated fields.
 * On error: dispatches removeIssue to revert.
 *
 * Server resolver: createIssue
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { CREATE_ISSUE } from '../api/fragments'
import type { AppDispatch } from '@/app/store'
import type { CreateIssueVariables } from '../model/types'
import type { CreateIssueInput } from '@/gql/graphql'
import type { Issue } from '@/entities/issue'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { addIssue, issueKeys } from '@/entities/issue'
import { projectKeys } from '@/entities/project/api/query-keys'

/**
 * Converts a date-only string ("YYYY-MM-DD") to a full ISO datetime string
 * required by the graphql-scalars DateTime scalar.
 * If already a full ISO string, returns as-is. If null/undefined, returns as-is.
 */
function toDateTime(
  date: string | null | undefined,
): string | null | undefined {
  if (!date) return date
  // Only append time if it's a bare date (10 chars: YYYY-MM-DD)
  return date.length === 10 ? `${date}T00:00:00.000Z` : date
}

export function useCreateIssue() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      statusId,
      priority,
      assigneeId,
      labelIds,
      dueDate,
    }: CreateIssueVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(CREATE_ISSUE, {
         
        input: {
          projectId,
          title,
          statusId,
          priority,
          assigneeId,
          labelIds,
          dueDate: toDateTime(dueDate),
        } as CreateIssueInput,
      })
    },
    onSuccess: (data, { projectId }) => {
      const issue = data.createIssue.issue
      dispatch(addIssue(issue as unknown as Issue))
      queryClient.invalidateQueries({
        queryKey: issueKeys.list(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: projectKeys.overview(projectId),
      })
    },
  })
}

export type { CreateIssueVariables }
