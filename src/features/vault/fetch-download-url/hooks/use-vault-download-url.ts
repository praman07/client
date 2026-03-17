import { useQuery } from '@tanstack/react-query'
import { GET_VAULT_DOWNLOAD_URL } from '../api/fragments'
import type { VaultDownloadUrl } from '@/entities/vault-file'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFileKeys } from '@/entities/vault-file'

/**
 * Fetches a short-lived presigned S3 GET URL for downloading or previewing a file.
 * TTL: 5 minutes.
 *
 * NEVER cached — staleTime: 0, gcTime: 0.
 * Always request a fresh URL. Cached URLs expose access after a member is removed.
 *
 * @layer Features
 */
export function useVaultDownloadUrl(fileId: string, enabled: boolean) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: vaultFileKeys.downloadUrl(fileId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_VAULT_DOWNLOAD_URL, { fileId })
    },
    select: (data) => data.getVaultDownloadUrl as VaultDownloadUrl,
    enabled: !!fileId && enabled,
    staleTime: 0,
    gcTime: 0,
  })
}
