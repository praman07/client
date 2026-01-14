import { useQuery } from '@tanstack/react-query'
import { setCurrentUser } from '@/entities/user/model/slice'
import { sessionKeys } from '@/entities/session/api'
import {
  GET_ME_QUERY,
  SESSION_USER_FRAGMENT,
} from '@/entities/session/api/fragments'
import { useAppDispatch } from '@/shared/lib/store/redux'
import { useFragment } from '@/gql'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'

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

      const user = useFragment(SESSION_USER_FRAGMENT, data.me)

      if (user) {
        dispatch(setCurrentUser(user))
      }
      return data
      return data
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}
