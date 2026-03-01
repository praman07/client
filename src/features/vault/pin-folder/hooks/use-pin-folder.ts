import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { vaultFolderKeys } from '@/entities/vault-folder'
import type { PinFolderVariables } from '../model'
import { PIN_VAULT_FOLDER } from '../api/fragments'

/**
 * Pins a vault folder to the current user's sidebar.
 * Idempotent — pinning an already-pinned folder is a no-op.
 *
 * @layer Features
 */
export function usePinFolder() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ folderId, projectId }: PinFolderVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(PIN_VAULT_FOLDER, {
        input: { folderId, projectId },
      })
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: vaultFolderKeys.sidebar(projectId),
      })
    },
  })
}

export type { PinFolderVariables }
