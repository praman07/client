import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { setCurrentWorkspace, setSessionUser } from '../model/slice'
import {
  SESSION_USER_FRAGMENT,
  SESSION_WORKSPACE_FRAGMENT,
} from '../api/fragments'
import { GqlClient } from '@/shared/api/graphql-client'
import { gql, useFragment } from '@/gql'
import { sessionKeys } from '@/entities/session/api/query-keys'
import { workspaceKeys } from '@/entities/workspace/api/query-keys'
import { useAppDispatch } from '@/shared/lib/redux'

const GET_ME_QUERY = gql(`
  query GetMe {
    me {
      ...SessionUser
    }
  }
`)

const GET_WORKSPACE_BY_SLUG_QUERY = gql(`
  query GetWorkspaceBySlug($slug: String!) {
    workspaceBySlug(slug: $slug) {
      ...SessionWorkspace
    }
  }
`)

export function useSyncCurrentUser() {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: sessionKeys.me(),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_ME_QUERY)

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
    queryKey: workspaceKeys.detail(slug || ''),
    queryFn: async () => {
      if (!slug) return null

      const token = await getToken()
      const client = GqlClient(token)

      try {
        const data = await client.request(GET_WORKSPACE_BY_SLUG_QUERY, {
          slug,
        })

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
    retry: (failureCount, error: unknown) => {
      // Don't retry on Auth/Permissions errors
      // Use unknown type and safe checking
      const status = (error as any)?.response?.status
      if (status === 401 || status === 403) {
        return false
      }
      return failureCount < 3
    },
  })
}
