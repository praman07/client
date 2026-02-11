import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { boardKeys } from '@/entities/whiteboard-board'
import { GET_BOARD_SNAPSHOT } from '../api/fragments'
import { decodeSnapshot } from '../lib/decode-snapshot'
import type { DecodedSnapshot } from '../lib/decode-snapshot'
import type { GetBoardSnapshotQuery } from '@/gql/graphql'

/**
 * Fetch Y.js snapshot for board initialization (Base64 encoded, auto-decoded to Uint8Array)
 *
 * @example
 * const { data } = useBoardSnapshot('board_abc123')
 * if (data) Y.applyUpdate(ydoc, data.diff)
 */
export function useBoardSnapshot(
  boardId: string,
  options?: Omit<
    UseQueryOptions<GetBoardSnapshotQuery, Error, DecodedSnapshot>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: boardKeys.snapshot(boardId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(GET_BOARD_SNAPSHOT, { boardId })
    },
    select: (data) => decodeSnapshot(data.boardSnapshot),
    enabled: !!boardId,
    staleTime: Infinity, // Snapshots are immutable
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    ...options,
  })
}
