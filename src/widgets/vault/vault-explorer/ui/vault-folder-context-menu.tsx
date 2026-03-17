import { Pencil, Pin, PinOff, Trash2 } from 'lucide-react'
import React from 'react'
import type { VaultFolder } from '@/entities/vault-folder'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/primitives/context-menu'
import { useDeleteFolder } from '@/features/vault/delete-folder'
import { usePinFolder } from '@/features/vault/pin-folder'
import { useUnpinFolder } from '@/features/vault/unpin-folder'

interface VaultFolderContextMenuProps {
  folder: VaultFolder
  projectId: string
  onRename?: () => void
  children: React.ReactNode
}

/**
 * Right-click context menu for vault folder cards.
 * Rename is handled by parent component via optional callback.
 * @layer Widgets
 */
export function VaultFolderContextMenu({
  folder,
  projectId,
  onRename,
  children,
}: VaultFolderContextMenuProps) {
  const { mutate: deleteFolder } = useDeleteFolder()
  const { mutate: pin } = usePinFolder()
  const { mutate: unpin } = useUnpinFolder()

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
        <ContextMenuItem
          onClick={() => pin({ folderId: folder.id, projectId })}
        >
          <Pin className="h-4 w-4 mr-2" />
          Pin to sidebar
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => unpin({ folderId: folder.id, projectId })}
        >
          <PinOff className="h-4 w-4 mr-2" />
          Unpin from sidebar
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            if (
              window.confirm(`Delete "${folder.name}" and all its contents?`)
            ) {
              deleteFolder({
                folderId: folder.id,
                cascade: true,
                projectId,
                parentFolderId: folder.parentFolderId ?? null,
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
