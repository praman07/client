import { useState } from 'react'
import { useUserBoards } from '@/features/whiteboard/fetch-user-boards'
import { CreateBoardModal } from '@/features/whiteboard/create-board'
import { useBoardFilters, useViewMode } from '../hooks'
import { sortBoards, filterBoards } from '../lib'
import { BoardCard } from './board-card'
import { BoardListHeader } from './board-list-header'
import { EmptyState } from './empty-state'
import { Button } from '@/shared/ui/primitives/button'
import { useAuth } from '@/shared/hooks'
import { Plus, Loader2 } from 'lucide-react'
import type { Board } from '@/entities/whiteboard-board'

interface BoardListProps {
  workspaceId: string
  projectId: string
}

/**
 * Board list gallery with search, filters, and CRUD operations
 *
 * Features:
 * - Grid/list view toggle
 * - Search boards by name
 * - Filter archived/active
 * - Sort by recent/name/oldest
 * - Create new boards
 */
export function BoardList({ workspaceId, projectId }: BoardListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { userId } = useAuth()
  const { data, isLoading, refetch } = useUserBoards(workspaceId, projectId)
  const {
    searchQuery,
    setSearchQuery,
    showArchived,
    setShowArchived,
    sortBy,
    setSortBy,
  } = useBoardFilters()
  const { viewMode, toggleViewMode } = useViewMode()

  // Extract boards from infinite query data
  // useUserBoards returns InfiniteQueryResult, data.pages is the array of page results
  const boards: Board[] =
    (data as any)?.pages?.flatMap((page: any) => {
      // Each page has shape: { userBoards: { boards: Board[], nextCursor: string | null } }
      return page.userBoards.boards.map((board: any) => ({
        id: board.id,
        workspaceId: board.workspaceId,
        createdBy: board.createdBy,
        projectId: board.projectId,
        title: board.title,
        description: board.description,
        thumbnail: board.thumbnail ?? null,
        elementCount: board.elementCount,
        fileSizeBytes: board.fileSizeBytes,
        isLocked: board.isLocked,
        isArchived: board.isArchived,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      }))
    }) ?? []

  // Apply filters and sorting
  const filteredBoards = filterBoards(boards, { searchQuery, showArchived })
  const sortedBoards = sortBoards(filteredBoards, sortBy)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (boards.length === 0) {
    return (
      <>
        <EmptyState />

        {/* FAB for creating first board */}
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>

        <CreateBoardModal
          workspaceId={workspaceId}
          projectId={projectId}
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={() => {
            refetch() // Refresh board list
          }}
        />
      </>
    )
  }

  return (
    <div className="p-6">
      <BoardListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
        showArchived={showArchived}
        onShowArchivedChange={setShowArchived}
      />

      {sortedBoards.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No boards found matching your filters</p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
          }
        >
          {sortedBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              viewMode={viewMode}
              isCreator={userId === board.createdBy}
            />
          ))}
        </div>
      )}

      {/* FAB for creating new board */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreateBoardModal
        workspaceId={workspaceId}
        projectId={projectId}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          refetch() // Refresh board list
        }}
      />
    </div>
  )
}
