import { useActiveCollaborators } from '@/entities/whiteboard-presence'
import { useSortedCollaborators } from '../hooks/use-sorted-collaborators'
import { CollaboratorItem } from './collaborator-item'
import { EmptyCollaborators } from './empty-collaborators'
import { Users, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { createLogger } from '@/shared/lib/logger'
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/shared/ui/primitives/sidebar'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'

const log = createLogger('whiteboard:sidebar')

interface CollaborationSidebarProps {
  boardId: string
}

/**
 * Collaboration sidebar showing active users on the board
 *
 * Features:
 * - Real-time presence tracking via WebSocket
 * - Activity indicators
 * - Cursor color preview
 * - Sorted by most recent activity
 * - Collapsible with toggle button
 *
 * @layer Widgets
 * @module collaboration-sidebar
 */
export function CollaborationSidebar(props: CollaborationSidebarProps) {
  // ✅ Use WebSocket-powered Redux state (NOT GraphQL query!)
  const { collaborators, count } = useActiveCollaborators()
  const { state, toggleSidebar } = useSidebar()

  // Debug log on collaborators change
  useEffect(() => {
    log.debug('👥 Collaborators state updated', {
      count,
      collaborators: collaborators.map((c) => ({
        userId: c.userId,
        fullName: c.fullName,
        color: c.color,
      })),
    })
  }, [collaborators, count])

  // Debug log on mount
  useEffect(() => {
    log.debug('🎨 CollaborationSidebar mounted', { boardId: props.boardId })
    return () => {
      log.debug('🧹 CollaborationSidebar unmounted')
    }
  }, [props.boardId])

  // Convert Redux state to sidebar format
  const mappedCollaborators = collaborators.map((c) => ({
    userId: c.userId,
    fullName: c.fullName || `User ${c.userId.slice(0, 8)}`,
    email: '', // Not tracked in presence state
    avatarUrl: c.avatarUrl ?? undefined,
    cursor: c.cursor
      ? { x: c.cursor.x, y: c.cursor.y, color: c.color }
      : { x: 0, y: 0, color: c.color },
    isActive: !c.isIdle,
    lastActivity: new Date(c.joinedAt),
  }))

  const sorted = useSortedCollaborators(mappedCollaborators)

  const isCollapsed = state === 'collapsed'

  return (
    <aside
      className="bg-sidebar text-sidebar-foreground flex h-full flex-col border-l"
      style={{ width: isCollapsed ? '3rem' : '16rem' }}
      data-state={state}
    >
      {/* Collapse Toggle */}
      <div className="absolute -left-6 top-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-6 w-6 p-0 rounded-full hover:bg-muted"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>

      {/* Header */}
      <SidebarHeader className="px-4 py-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Active Users</h3>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {count}
            </Badge>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {sorted.length === 0 ? (
              !isCollapsed && <EmptyCollaborators />
            ) : (
              <SidebarMenu>
                {sorted.map((collab) => (
                  <SidebarMenuItem key={collab.userId}>
                    {!isCollapsed ? (
                      <CollaboratorItem collaborator={collab} />
                    ) : (
                      // Collapsed view - just show avatar
                      <div className="flex justify-center py-1">
                        <div
                          className="h-8 w-8 rounded-full border-2"
                          style={
                            {
                              borderColor: collab.cursor.color,
                              backgroundImage: collab.avatarUrl
                                ? `url(${collab.avatarUrl})`
                                : undefined,
                              backgroundSize: 'cover',
                              backgroundColor: !collab.avatarUrl
                                ? '#ccc'
                                : undefined,
                            } as React.CSSProperties
                          }
                          title={collab.fullName}
                        />
                      </div>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </aside>
  )
}
