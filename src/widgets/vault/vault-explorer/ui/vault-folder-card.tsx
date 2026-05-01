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
            ? 'border-accent-subtle bg-accent-subtle'
            : 'border-subtle hover:border-subtle-1 hover:shadow-raised-100 bg-layer-1',
        )}
      >
        {/* Preview area */}
        <div
          className={cn(
            'relative flex h-32 items-center justify-center transition-colors duration-150',
            isSelected ? 'bg-accent-subtle' : 'group-hover:bg-layer-2',
          )}
          style={{
            backgroundColor: isSelected ? undefined : 'oklch(0.54 0.18 275 / 8%)',
          }}
        >
          <Folder
            className="h-16 w-16 drop-shadow-raised-100"
            style={{ color: 'var(--ext-violet-500)' }}
            strokeWidth={1.5}
          />
        </div>

        {/* Info bar */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Folder
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: 'var(--ext-violet-500)' }}
            strokeWidth={2}
          />
          <span className="flex-1 text-14 font-medium truncate leading-none text-primary">
            {folder.name}
          </span>
        </div>
      </div>
    </VaultFolderContextMenu>
  )
}
