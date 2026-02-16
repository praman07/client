import { WhiteboardCanvasV2 } from '@/widgets/whiteboard-canvas'
import { CollaborationSidebar } from '@/widgets/collaboration-sidebar'
import { SidebarProvider } from '@/shared/ui/primitives/sidebar'

interface BoardViewPageProps {
  boardId: string
}

/**
 * Whiteboard board view page
 *
 * Layout:
 * - Canvas (full remaining height after header)
 * - Collapsible collaboration sidebar (right)
 *
 * Note: This page is rendered within _app layout which has a header.
 * The h-full class makes it take the remaining space after the header.
 */
export function BoardViewPage({ boardId }: BoardViewPageProps) {
  return (
    <div className="h-full w-full flex overflow-hidden bg-background relative">
      <SidebarProvider defaultOpen={true}>
        {/* Canvas - Takes remaining space */}
        <div className="flex-1 relative">
          <WhiteboardCanvasV2 boardId={boardId} />
        </div>

        {/* Collaboration Sidebar - Collapsible, positioned absolute to respect parent height */}
        <div className="relative">
          <CollaborationSidebar boardId={boardId} />
        </div>
      </SidebarProvider>
    </div>
  )
}
