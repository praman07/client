/**
 * Reorders an issue within its current column (same-column drag).
 *
 * Optimistic strategy:
 *  1. dispatch(reorderIssue) fires immediately — card jumps to new position
 *  2. Mutation fires in background
 *  3. On error: dispatch reorderIssue back to previousPosition + toast.error
 *
 * onSuccess intentionally does NOT invalidate the query — board data lives in
 * Redux (populated by useBoardData), so the optimistic state IS the truth.
 * invalidateQueries is kept ONLY in onError to restore server truth after failure.
 *
 * Server resolver: reorderIssue
 * @layer Features
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { REORDER_ISSUE } from '../api/fragments'
import type { AppDispatch } from '@/app/store'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys, reorderIssue } from '@/entities/issue'

interface ReorderVariables {
  issueId: string
  newPosition: number
  /** Original position before the drag — used to revert on error */
  previousPosition: number
}

export function useReorderIssue(projectId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: async ({ issueId, newPosition }: ReorderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(REORDER_ISSUE, {
        input: { issueId, newPosition },
      })
    },
    onError: (_, { issueId, previousPosition }) => {
      // Revert card to its original position within the column
      dispatch(reorderIssue({ id: issueId, newPosition: previousPosition }))
      // Refetch to restore exact server truth
      queryClient.invalidateQueries({
        queryKey: issueKeys.list(projectId),
      })
      toast.error('Failed to reorder issue. Changes reverted.')
    },
  })
}
