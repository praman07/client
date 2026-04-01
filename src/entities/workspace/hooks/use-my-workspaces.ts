import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { setMyWorkspaces } from '../model/slice'
import { workspaceKeys } from '../api'
import { gql } from '@/gql'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAppDispatch } from '@/shared/hooks'

const GET_MY_WORKSPACES_QUERY = gql(`
  query GetMyWorkspaces {
    myWorkspaces {
      ...WorkspaceFragment
    }
  }
`)

export function useMyWorkspaces() {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: workspaceKeys.myWorkspaces(),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('No token found')
      const client = GqlClient(token)
      const data = await client.request(GET_MY_WORKSPACES_QUERY)
      dispatch(setMyWorkspaces(data.myWorkspaces as any))
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
