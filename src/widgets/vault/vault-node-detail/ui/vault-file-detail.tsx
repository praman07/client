import { useState } from 'react'
import { File } from 'lucide-react'
import { useVaultNodeDetail } from '../hooks/use-vault-node-detail'
import { VaultDetailMeta } from './vault-detail-meta'
import { VaultDetailActions } from './vault-detail-actions'
import type { VaultFile } from '@/entities/vault-file'
import { RenameFileModal } from '@/features/vault/rename-file'
import { useDeleteFile } from '@/features/vault/delete-file'
import { VaultNodeType } from '@/gql/graphql'

interface VaultFileDetailProps {
  file: VaultFile
  onClose: () => void
}

/**
 * Detail panel content for a vault file.
 * Download URL is fetched lazily — only when user clicks Download.
 * Rename is handled via RenameFileModal (TanStack Form + Dialog).
 * @layer Widgets
 */
export function VaultFileDetail({ file, onClose }: VaultFileDetailProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const { mutate: deleteFile } = useDeleteFile()
  const { triggerDownload } = useVaultNodeDetail(file.id, VaultNodeType.File)

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Rename modal */}
      <RenameFileModal
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        fileId={file.id}
        projectId={file.projectId}
        folderId={file.folderId ?? null}
        currentName={file.name}
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <File className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{file.name}</h3>
          <p className="text-xs text-muted-foreground">{file.mimeType}</p>
        </div>
      </div>

      {/* Actions */}
      <VaultDetailActions
        type="FILE"
        onRename={() => setIsRenameOpen(true)}
        onDelete={() => {
          if (window.confirm(`Delete "${file.name}"? This cannot be undone.`)) {
            deleteFile({
              fileId: file.id,
              projectId: file.projectId,
              folderId: file.folderId ?? null,
            })
            onClose()
          }
        }}
        onDownload={triggerDownload}
      />

      {/* Metadata */}
      <VaultDetailMeta node={file} type="FILE" />
    </div>
  )
}
