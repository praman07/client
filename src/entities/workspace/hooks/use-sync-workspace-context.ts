import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { setCurrentWorkspaceId } from '../model/slice'
import { workspaceKeys } from '../api'
import { WORKSPACE_FRAGMENT } from '../api/fragments'
import { gql, useFragment } from '@/gql'
import { GqlClient } from '@/shared/api'
import { useAppDispatch } from '@/shared/hooks'

const GET_WORKSPACE_BY_SLUG_QUERY = gql(`
  query GetWorkspaceBySlug($slug: String!) {
    workspaceBySlug(slug: $slug) {
      ...WorkspaceFragment
    }
  }
`)

export function useSyncWorkspaceContext(slug?: string) {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: workspaceKeys.detail(slug || ''),
    queryFn: async () => {
      if (!slug) return null

      const token = await getToken()
      if (!token) throw new Error('No token found')
      const client = GqlClient(token)

      try {
        const data = await client.request(GET_WORKSPACE_BY_SLUG_QUERY, {
          slug,
        })

        const workspace = useFragment(WORKSPACE_FRAGMENT, data.workspaceBySlug)

        dispatch(setCurrentWorkspaceId(workspace.id))
        return data
      } catch (err) {
        dispatch(setCurrentWorkspaceId(null))
        throw err
      }
    },
    enabled: !!slug,
    retry: false,
  })
}
