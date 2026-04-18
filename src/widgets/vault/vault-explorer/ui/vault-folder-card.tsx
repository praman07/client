import { Folder } from 'lucide-react'
import { VaultFolderContextMenu } from './vault-folder-context-menu'
import type { VaultFolder } from '@/entities/vault-folder'
import { cn } from '@/shared/lib/utils'

interface VaultFolderCardProps {
  folder: VaultFolder
  onOpen: () => void
  onSelect: () => void
  onRename?: () => void
  isSelected: boolean
  projectId: string
}

/**
 * Folder grid card — Google Drive style.
 * Single-click to select, double-click to open, right-click for context menu.
 * @layer Widgets
 */
export function VaultFolderCard({
  folder,
  onOpen,
  onSelect,
  onRename,
  isSelected,
  projectId,
}: VaultFolderCardProps) {
  return (
    <VaultFolderContextMenu
      folder={folder}
      projectId={projectId}
      onRename={onRename}
    >
      <div
        onClick={onSelect}
        onDoubleClick={onOpen}
        className={cn(
          'group flex flex-col rounded-xl cursor-pointer select-none transition-all duration-150 overflow-hidden border',
          isSelected
            ? 'border-accent-subtle ring-2 ring-accent-subtle bg-accent-subtle'
            : 'border-subtle/50 hover:border-subtle hover:shadow-md bg-layer-1',
        )}
      >
        {/* Preview area */}
        <div
          className={cn(
            'relative flex h-32 items-center justify-center bg-sky-500/10 transition-colors duration-150',
            !isSelected && 'group-hover:bg-sky-500/15',
          )}
        >
          <Folder
            className="h-16 w-16 text-sky-500 drop-shadow-sm"
            strokeWidth={1.5}
          />
        </div>

        {/* Info bar */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Folder
            className="h-3.5 w-3.5 shrink-0 text-sky-500"
            strokeWidth={2}
          />
          <span className="flex-1 text-sm font-medium truncate leading-none">
            {folder.name}
          </span>
          {/* <button
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="shrink-0 rounded-md p-1 opacity-0 group-hover:opacity-100 hover:bg-layer-1 transition-opacity duration-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-secondary" />
          </button> */}
        </div>
      </div>
    </VaultFolderContextMenu>
  )
}
