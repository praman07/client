import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'
import type { VaultFolder } from '@/entities/vault-folder'
import { GET_VAULT_ANCESTORS } from '../api/fragments'

/**
 * Fetches the ancestor folder chain for a given folderId (root → current).
 *
 * This is the SERVER FALLBACK path for the vault breadcrumb.
 * It fires ONLY when:
 *   - folderId is non-null (we are inside a folder)
 *   - enabled = true (caller signals the client trail is absent)
 *
 * When navigating in-session the caller passes enabled = false,
 * keeping the breadcrumb 100% client-side (no query fired).
 *
 * @layer Features
 */
export function useVaultAncestors(
  folderId: string | null,
  enabled: boolean,
): VaultFolder[] {
  const { getToken } = useAuth()

  const query = useQuery({
    queryKey: folderId
      ? vaultFolderKeys.ancestors(folderId)
      : ['vault-folder', 'ancestors', null],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const result = await GqlClient(token).request(GET_VAULT_ANCESTORS, {
        folderId: folderId!,
      })
      return result.getVaultAncestors as VaultFolder[]
    },
    enabled: enabled && !!folderId,
    staleTime: 30_000,
  })

  return query.data ?? []
}
