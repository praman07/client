import { useQuery } from '@tanstack/react-query'
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
import { USER_FRAGMENT } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { getFragmentData } from '@/shared/api'
import { GET_ME_QUERY } from '@/entities/session/api'

/** Shared query key for the authenticated user's DB profile. */
export const userKeys = {
  me: () => ['user', 'me'] as const,
}

/**
 * useUser — DB-backed user hook.
 *
 * Returns the current user's profile from Postgres (via GET_ME).
 * Shares the same React Query cache key as useSafeUser's guard query,
 * so no duplicate network requests are made.
 *
 * Use this hook anywhere you need the DB user (avatar, name, bio, etc.).
 */
export function useUser() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth()

  const { data, isLoading } = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_ME_QUERY)
    },
    enabled: isLoaded && !!isSignedIn,
    staleTime: 5 * 60_000,
  })

  // Unmask the GraphQL fragment to get a fully typed user object
  const user = data?.me ? getFragmentData(USER_FRAGMENT, data.me) : null

  return {
    isLoaded,
    user,
    isLoadingProfile: isLoading,
  }
}
