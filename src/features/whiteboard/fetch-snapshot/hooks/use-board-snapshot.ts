import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GET_BOARD_SNAPSHOT } from '../api/fragments'
import { decodeSnapshot } from '../lib/decode-snapshot'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { DecodedSnapshot } from '../lib/decode-snapshot'
import type { GetBoardSnapshotQuery } from '@/gql/graphql'
import { boardKeys } from '@/entities/whiteboard-board'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'

/**
 * Fetch Y.js snapshot for board initialization with bidirectional sync
 *
 * @param boardId - Board to load snapshot for
 * @param clientSnapshot - Optional full client Y.Doc snapshot for bidirectional sync
 * @example
 * const { data } = useBoardSnapshot('board_abc123')
 * if (data) Y.applyUpdate(ydoc, data.diff)
 */
export function useBoardSnapshot(
  boardId: string,
  clientSnapshot?: string,
  options?: Omit<
    UseQueryOptions<GetBoardSnapshotQuery, Error, DecodedSnapshot>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  // ✅ Include clientSnapshot in query key for proper cache semantics
  // Different clientSnapshot = different server response
  const queryKey = useMemo(
    () => [...boardKeys.snapshot(boardId), clientSnapshot || 'initial'],
    [boardId, clientSnapshot],
  )

  return useQuery({
    queryKey,
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(GET_BOARD_SNAPSHOT, { boardId, clientSnapshot })
    },
    select: (data) => decodeSnapshot(data.getBoardSnapshot),
    enabled: !!boardId,
    staleTime: 0,
    gcTime: 0, // ✅ Don't cache - prevent stale data on remount
    refetchOnMount: 'always', // ✅ Always refetch on mount
    ...options,
  })
}
