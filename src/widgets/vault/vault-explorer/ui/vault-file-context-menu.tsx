import { Download, Pencil, Trash2 } from 'lucide-react'
import type { VaultFile } from '@/entities/vault-file'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/primitives/context-menu'
import { useDeleteFile } from '@/features/vault/delete-file'

interface VaultFileContextMenuProps {
  file: VaultFile
  projectId: string
  onRename?: () => void
  onDownload?: () => void
  children: React.ReactNode
}

/**
 * Right-click context menu for vault file cards.
 * @layer Widgets
 */
export function VaultFileContextMenu({
  file,
  projectId,
  onRename,
  onDownload,
  children,
}: VaultFileContextMenuProps) {
  const { mutate: deleteFile } = useDeleteFile()

  return (
    <ContextMenu>
      <ContextMenuTrigger render={<div>{children}</div>}></ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {onRename && (
          <ContextMenuItem onClick={onRename}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
        )}
        {onDownload && (
          <ContextMenuItem onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            if (window.confirm(`Delete "${file.name}"?`)) {
              deleteFile({
                fileId: file.id,
                projectId,
                folderId: file.folderId ?? null,
              })
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
