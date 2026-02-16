import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { BoardThumbnail } from './board-thumbnail'
import { formatDistanceToNow } from 'date-fns'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/shared/ui/primitives/context-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { useDeleteBoard } from '@/features/whiteboard/delete-board/hooks'
import { useArchiveBoard } from '@/features/whiteboard/archive-board/hooks'
import { useUnarchiveBoard } from '@/features/whiteboard/unarchive-board/hooks'
import { useLockBoard } from '@/features/whiteboard/lock-board/hooks'
import { useUnlockBoard } from '@/features/whiteboard/unlock-board/hooks'
import { useRenameBoard } from '@/features/whiteboard/rename-board/hooks'
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
import { toast } from 'sonner'
import type { ViewMode } from '../hooks'
import type { Board } from '@/entities/whiteboard-board'

interface BoardCardProps {
  board: Board
  viewMode: ViewMode
}

/**
 * Individual board card with context menu
 *
 * Features:
 * - Right-click context menu with all board actions
 * - Keyboard shortcuts
 * - Rename, copy link, duplicate, lock/unlock, settings, archive, delete
 */
export function BoardCard({ board, viewMode }: BoardCardProps) {
  // Mutations
  const deleteBoard = useDeleteBoard()
  const archiveBoard = useArchiveBoard()
  const unarchiveBoard = useUnarchiveBoard()
  const lockBoard = useLockBoard()
  const unlockBoard = useUnlockBoard()
  const renameBoard = useRenameBoard()

  // Modal states
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newBoardName, setNewBoardName] = useState(board.title)

  // Get route params from router state matches
  const routerState = useRouterState()
  const currentMatch = routerState.matches.find(
    (match) =>
      match.routeId === '/_app/workspace/$workspaceSlug/project/$projectSlug',
  )
  const { workspaceSlug, projectSlug } = (currentMatch?.params ?? {}) as {
    workspaceSlug: string
    projectSlug: string
  }

  // Handler: Rename Board
  const handleRename = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setNewBoardName(board.title)
    setShowRenameDialog(true)
  }

  const handleRenameSubmit = async () => {
    if (newBoardName.trim() === board.title.trim()) {
      setShowRenameDialog(false)
      return
    }
    try {
      await renameBoard.mutateAsync({
        boardId: board.id,
        title: newBoardName.trim(),
      })
      toast.success('Board renamed successfully')
      setShowRenameDialog(false)
    } catch (error) {
      toast.error('Failed to rename board')
    }
  }

  // Handler: Copy Link
  const handleCopyLink = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const url = `${window.location.origin}/workspace/${workspaceSlug}/project/${projectSlug}/whiteboard/${board.id}`
    navigator.clipboard.writeText(url)
    toast.success('Board link copied to clipboard')
  }

  // Handler: Duplicate Board
  const handleDuplicate = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    // TODO: Implement duplicate feature
    toast.info('Duplicate board feature coming soon')
  }

  // Handler: Lock/Unlock
  const handleLock = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    lockBoard.mutate(board.id)
  }

  const handleUnlock = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    unlockBoard.mutate(board.id)
  }

  // Handler: Manage Collaborators
  const handleManageCollaborators = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    // TODO: Implement collaborators dialog
    toast.info('Manage collaborators feature coming soon')
  }

  // Handler: Board Settings
  const handleSettings = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    // TODO: Navigate to board settings or open modal
    toast.info('Board settings coming soon')
  }

  // Handler: Archive/Unarchive
  const handleArchive = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    archiveBoard.mutate(board.id)
  }

  const handleUnarchive = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    unarchiveBoard.mutate(board.id)
  }

  // Handler: Delete
  const handleDelete = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    deleteBoard.mutate(board.id)
    setShowDeleteDialog(false)
  }

  // Render list view
  if (viewMode === 'list') {
    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <Link
              to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
              params={{
                workspaceSlug,
                projectSlug,
                boardId: board.id,
              }}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
            >
              <div className="w-32 shrink-0">
                <BoardThumbnail
                  boardId={board.id}
                  thumbnail={board.thumbnail}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{board.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(board.updatedAt))} ago
                </p>
              </div>
            </Link>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuItem onClick={handleRename}>
              <Pencil className="h-4 w-4 mr-2" />
              Rename
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem onClick={handleCopyLink}>
              <Link2 className="h-4 w-4 mr-2" />
              Copy Link
              <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>

            {board.isLocked ? (
              <ContextMenuItem onClick={handleUnlock}>
                <Unlock className="h-4 w-4 mr-2" />
                Unlock
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={handleLock}>
                <Lock className="h-4 w-4 mr-2" />
                Lock
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            <ContextMenuItem onClick={handleManageCollaborators}>
              <Users className="h-4 w-4 mr-2" />
              Manage Collaborators
            </ContextMenuItem>

            <ContextMenuItem onClick={handleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Board Settings
            </ContextMenuItem>

            <ContextMenuSeparator />

            {board.isArchived ? (
              <ContextMenuItem onClick={handleUnarchive}>
                <ArchiveRestore className="h-4 w-4 mr-2" />
                Unarchive
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
                <ContextMenuShortcut>⌘E</ContextMenuShortcut>
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            <ContextMenuItem onClick={handleDelete} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
              <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {/* Rename Dialog */}
        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Board</DialogTitle>
              <DialogDescription>
                Enter a new name for this board
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit()
                    if (e.key === 'Escape') setShowRenameDialog(false)
                  }}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRenameDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenameSubmit}
                disabled={!newBoardName.trim() || renameBoard.isPending}
              >
                {renameBoard.isPending ? 'Renaming...' : 'Rename'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Board</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{board.title}"? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteBoard.isPending}
              >
                {deleteBoard.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Grid view
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link
            to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
            params={{
              workspaceSlug,
              projectSlug,
              boardId: board.id,
            }}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
          >
            <BoardThumbnail boardId={board.id} thumbnail={board.thumbnail} />

            <div className="p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{board.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(board.updatedAt))} ago
                </p>
              </div>
            </div>
          </Link>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={handleRename}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem onClick={handleCopyLink}>
            <Link2 className="h-4 w-4 mr-2" />
            Copy Link
            <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>

          {board.isLocked ? (
            <ContextMenuItem onClick={handleUnlock}>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={handleLock}>
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </ContextMenuItem>
          )}

          <ContextMenuSeparator />

          <ContextMenuItem onClick={handleManageCollaborators}>
            <Users className="h-4 w-4 mr-2" />
            Manage Collaborators
          </ContextMenuItem>

          <ContextMenuItem onClick={handleSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Board Settings
          </ContextMenuItem>

          <ContextMenuSeparator />

          {board.isArchived ? (
            <ContextMenuItem onClick={handleUnarchive}>
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Unarchive
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={handleArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
          )}

          <ContextMenuSeparator />

          <ContextMenuItem onClick={handleDelete} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
            <DialogDescription>
              Enter a new name for this board
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="board-name-grid">Board Name</Label>
              <Input
                id="board-name-grid"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit()
                  if (e.key === 'Escape') setShowRenameDialog(false)
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={!newBoardName.trim() || renameBoard.isPending}
            >
              {renameBoard.isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{board.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteBoard.isPending}
            >
              {deleteBoard.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
