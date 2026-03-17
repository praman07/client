import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_VAULT_FOLDER } from '../api/fragments'
import type { CreateFolderVariables } from '../model'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultNodeKeys } from '@/entities/vault-file'

/**
 * Creates a new user-defined vault folder.
 *
 * Invalidates vaultNodeKeys.children so the new folder appears in the
 * explorer grid immediately after creation.
 *
 * @layer Features
 */
export function useCreateFolder() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      name,
      parentFolderId,
    }: CreateFolderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(CREATE_VAULT_FOLDER, {
        input: { projectId, name, parentFolderId },
      })
    },
    onSuccess: (_, { projectId, parentFolderId }) => {
      // Strategy: invalidate the exact key useVaultChildren is registered under.
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, parentFolderId),
      })
    },
  })
}

export type { CreateFolderVariables }
