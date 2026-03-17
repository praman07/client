import { useQuery } from '@tanstack/react-query'
import { setCurrentUser } from '@/entities/user'
import { sessionKeys } from '@/entities/session/api'
import {
  GET_ME_QUERY,
  SESSION_USER_FRAGMENT,
} from '@/entities/session'
import { useAppDispatch, useAuth } from '@/shared/hooks'
import { useFragment } from '@/gql'
import { GqlClient } from '@/shared/api/graphql-client'

export function useSyncCurrentUser() {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: sessionKeys.me(),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('No token found')
      const client = GqlClient(token)
      const data = await client.request(GET_ME_QUERY)

      // eslint-disable-next-line react-hooks/rules-of-hooks -- useFragment is a codegen utility, not a real hook
      const user = useFragment(SESSION_USER_FRAGMENT, data.me)

      if (user) {
        dispatch(setCurrentUser(user))
      }
      return data
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}
