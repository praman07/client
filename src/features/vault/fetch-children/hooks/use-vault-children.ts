import { useInfiniteQuery } from '@tanstack/react-query'
import { GET_VAULT_CHILDREN } from '../api/fragments'
import type { VaultFile } from '@/entities/vault-file'
import type { VaultFolder } from '@/entities/vault-folder'
import type { SortDirection, VaultSortField } from '@/gql/graphql'
import type { VaultSortState } from '@/shared/lib/vault-types'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultNodeKeys } from '@/entities/vault-file'
import { DEFAULT_VAULT_SORT } from '@/shared/lib/vault-types'

/**
 * Fetches immediate children (folders + paginated files) of a vault folder.
 * parentFolderId = null → Home / root level.
 *
 * Uses useInfiniteQuery for cursor-based file pagination.
 * Folders are returned whole on every page (not paginated).
 *
 * @layer Features
 */
export function useVaultChildren(
  projectId: string,
  parentFolderId: string | null,
  sort: VaultSortState = DEFAULT_VAULT_SORT,
) {
  const { getToken } = useAuth()

  return useInfiniteQuery({
    queryKey: vaultNodeKeys.children(projectId, parentFolderId),
    queryFn: async ({ pageParam }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_VAULT_CHILDREN, {
        projectId,
        parentFolderId: parentFolderId ?? undefined,
        cursor: pageParam ?? undefined,
        limit: 50,
        sortBy: sort.sortBy as VaultSortField,
        sortDir: sort.sortDir as SortDirection,
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const result = lastPage.getVaultChildren
      return result.hasNextPage ? (result.nextCursor ?? undefined) : undefined
    },
    select: (data) => ({
      folders: (data.pages[0]?.getVaultChildren.folders ?? []) as Array<VaultFolder>,
      files: data.pages.flatMap((p) => p.getVaultChildren.files) as Array<VaultFile>,
      totalFileCount: data.pages[0]?.getVaultChildren.totalFileCount ?? 0,
    }),
    enabled: !!projectId,
    staleTime: 30_000,
  })
}
