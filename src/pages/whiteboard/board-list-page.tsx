import { ErrorBoundary } from 'react-error-boundary'
import { BoardList } from '@/widgets/board-list'
import { WidgetError } from '@/shared/ui'

interface BoardListPageProps {
  workspaceId: string
  projectId: string
}

/**
 * Board List Page
 *
 * Gallery view of all whiteboards in the project
 * Full-screen layout with BoardList widget
 */
export function BoardListPage({ workspaceId, projectId }: BoardListPageProps) {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        <ErrorBoundary FallbackComponent={WidgetError}>
          <BoardList workspaceId={workspaceId} projectId={projectId} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
