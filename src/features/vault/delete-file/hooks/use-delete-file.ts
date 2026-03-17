import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DELETE_VAULT_FILE } from '../api/fragments'
import type { DeleteFileVariables } from '../model'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFileKeys, vaultNodeKeys } from '@/entities/vault-file'

/**
 * Soft-deletes a vault file.
 * S3 object is expired by lifecycle rule after 30 days.
 * Storage quota is released immediately.
 *
 * @layer Features
 */
export function useDeleteFile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ fileId }: DeleteFileVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(DELETE_VAULT_FILE, {
        input: { fileId },
      })
    },
    onSuccess: (_, { projectId, folderId }) => {
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, folderId),
      })
      queryClient.invalidateQueries({
        queryKey: vaultFileKeys.usage(projectId),
      })
    },
  })
}

export type { DeleteFileVariables }
