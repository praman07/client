import { useRouterState } from '@tanstack/react-router'
import { useBoardCardHandlers } from './use-board-card-handlers'
import { BoardCardContextMenu } from './board-card-context-menu'
import { BoardCardListView } from './board-card-list-view'
import { BoardCardGridView } from './board-card-grid-view'
import { RenameBoardDialog } from '@/features/whiteboard/rename-board'
import { DeleteBoardDialog } from '@/features/whiteboard/delete-board'
import { ArchiveBoardDialog } from '@/features/whiteboard/archive-board'
import { AddCollaboratorsDialog } from '@/features/whiteboard/add-collaborators'
import { useBoardCollaborators } from '@/features/whiteboard/add-collaborators/hooks'
import { useWorkspaceMembers } from '@/features/view-members/hooks'
import type { ViewMode } from '../hooks'
import type { Board } from '@/entities/whiteboard-board'

interface BoardCardProps {
  board: Board
  viewMode: ViewMode
  isCreator: boolean
}

/**
 * Individual board card with context menu
 *
 * Features:
 * - Right-click context menu with all board actions
 * - Keyboard shortcuts
 * - Rename, copy link, duplicate, lock/unlock, settings, archive, delete
 */
export function BoardCard({ board, viewMode, isCreator }: BoardCardProps) {
  // Data fetching for collaborators
  const { data: workspaceMembersData } = useWorkspaceMembers(board.workspaceId)
  const { data: collaboratorsData } = useBoardCollaborators(board.id)

  const workspaceMembers = (workspaceMembersData?.workspaceMembers || []) as any
  const currentCollaboratorIds =
    collaboratorsData?.boardCollaborators?.map((c: any) => c.userId) || []

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

      {/* Add Collaborators Dialog */}
      <AddCollaboratorsDialog
        boardId={board.id}
        workspaceMembers={workspaceMembers}
        currentCollaboratorIds={currentCollaboratorIds}
        open={state.showAddCollaboratorsDialog}
        onOpenChange={state.setShowAddCollaboratorsDialog}
      />
    </>
  )
}
