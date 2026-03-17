import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MOVE_VAULT_FOLDER } from '../api/fragments'
import type { MoveFolderVariables } from '../model'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'
import { vaultNodeKeys } from '@/entities/vault-file'

/**
 * Moves a vault folder to a new parent.
 * System folders and circular moves are blocked by the server.
 *
 * @layer Features
 */
export function useMoveFolder() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      folderId,
      targetParentFolderId,
    }: MoveFolderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(MOVE_VAULT_FOLDER, {
        input: { folderId, targetParentFolderId },
      })
    },
    onSuccess: (
      _,
      { projectId, sourceParentFolderId, targetParentFolderId },
    ) => {
      // useVaultChildren registers under vaultNodeKeys.children
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, sourceParentFolderId),
      })
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, targetParentFolderId),
      })
      // Sidebar may show pinned folder in a new location
      queryClient.invalidateQueries({
        queryKey: vaultFolderKeys.sidebar(projectId),
      })
    },
  })
}

export type { MoveFolderVariables }
