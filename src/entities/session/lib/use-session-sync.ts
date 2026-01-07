import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { setCurrentWorkspace, setSessionUser } from '../model/slice'
import {
  SESSION_USER_FRAGMENT,
  SESSION_WORKSPACE_FRAGMENT,
} from '../api/fragments'
import { GET_ME_QUERY, GET_WORKSPACE_BY_SLUG_QUERY } from '../api/documents'
import { authenticatedGraphQLRequest } from '@/shared/api/graphql-client'
import { useAppDispatch } from '@/app/store'
import { useFragment } from '@/shared/api/graphql/generated'

export function useSyncCurrentUser() {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['GetMe'],
    queryFn: async () => {
      const token = await getToken()
      const data = await authenticatedGraphQLRequest(GET_ME_QUERY, token)

      // Sync User to Redux immediately upon fetch
      const user = useFragment(SESSION_USER_FRAGMENT, data.me)
      if (user) {
        dispatch(setSessionUser(user))
      }
      return data
    },
    staleTime: Infinity, // Session user rarely changes
    refetchOnWindowFocus: false,
  })
}

export function useSyncCurrentWorkspace(slug?: string) {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['GetWorkspaceBySlug', slug],
    queryFn: async () => {
      if (!slug) return null

      const token = await getToken()
      try {
        const data = await authenticatedGraphQLRequest(
          GET_WORKSPACE_BY_SLUG_QUERY,
          token,
          {
            slug,
          },
        )

        // Sync Workspace to Redux immediately upon fetch
        const workspace = useFragment(
          SESSION_WORKSPACE_FRAGMENT,
          data.workspaceBySlug,
        )
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (workspace) {
          dispatch(setCurrentWorkspace(workspace))
        } else {
          dispatch(setCurrentWorkspace(null))
        }
        return data
      } catch (err) {
        dispatch(setCurrentWorkspace(null))
        throw err
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time for workspace context
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on Auth/Permissions errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
  })
}
