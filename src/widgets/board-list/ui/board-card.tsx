import { useRouterState } from '@tanstack/react-router'
import { useBoardCardHandlers } from './use-board-card-handlers'
import { BoardCardContextMenu } from './board-card-context-menu'
import { BoardCardListView } from './board-card-list-view'
import { BoardCardGridView } from './board-card-grid-view'
import type { ViewMode } from '../hooks'
import type { Board } from '@/entities/whiteboard-board'
import { RenameBoardDialog } from '@/features/whiteboard/rename-board'
import { DeleteBoardDialog } from '@/features/whiteboard/delete-board'
import { ArchiveBoardDialog } from '@/features/whiteboard/archive-board'
import { WhiteboardSettingsModal } from '@/widgets/whiteboard-settings-modal'

interface BoardCardProps {
  board: Board
  viewMode: ViewMode
  isCreator: boolean
}

/**
 * Individual board card with context menu.
 *
 * Features:
 * - Right-click context menu with all board actions
 * - Rename, copy link, duplicate, lock/unlock, archive, delete
 * - Settings modal (3-tab: General / Members / Settings)
 */
export function BoardCard({ board, viewMode, isCreator }: BoardCardProps) {
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

  // Get handlers and state from custom hook
  const { handlers, state, mutations } = useBoardCardHandlers({
    board,
    workspaceSlug,
    projectSlug,
  })

  // Select view component based on viewMode
  const ViewComponent =
    viewMode === 'list' ? BoardCardListView : BoardCardGridView

  return (
    <>
      <BoardCardContextMenu
        board={board}
        handlers={handlers}
        isCreator={isCreator}
      >
        <ViewComponent
          board={board}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          onOpenMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlers.handleSettings(e)
          }}
        />
      </BoardCardContextMenu>

      {/* Rename Dialog */}
      <RenameBoardDialog
        board={board}
        open={state.showRenameDialog}
        onOpenChange={state.setShowRenameDialog}
        onSubmit={handlers.handleRenameSubmit}
        isPending={mutations.renameBoard.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBoardDialog
        boardTitle={board.title}
        open={state.showDeleteDialog}
        onOpenChange={state.setShowDeleteDialog}
        onConfirm={handlers.handleDeleteConfirm}
        isPending={mutations.deleteBoard.isPending}
      />

      {/* Archive Confirmation Dialog */}
      <ArchiveBoardDialog
        boardTitle={board.title}
        open={state.showArchiveDialog}
        onOpenChange={state.setShowArchiveDialog}
        onConfirm={handlers.handleArchiveConfirm}
        isPending={mutations.archiveBoard.isPending}
      />

      {/* Unarchive Confirmation Dialog */}
      <ArchiveBoardDialog
        boardTitle={board.title}
        open={state.showUnarchiveDialog}
        onOpenChange={state.setShowUnarchiveDialog}
        onConfirm={handlers.handleUnarchiveConfirm}
        isPending={mutations.unarchiveBoard.isPending}
      />

      {/* Centralised Settings Modal (General / Members / Settings tabs) */}
      <WhiteboardSettingsModal
        board={board}
        isCreator={isCreator}
        open={state.showSettingsModal}
        onOpenChange={state.setShowSettingsModal}
        defaultTab={state.settingsDefaultTab}
      />
    </>
  )
}
