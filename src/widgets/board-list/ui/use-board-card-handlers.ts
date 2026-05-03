import { useState } from 'react'
import { toast } from 'sonner'
import type { Board } from '@/entities/whiteboard-board'
import { useDeleteBoard } from '@/features/whiteboard/delete-board'
import { useArchiveBoard } from '@/features/whiteboard/archive-board'
import { useUnarchiveBoard } from '@/features/whiteboard/unarchive-board'
import { useLockBoard } from '@/features/whiteboard/lock-board'
import { useUnlockBoard } from '@/features/whiteboard/unlock-board'
import { useRenameBoard } from '@/features/whiteboard/rename-board'

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
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settingsDefaultTab, setSettingsDefaultTab] = useState<
    'general' | 'members' | 'settings'
  >('general')

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

  // Handler: Manage Collaborators — opens settings modal at Members tab
  const handleManageCollaborators = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setSettingsDefaultTab('members')
    setShowSettingsModal(true)
  }

  // Handler: Board Settings — opens settings modal at General tab
  const handleSettings = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setSettingsDefaultTab('general')
    setShowSettingsModal(true)
  }

  // Handler: Archive/Unarchive
  const handleArchive = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setShowArchiveDialog(true)
  }

  const handleArchiveConfirm = () => {
    archiveBoard.mutate(board.id)
    setShowArchiveDialog(false)
  }

  const handleUnarchive = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setShowUnarchiveDialog(true)
  }

  const handleUnarchiveConfirm = () => {
    unarchiveBoard.mutate(board.id)
    setShowUnarchiveDialog(false)
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
      handleArchiveConfirm,
      handleUnarchive,
      handleUnarchiveConfirm,
      handleDelete,
      handleDeleteConfirm,
    },
    state: {
      showRenameDialog,
      setShowRenameDialog,
      showDeleteDialog,
      setShowDeleteDialog,
      showArchiveDialog,
      setShowArchiveDialog,
      showUnarchiveDialog,
      setShowUnarchiveDialog,
      showSettingsModal,
      setShowSettingsModal,
      settingsDefaultTab,
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
