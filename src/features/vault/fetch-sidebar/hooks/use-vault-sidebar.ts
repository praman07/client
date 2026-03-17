import { useQuery } from '@tanstack/react-query'
import { GET_VAULT_SIDEBAR } from '../api/fragments'
import type { VaultSidebar } from '@/entities/vault-folder'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'

/**
 * Fetches sidebar data — pinned folders + system folders — for a project.
 *
 * Fetched once on Vault mount and never re-fetched during folder navigation.
 * Only invalidated by pin / unpin / delete-folder mutations.
 *
 * @layer Features
 */
export function useVaultSidebar(projectId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: vaultFolderKeys.sidebar(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_VAULT_SIDEBAR, { projectId })
    },
    select: (data) => data.getVaultSidebar as VaultSidebar,
    enabled: !!projectId,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  })
}
