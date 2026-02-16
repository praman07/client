import { useRouterState } from '@tanstack/react-router'
import { useBoardCardHandlers } from './use-board-card-handlers'
import { BoardCardContextMenu } from './board-card-context-menu'
import { BoardCardListView } from './board-card-list-view'
import { BoardCardGridView } from './board-card-grid-view'
import { RenameBoardDialog } from './board-card-rename-dialog'
import { DeleteBoardDialog } from './board-card-delete-dialog'
import { AddCollaboratorsDialog } from '@/features/whiteboard/add-collaborators'
import { useBoardCollaborators } from '@/features/whiteboard/add-collaborators/hooks'
import { useWorkspaceMembers } from '@/features/view-members/hooks'
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
      <BoardCardContextMenu board={board} handlers={handlers}>
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
