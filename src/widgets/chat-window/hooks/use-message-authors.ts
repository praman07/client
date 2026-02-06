import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useMemberCache } from '../lib/member-cache-context'
import type { MessageRowData } from '../model/message-list.types'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { GET_USERS_BY_IDS } from '@/entities/conversation/api'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:authors')

/**
 * Hook to batch fetch and cache missing message authors
 *
 * Uses TanStack Query for proper caching, deduplication, and loading state management.
 * Automatically populates the member cache when authors are fetched.
 *
 * @param messages - Array of messages to extract author IDs from
 */
export function useMessageAuthors(messages: Array<MessageRowData>) {
  const { getMemberInfo, addUsers } = useMemberCache()
  const { getToken } = useAuth()

  // Extract unique author IDs and find missing ones
  const missingAuthorIds = useMemo(() => {
    const uniqueAuthorIds = new Set(messages.map((m) => m.authorId))
    return Array.from(uniqueAuthorIds).filter((id) => !getMemberInfo(id))
  }, [messages, getMemberInfo])

  // Fetch missing users using TanStack Query
  const { data: fetchedUsers } = useQuery({
    queryKey: ['users', 'batch', missingAuthorIds.sort()],
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)

      log.debug('Fetching', missingAuthorIds.length, 'missing authors')

      const result = await client.request(GET_USERS_BY_IDS, {
        userIds: missingAuthorIds,
      })

      log.debug('Fetched users:', result.getUsersByIds)

      return result.getUsersByIds.map((u) => ({
        userId: u.id,
        fullName: u.fullName,
        email: u.email,
        avatarUrl: u.avatarUrl,
      }))
    },
    enabled: missingAuthorIds.length > 0,
    staleTime: Infinity, // User data doesn't change often, cache forever
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  })

  // Add fetched users to member cache when they arrive
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      log.debug('Adding', fetchedUsers.length, 'users to cache')
      addUsers(fetchedUsers)
    }
  }, [fetchedUsers, addUsers])
}
