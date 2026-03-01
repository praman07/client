import { Folder, Pin, PinOff } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { usePinFolder } from '@/features/vault/pin-folder'
import { useUnpinFolder } from '@/features/vault/unpin-folder'
import type { VaultFolder } from '@/entities/vault-folder'

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
        'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left',
        isActive
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      )}
    >
      <Folder className="h-4 w-4 shrink-0" />
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
            'opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded p-0.5 hover:bg-accent',
            (pinning || unpinning) && 'opacity-50 pointer-events-none',
          )}
        >
          {isPinned ? (
            <PinOff className="h-3 w-3" />
          ) : (
            <Pin className="h-3 w-3" />
          )}
        </span>
      )}
    </button>
  )
}
