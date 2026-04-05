import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { setCurrentWorkspaceId } from '../model/slice'
import { workspaceKeys, GET_WORKSPACE_BY_SLUG_QUERY, WORKSPACE_LIGHT_FRAGMENT } from '../api'
import { GqlClient } from '@/shared/api'
import { useAppDispatch } from '@/shared/hooks'
import { useFragment } from '@/gql'

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
        const data = await client.request(GET_WORKSPACE_BY_SLUG_QUERY, { slug })
        // Unmask the fragment to access typed fields (codegen client-preset masking)
        const workspace = useFragment(WORKSPACE_LIGHT_FRAGMENT, data.workspaceBySlug)

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- GQL workspaceBySlug returns null for missing/forbidden slug
        if (workspace) {
          dispatch(setCurrentWorkspaceId(workspace.id))
        }

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
