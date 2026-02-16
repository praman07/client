import { useState } from 'react'
import { toast } from 'sonner'
import { useDeleteBoard } from '@/features/whiteboard/delete-board/hooks'
import { useArchiveBoard } from '@/features/whiteboard/archive-board/hooks'
import { useUnarchiveBoard } from '@/features/whiteboard/unarchive-board/hooks'
import { useLockBoard } from '@/features/whiteboard/lock-board/hooks'
import { useUnlockBoard } from '@/features/whiteboard/unlock-board/hooks'
import { useRenameBoard } from '@/features/whiteboard/rename-board/hooks'
import type { Board } from '@/entities/whiteboard-board'

interface UseBoardCardHandlersOptions {
  board: Board
  workspaceSlug: string
  projectSlug: string
}

/**
 * Custom hook for board card handlers and state management
 *
 * Encapsulates all mutation logic and modal state for board card actions
 */
export function useBoardCardHandlers({
  board,
  workspaceSlug,
  projectSlug,
}: UseBoardCardHandlersOptions) {
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
  const [showAddCollaboratorsDialog, setShowAddCollaboratorsDialog] =
    useState(false)

  // Handler: Rename Board
  const handleRename = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setShowRenameDialog(true)
  }

  const handleRenameSubmit = async (newName: string) => {
    try {
      await renameBoard.mutateAsync({
        boardId: board.id,
        title: newName,
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
    toast.success('Link copied to clipboard')
  }

  // Handler: Duplicate Board
  const handleDuplicate = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    toast.info('Duplicate feature coming soon')
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
    setShowAddCollaboratorsDialog(true)
  }

  // Handler: Board Settings
  const handleSettings = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    toast.info('Settings feature coming soon')
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

  return {
    handlers: {
      handleRename,
      handleRenameSubmit,
      handleCopyLink,
      handleDuplicate,
      handleLock,
      handleUnlock,
      handleManageCollaborators,
      handleSettings,
      handleArchive,
      handleUnarchive,
      handleDelete,
      handleDeleteConfirm,
    },
    state: {
      showRenameDialog,
      setShowRenameDialog,
      showDeleteDialog,
      setShowDeleteDialog,
      showAddCollaboratorsDialog,
      setShowAddCollaboratorsDialog,
    },
    mutations: {
      deleteBoard,
      renameBoard,
      archiveBoard,
      unarchiveBoard,
      lockBoard,
      unlockBoard,
    },
  }
}
