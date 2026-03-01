import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'
import { vaultNodeKeys } from '@/entities/vault-file'
import type { RenameFolderVariables } from '../model'
import { RENAME_VAULT_FOLDER } from '../api/fragments'

/**
 * Renames a user-defined vault folder.
 * System folders are blocked on the server.
 *
 * Invalidates vaultNodeKeys.children so the renamed folder label updates
 * immediately in the explorer grid.
 *
 * @layer Features
 */
export function useRenameFolder() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ folderId, name }: RenameFolderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(RENAME_VAULT_FOLDER, {
        input: { folderId, name },
      })
    },
    onSuccess: (_, { projectId, parentFolderId, folderId }) => {
      // useVaultChildren registers under vaultNodeKeys.children
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, parentFolderId),
      })
      queryClient.invalidateQueries({
        queryKey: vaultFolderKeys.detail(folderId),
      })
    },
  })
}

export type { RenameFolderVariables }
