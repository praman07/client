import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RENAME_VAULT_FILE } from '../api/fragments'
import type { RenameFileVariables } from '../model'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFileKeys, vaultNodeKeys } from '@/entities/vault-file'

/**
 * Renames a vault file (metadata only — S3 key is unchanged).
 *
 * @layer Features
 */
export function useRenameFile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ fileId, name }: RenameFileVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(RENAME_VAULT_FILE, {
        input: { fileId, name },
      })
    },
    onSuccess: (_, { projectId, folderId, fileId }) => {
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, folderId),
      })
      queryClient.invalidateQueries({
        queryKey: vaultFileKeys.detail(fileId),
      })
    },
  })
}

export type { RenameFileVariables }
