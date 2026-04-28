/**
 * usePagesHome — fetches the pages home dashboard data.
 *
 * Returns a flat `pages` list ordered by updatedAt DESC for display
 * on the pages module home screen.
 */
import { useQuery } from '@tanstack/react-query'
import { pagesHomeKeys } from '../api'
import { GET_PAGES_HOME } from '../api/fragments'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'

export function usePagesHome(limit = 10) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: [...pagesHomeKeys.lists(), limit],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_PAGES_HOME, { limit })
    },
  })
}
