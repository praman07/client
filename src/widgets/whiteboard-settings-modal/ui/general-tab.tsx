import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Board } from '@/entities/whiteboard-board'
import { useRenameBoard } from '@/features/whiteboard/rename-board'
import { useUpdateDescription } from '@/features/whiteboard/update-description'
import { Input } from '@/shared/ui/primitives/input'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { usePermission } from '@/shared/lib/auth/use-permission'

interface GeneralTabProps {
  board: Board
  onClose: () => void
}

/**
 * General tab for WhiteboardSettingsModal.
 *
 * - `whiteboard:update` → inline-editable title + description, click to edit
 * - No permission → read-only display of board metadata
 */
export function GeneralTab({ board, onClose }: GeneralTabProps) {
  const canUpdate = usePermission('whiteboard:update')

  // ── Title inline edit
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(board.title)
  const renameBoard = useRenameBoard()

  // ── Description inline edit
  const [editingDesc, setEditingDesc] = useState(false)
  const [descValue, setDescValue] = useState(board.description ?? '')
  const updateDescription = useUpdateDescription()

  // ── Handlers
  const handleTitleConfirm = async () => {
    const next = titleValue.trim()
    if (!next || next === board.title) {
      setTitleValue(board.title)
      setEditingTitle(false)
      return
    }
    try {
      await renameBoard.mutateAsync({ boardId: board.id, title: next })
      toast.success('Board renamed')
    } catch {
      toast.error('Failed to rename board')
      setTitleValue(board.title)
    } finally {
      setEditingTitle(false)
    }
  }

  const handleTitleCancel = () => {
    setTitleValue(board.title)
    setEditingTitle(false)
  }

  const handleDescConfirm = async () => {
    const next = descValue.trim()
    if (next === (board.description ?? '')) {
      setEditingDesc(false)
      return
    }
    try {
      await updateDescription.mutateAsync({
        boardId: board.id,
        description: next || undefined,
      })
      toast.success('Description updated')
    } catch {
      toast.error('Failed to update description')
      setDescValue(board.description ?? '')
    } finally {
      setEditingDesc(false)
    }
  }

  const handleDescCancel = () => {
    setDescValue(board.description ?? '')
    setEditingDesc(false)
  }

  return (
    <div className="space-y-5">
      {/* ── Board name ─────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
          Board name
        </p>

        {canUpdate && editingTitle ? (
          <div className="flex items-center gap-1.5">
            <Input
              id="board-title"
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleConfirm()
                if (e.key === 'Escape') handleTitleCancel()
              }}
              maxLength={128}
              className="flex-1"
              disabled={renameBoard.isPending}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-primary hover:text-primary hover:bg-primary/10"
              onClick={handleTitleConfirm}
              disabled={renameBoard.isPending}
              aria-label="Confirm rename"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={handleTitleCancel}
              disabled={renameBoard.isPending}
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            role={canUpdate ? 'button' : undefined}
            tabIndex={canUpdate ? 0 : undefined}
            onClick={() => canUpdate && setEditingTitle(true)}
            onKeyDown={(e) => {
              if (canUpdate && (e.key === 'Enter' || e.key === ' '))
                setEditingTitle(true)
            }}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors
              ${canUpdate ? 'hover:bg-muted/50 cursor-text' : 'cursor-default'}`}
          >
            <span className="flex-1 text-sm font-medium truncate">
              {board.title}
            </span>
            {canUpdate && (
              <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>

      {/* ── Description ────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
          Description
        </p>

        {canUpdate && editingDesc ? (
          <div className="space-y-2">
            <Textarea
              id="board-description"
              autoFocus
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleDescCancel()
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
                  handleDescConfirm()
              }}
              placeholder="What is this board about?"
              rows={3}
              maxLength={512}
              className="resize-none w-full"
              disabled={updateDescription.isPending}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDescCancel}
                disabled={updateDescription.isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDescConfirm}
                disabled={updateDescription.isPending}
              >
                {updateDescription.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <div
            role={canUpdate ? 'button' : undefined}
            tabIndex={canUpdate ? 0 : undefined}
            onClick={() => canUpdate && setEditingDesc(true)}
            onKeyDown={(e) => {
              if (canUpdate && (e.key === 'Enter' || e.key === ' '))
                setEditingDesc(true)
            }}
            className={`group flex items-start gap-2 rounded-lg px-3 py-2 min-h-[3rem] transition-colors
              ${canUpdate ? 'hover:bg-muted/50 cursor-text' : 'cursor-default'}`}
          >
            {board.description ? (
              <p className="flex-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {board.description}
              </p>
            ) : (
              <p className="flex-1 text-sm text-muted-foreground italic">
                {canUpdate ? 'Click to add a description…' : 'No description'}
              </p>
            )}
            {canUpdate && (
              <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>

      {/* ── Read-only metadata ─────────────────────── */}
      <div className="rounded-lg border border-border/50 divide-y divide-border/50 text-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-muted-foreground">Elements</span>
          <span className="font-medium tabular-nums">
            {board.elementCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-muted-foreground">File size</span>
          <span className="font-medium tabular-nums">
            {(Number(board.fileSizeBytes) / 1024).toFixed(1)} KB
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium">
            {board.isArchived ? 'Archived' : board.isLocked ? 'Locked' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  )
}
