import { Folder, Pin, PinOff } from 'lucide-react'
import type { VaultFolder } from '@/entities/vault-folder'
import { cn } from '@/shared/lib/utils'
import { usePinFolder } from '@/features/vault/pin-folder'
import { useUnpinFolder } from '@/features/vault/unpin-folder'

interface VaultFolderItemProps {
  folder: VaultFolder
  isActive: boolean
  isPinned?: boolean
  onClick: () => void
}

/**
 * Single folder row in the sidebar.
 * Shows a pin/unpin action on hover.
 *
 * @layer Widgets
 */
export function VaultFolderItem({
  folder,
  isActive,
  isPinned = false,
  onClick,
}: VaultFolderItemProps) {
  const { mutate: pin, isPending: pinning } = usePinFolder()
  const { mutate: unpin, isPending: unpinning } = useUnpinFolder()

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-13 transition-colors text-left',
        isActive
          ? 'bg-layer-1-selected text-primary font-medium'
          : 'text-secondary bg-layer-transparent hover:bg-layer-transparent-hover hover:text-primary',
      )}
    >
      <Folder className="h-4 w-4 shrink-0 text-icon-secondary" />
      <span className="flex-1 truncate">{folder.name}</span>

      {/* Pin toggle — visible on hover */}
      {!folder.isSystem && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            if (isPinned) {
              unpin({ folderId: folder.id, projectId: folder.projectId })
            } else {
              pin({ folderId: folder.id, projectId: folder.projectId })
            }
          }}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xs p-0.5 hover:bg-layer-1',
            (pinning || unpinning) && 'opacity-50 pointer-events-none',
          )}
        >
          {isPinned ? (
            <PinOff className="h-3 w-3 text-icon-secondary" />
          ) : (
            <Pin className="h-3 w-3 text-icon-secondary" />
          )}
        </span>
      )}
    </button>
  )
}
