import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'
import { vaultFileKeys } from '@/entities/vault-file'
import type { VaultNodeType } from '@/gql/graphql'
import { GET_VAULT_NODE } from '../api/fragments'

/**
 * Fetches full metadata for a single vault folder or file.
 * Used by the detail / info side panel — called lazily when user selects an item.
 *
 * NOT used for listings — use useVaultChildren for that.
 *
 * @layer Features
 */
export function useVaultNode(id: string, type: VaultNodeType, enabled = true) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey:
      type === 'FOLDER' ? vaultFolderKeys.detail(id) : vaultFileKeys.detail(id),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_VAULT_NODE, { id, type })
    },
    select: (data) => data.getVaultNode,
    enabled: !!id && enabled,
    staleTime: 30_000,
  })
}
