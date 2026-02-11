import { useInfiniteQuery } from '@tanstack/react-query'
import type { UseInfiniteQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { boardKeys } from '@/entities/whiteboard-board'
import { GET_USER_BOARDS } from '../api/fragments'
import type { GetUserBoardsQuery } from '@/gql/graphql'

/**
 * Fetch paginated list of boards user has access to in workspace
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useUserBoards('workspace_xyz', { limit: 20 })
 * const boards = data?.pages.flatMap(page => page.userBoards.boards) ?? []
 */
export function useUserBoards(
  workspaceId: string,
  params?: {
    limit?: number
  },
  options?: Omit<
    UseInfiniteQueryOptions<GetUserBoardsQuery>,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >,
) {
  const { getToken } = useAuth()
  const { limit = 20 } = params || {}

  return useInfiniteQuery({
    queryKey: boardKeys.list(workspaceId),
    queryFn: async ({ pageParam }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(GET_USER_BOARDS, {
        workspaceId,
        limit,
        cursor: pageParam as string | undefined,
      })
    },
    getNextPageParam: (lastPage) => lastPage.userBoards.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!workspaceId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  })
}
