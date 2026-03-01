import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultNodeKeys } from '@/entities/vault-file'
import type { MoveFileVariables } from '../model'
import { MOVE_VAULT_FILE } from '../api/fragments'

/**
 * Moves a vault file to a different folder.
 * S3 object location is unchanged — only folderId in the database is updated.
 *
 * @layer Features
 */
export function useMoveFile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ fileId, targetFolderId }: MoveFileVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(MOVE_VAULT_FILE, {
        input: { fileId, targetFolderId },
      })
    },
    onSuccess: (_, { projectId, sourceFolderId, targetFolderId }) => {
      // Invalidate both source and destination folder listing
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, sourceFolderId),
      })
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, targetFolderId),
      })
    },
  })
}

export type { MoveFileVariables }
