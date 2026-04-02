import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { GET_ME_QUERY, SYNC_USER_MUTATION } from '@/entities/session/api'

const USER_ME_QUERY_KEY = ['user', 'me']

/**
 * useSafeUser — Global App Shell DB Guard.
 *
 * Guarantees: any route rendered inside /_app ALWAYS has a Postgres User row.
 *
 * Flow:
 *   1. If Clerk hasn't loaded  → isLoaded=false  (show global loader)
 *   2. If not signed in        → isAuthenticated=false (redirect to /sign-in)
 *   3. Fetch DB user via GET_ME
 *      - Cache hit or DB row exists → isDbUserReady=true (render Outlet)
 *      - DB row missing (webhook missed) → fire syncUser fallback, isSyncing=true
 *   4. After syncUser resolves → invalidate 'user.me' → re-fetch → isDbUserReady=true
 */
export function useSafeUser() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useClerkAuth()
  const { user: clerkUser } = useClerkUser()
  const queryClient = useQueryClient()

  // Fetch DB user (enabled only once Clerk is loaded and user is signed in)
  const { data: meData, isLoading: isFetchingMe } = useQuery({
    queryKey: USER_ME_QUERY_KEY,
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_ME_QUERY)
    },
    enabled: isLoaded && !!isSignedIn,
    staleTime: 5 * 60_000,
    retry: 1,
  })

  // Fallback: sync user to DB if authenticated but no DB row found
  const { mutate: syncUser, isPending: isSyncing } = useMutation({
    mutationFn: async () => {
      if (!clerkUser || !userId) throw new Error('No Clerk user')
      const token = await getToken()
      const email =
        clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress
      return GqlClient(token).request(SYNC_USER_MUTATION, {
        clerkId: userId,
        email,
        fullName: clerkUser.fullName || undefined,
        avatarUrl: clerkUser.imageUrl || undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ME_QUERY_KEY })
    },
  })

  const dbUser = meData?.me ?? null
  const needsSync = isLoaded && !!isSignedIn && !isFetchingMe && dbUser === null

  // Fire sync fallback once when DB row is confirmed missing
  useEffect(() => {
    if (needsSync) {
      syncUser()
    }
  }, [needsSync, syncUser])

  return {
    isLoaded,
    isAuthenticated: isLoaded && !!isSignedIn,
    userId: userId ?? null,
    sessionId: sessionId ?? null,
    dbUser,
    /** true once the Postgres User row is confirmed to exist */
    isDbUserReady: !!dbUser,
    /** true while the sync fallback mutation is in-flight */
    isSyncing: needsSync || isSyncing,
  }
}
