import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_PAGES } from '../api/fragments'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { Page } from '@/entities/page'
import type { GetProjectPagesQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { pageKeys } from '@/entities/page'

/**
 * Fetch the nested page tree for a project.
 *
 * Returns root-level pages with children pre-populated (via PAGE_WITH_CHILDREN
 * fragment, 3 levels deep inline). The page-list widget builds a flat/display
 * tree from the returned nested structure.
 *
 * Cache strategy: 30s staleTime — page tree changes far less often than Y.Doc content.
 *
 * @layer Features
 */
export function useProjectPages(
  projectId: string,
  options?: Omit<
    UseQueryOptions<GetProjectPagesQuery, Error, Array<Page>>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: pageKeys.projectPages(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_PROJECT_PAGES, { projectId })
    },
    select: (data) => data.getProjectPages as Array<Page>,
    enabled: !!projectId,
    staleTime: 30_000, // 30s — page tree rarely changes mid-session
    ...options,
  })
}
