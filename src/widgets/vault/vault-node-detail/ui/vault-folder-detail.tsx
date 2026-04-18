import { useState } from 'react'
import { Folder } from 'lucide-react'
import { VaultDetailMeta } from './vault-detail-meta'
import { VaultDetailActions } from './vault-detail-actions'
import type { VaultFolder } from '@/entities/vault-folder'
import { RenameFolderModal } from '@/features/vault/rename-folder'
import { useDeleteFolder } from '@/features/vault/delete-folder'

interface VaultFolderDetailProps {
  folder: VaultFolder
  onClose: () => void
}

/**
 * Detail panel content for a vault folder.
 * Rename is handled via RenameFolderModal (TanStack Form + Dialog).
 * @layer Widgets
 */
export function VaultFolderDetail({ folder, onClose }: VaultFolderDetailProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const { mutate: deleteFolder } = useDeleteFolder()

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Rename modal */}
      <RenameFolderModal
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        folderId={folder.id}
        projectId={folder.projectId}
        parentFolderId={folder.parentFolderId ?? null}
        currentName={folder.name}
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-layer-2">
          <Folder className="h-6 w-6 text-secondary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{folder.name}</h3>
          <p className="text-xs text-secondary">Folder</p>
        </div>
      </div>

      {/* Actions */}
      <VaultDetailActions
        type="FOLDER"
        onRename={() => setIsRenameOpen(true)}
        onDelete={() => {
          if (
            window.confirm(`Delete "${folder.name}"? This cannot be undone.`)
          ) {
            deleteFolder({
              folderId: folder.id,
              cascade: true,
              projectId: folder.projectId,
              parentFolderId: folder.parentFolderId ?? null,
            })
            onClose()
          }
        }}
      />

      {/* Metadata */}
      <VaultDetailMeta node={folder} type="FOLDER" />
    </div>
  )
}
