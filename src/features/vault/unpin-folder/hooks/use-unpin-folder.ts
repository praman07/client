import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UNPIN_VAULT_FOLDER } from '../api/fragments'
import type { UnpinFolderVariables } from '../model'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'

/**
 * Unpins a vault folder from the current user's sidebar.
 * Idempotent — no error if the folder is not pinned.
 *
 * @layer Features
 */
export function useUnpinFolder() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ folderId }: UnpinFolderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(UNPIN_VAULT_FOLDER, {
        input: { folderId },
      })
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: vaultFolderKeys.sidebar(projectId),
      })
    },
  })
}

export type { UnpinFolderVariables }
