import { useRef } from 'react'
import { useAppDispatch } from '@/shared/hooks'
import { useVaultChildren } from '@/features/vault/fetch-children'
import { useUploadFile } from '@/features/vault/upload-file'
import { uploadTrayActions } from '@/widgets/vault/vault-upload-tray'
import { DEFAULT_VAULT_SORT } from '@/shared/lib/vault-types'
import type { VaultSortState } from '@/shared/lib/vault-types'
import type { VaultNodeType } from '@/gql/graphql'

interface UseVaultExplorerActionsParams {
  projectId: string
  workspaceId: string
  folderId: string | null
  onSelectNode: (id: string, type: VaultNodeType) => void
  sort?: VaultSortState
}

/**
 * Central hook for VaultExplorer — wires fetch-children with all mutation actions
 * and dispatches upload progress into the Redux uploadTray slice.
 *
 * @layer Widgets — vault-explorer
 */
export function useVaultExplorerActions({
  projectId,
  workspaceId,
  folderId,
  onSelectNode,
  sort = DEFAULT_VAULT_SORT,
}: UseVaultExplorerActionsParams) {
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const childrenQuery = useVaultChildren(projectId, folderId, sort)
  const uploadFile = useUploadFile()

  const folders = childrenQuery.data?.folders ?? []
  const files = childrenQuery.data?.files ?? []

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  async function handleFilesPicked(fileList: FileList | null) {
    if (!fileList) return
    const files = Array.from(fileList)
    for (const file of files) {
      const localId = crypto.randomUUID()
      dispatch(
        uploadTrayActions.enqueue({
          localId,
          name: file.name,
          sizeBytes: file.size,
          progress: 0,
          status: 'queued',
        }),
      )
      try {
        await uploadFile({
          file,
          projectId,
          workspaceId,
          folderId,
          onProgress: (percent) =>
            dispatch(uploadTrayActions.setProgress({ localId, percent })),
          onStatusChange: (status, error) =>
            dispatch(uploadTrayActions.setStatus({ localId, status, error })),
        })
      } catch {
        // error is already dispatched via onStatusChange
      }
    }
  }

  return {
    childrenQuery,
    folders,
    files,
    fileInputRef,
    handleUploadClick,
    handleFilesPicked,
    onSelectNode,
  }
}
