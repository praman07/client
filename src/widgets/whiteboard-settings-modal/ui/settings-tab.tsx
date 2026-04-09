import { useState } from 'react'
import { Archive, ArchiveRestore, Trash2, Lock } from 'lucide-react'
import { useArchiveBoard } from '@/features/whiteboard/archive-board'
import { useUnarchiveBoard } from '@/features/whiteboard/unarchive-board'
import { DeleteBoardDialog } from '@/features/whiteboard/delete-board'
import { ArchiveBoardDialog } from '@/features/whiteboard/archive-board'
import type { Board } from '@/entities/whiteboard-board'
import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'
import { usePermission } from '@/shared/lib/auth/use-permission'

interface SettingsTabProps {
  board: Board
  isCreator: boolean
  onClose: () => void
}

/**
 * Settings (danger-zone) tab for WhiteboardSettingsModal.
 *
 * Permission gates:
 * - `whiteboard:archive` → archive / unarchive action
 * - `whiteboard:delete`  → delete action (creator-only check is advisory; server enforces)
 *
 * If the user has neither permission, shows a locked state.
 */
export function SettingsTab({ board, isCreator, onClose }: SettingsTabProps) {
  const canArchive = usePermission('whiteboard:archive')
  const canDelete = usePermission('whiteboard:delete')

  const archiveBoard = useArchiveBoard()
  const unarchiveBoard = useUnarchiveBoard()

  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleArchiveConfirm = () => {
    archiveBoard.mutate(board.id)
    setShowArchiveDialog(false)
    onClose()
  }

  const handleUnarchiveConfirm = () => {
    unarchiveBoard.mutate(board.id)
    setShowArchiveDialog(false)
    onClose()
  }

  // ── No actions available ──────────────────────────────
  if (!canArchive && !canDelete) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <Lock className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          You don't have permission to manage board settings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Archive / Unarchive ────────────────────────── */}
      {canArchive && (
        <div className="rounded-lg border border-border/60 p-4 space-y-2">
          <h4 className="text-sm font-semibold">
            {board.isArchived ? 'Restore board' : 'Archive board'}
          </h4>
          <p className="text-xs text-muted-foreground">
            {board.isArchived
              ? 'Restore this board to make it active again.'
              : 'Archived boards are hidden from the main board list. You can restore them later.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 mt-1"
            onClick={() => setShowArchiveDialog(true)}
            disabled={archiveBoard.isPending || unarchiveBoard.isPending}
          >
            {board.isArchived ? (
              <ArchiveRestore className="h-4 w-4" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
            {board.isArchived ? 'Restore' : 'Archive'}
          </Button>
        </div>
      )}

      {/* ── Delete — permission + creator only ────────── */}
      {canDelete && isCreator && (
        <>
          {canArchive && <Separator />}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
            <h4 className="text-sm font-semibold text-destructive">
              Delete board
            </h4>
            <p className="text-xs text-muted-foreground">
              Permanently delete this board and all its content. This cannot be
              undone.
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 mt-1"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete board
            </Button>
          </div>
        </>
      )}

      {/* ── canDelete but not isCreator — informational ── */}
      {canDelete && !isCreator && (
        <>
          {canArchive && <Separator />}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">
              Only the board creator can delete this board.
            </p>
          </div>
        </>
      )}

      {/* ── Dialogs ───────────────────────────────────── */}
      <ArchiveBoardDialog
        boardTitle={board.title}
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        onConfirm={board.isArchived ? handleUnarchiveConfirm : handleArchiveConfirm}
        isPending={archiveBoard.isPending || unarchiveBoard.isPending}
      />

      <DeleteBoardDialog
        boardTitle={board.title}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          setShowDeleteDialog(false)
          onClose()
        }}
        isPending={false}
      />
    </div>
  )
}
