/**
 * Moves an issue to a different status column (cross-column drag).
 *
 * Optimistic strategy:
 *  1. dispatch(moveIssue) fires in onDragOver — card jumps columns instantly
 *  2. Mutation fires in background on drop
 *  3. On error: dispatch revert to source column + previousPosition + toast.error
 *
 * onSuccess intentionally does NOT invalidate the query — board data lives in
 * Redux (populated by useBoardData), so the optimistic state IS the truth.
 * invalidateQueries is kept ONLY in onError to restore server truth after failure.
 *
 * Server resolver: moveIssueStatus
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys, moveIssue } from '@/entities/issue'
import { MOVE_ISSUE_STATUS } from '../api/fragments'
import type { DragIssuePayload } from '../model/types'
import type { AppDispatch } from '@/app/store'

export function useMoveIssue(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({
      issueId,
      targetStatusId,
      newPosition,
    }: DragIssuePayload) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(MOVE_ISSUE_STATUS, {
        input: { issueId, statusId: targetStatusId, newPosition },
      })
    },
    onError: (_, { issueId, sourceStatusId, previousPosition }) => {
      // Revert card to its original column AND original position
      dispatch(
        moveIssue({
          id: issueId,
          newStatusId: sourceStatusId,
          newPosition: previousPosition,
        }),
      )
      // Refetch to restore exact server truth
      queryClient.invalidateQueries({
        queryKey: issueKeys.list(projectId),
      })
      toast.error('Failed to move issue. Changes reverted.')
    },
  })
}
