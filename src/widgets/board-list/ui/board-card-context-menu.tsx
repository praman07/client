import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/shared/ui/primitives/context-menu'
import {
  Pencil,
  Link2,
  Copy,
  Lock,
  Unlock,
  Users,
  Settings,
  Archive,
  ArchiveRestore,
  Trash2,
} from 'lucide-react'
import type { Board } from '@/entities/whiteboard-board'

interface BoardCardContextMenuProps {
  children: React.ReactNode
  board: Board
  handlers: {
    handleRename: (e?: React.MouseEvent) => void
    handleCopyLink: (e?: React.MouseEvent) => void
    handleDuplicate: (e?: React.MouseEvent) => void
    handleLock: (e?: React.MouseEvent) => void
    handleUnlock: (e?: React.MouseEvent) => void
    handleManageCollaborators: (e?: React.MouseEvent) => void
    handleSettings: (e?: React.MouseEvent) => void
    handleArchive: (e?: React.MouseEvent) => void
    handleUnarchive: (e?: React.MouseEvent) => void
    handleDelete: (e?: React.MouseEvent) => void
  }
}

/**
 * Context menu for board card actions
 * 
 * Shared between list and grid views
 */
export function BoardCardContextMenu({
  children,
  board,
  handlers,
}: BoardCardContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={handlers.handleRename}>
          <Pencil className="h-4 w-4 mr-2" />
          Rename
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={handlers.handleCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
          <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handlers.handleDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>

        {board.isLocked ? (
          <ContextMenuItem onClick={handlers.handleUnlock}>
            <Unlock className="h-4 w-4 mr-2" />
            Unlock
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={handlers.handleLock}>
            <Lock className="h-4 w-4 mr-2" />
            Lock
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handlers.handleManageCollaborators}>
          <Users className="h-4 w-4 mr-2" />
          Manage Collaborators
        </ContextMenuItem>

        <ContextMenuItem onClick={handlers.handleSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </ContextMenuItem>

        <ContextMenuSeparator />

        {board.isArchived ? (
          <ContextMenuItem onClick={handlers.handleUnarchive}>
            <ArchiveRestore className="h-4 w-4 mr-2" />
            Unarchive
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={handlers.handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </ContextMenuItem>
        )}

        <ContextMenuItem
          onClick={handlers.handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
