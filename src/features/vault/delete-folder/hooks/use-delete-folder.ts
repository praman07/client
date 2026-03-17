import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DELETE_VAULT_FOLDER } from '../api/fragments'
import type { DeleteFolderVariables } from '../model'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'
import { vaultFileKeys, vaultNodeKeys } from '@/entities/vault-file'

/**
 * Soft-deletes a vault folder.
 * cascade=true deletes all contents recursively.
 * System folders are blocked by the server.
 *
 * Note: usage query is invalidated but may not reflect cascade-deleted files
 * immediately — the server runs a background cleanup job for this.
 *
 * @layer Features
 */
export function useDeleteFolder() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ folderId, cascade }: DeleteFolderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(DELETE_VAULT_FOLDER, {
        input: { folderId, cascade },
      })
    },
    onSuccess: (_, { projectId, parentFolderId }) => {
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, parentFolderId),
      })
      // Sidebar may have had this folder pinned
      queryClient.invalidateQueries({
        queryKey: vaultFolderKeys.sidebar(projectId),
      })
      // Usage may reflect changes (cascade files freed)
      queryClient.invalidateQueries({
        queryKey: vaultFileKeys.usage(projectId),
      })
    },
  })
}

export type { DeleteFolderVariables }
