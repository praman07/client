import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFileKeys } from '@/entities/vault-file'
import type { VaultUsage } from '@/entities/vault-file'
import { GET_VAULT_USAGE } from '../api/fragments'

/**
 * Fetches current storage usage for a project and its workspace.
 * Polled every 60s — also invalidated by upload and delete mutations.
 *
 * @layer Features
 */
export function useVaultUsage(projectId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: vaultFileKeys.usage(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_VAULT_USAGE, { projectId })
    },
    select: (data) => data.getVaultUsage as VaultUsage,
    enabled: !!projectId,
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}
