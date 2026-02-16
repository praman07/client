import '@excalidraw/excalidraw/index.css'
import { useEffect } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'

import { useBoard } from '@/features/whiteboard/fetch-board'
import { useReadOnlyMode } from '../hooks/use-read-only-mode'
import { useCanvasLifecycle } from '../hooks/use-canvas-lifecycle'
import { useWhiteboardSync } from '../hooks/use-whiteboard-sync'
import { useNetworkSync } from '../hooks/use-network-sync'
import { useFlushOfflineQueue } from '../hooks'
import { useUndoManager } from '../hooks/use-undo-manager'
import { CursorOverlay } from '../ui/cursor-overlay'
import { ConnectionIndicator } from '../ui/connection-indicator'
import { SyncStatusBadge } from '../ui/sync-status-badge'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:canvas')

interface WhiteboardCanvasProps {
  boardId: string
}

export function WhiteboardCanvas({ boardId }: WhiteboardCanvasProps) {
  // Component lifecycle
  useEffect(() => {
    log.info('Canvas mounted', { boardId })
    return () => log.debug('Canvas unmounting', { boardId })
  }, [boardId])

  // Feature hooks
  const { data: board, isLoading: isBoardLoading } = useBoard(boardId)
  const isReadOnly = useReadOnlyMode(boardId)

  // ✅ REFACTORED: Single unified sync hook
  const { setExcalidrawAPI, ydoc, binding, ready, snapshotReady } =
    useWhiteboardSync(boardId)

  log.debug('Sync state', {
    ready,
    snapshotReady,
    hasYDoc: !!ydoc,
    hasBinding: !!binding,
  })

  // Preserved hooks
  useUndoManager(boardId, setExcalidrawAPI)
  useFlushOfflineQueue(boardId)
  useCanvasLifecycle(boardId)

  // ✅ Network sync (Y.Doc → WebSocket)
  useNetworkSync(boardId, ydoc, ready)

  // Loading state - only check board metadata
  // ✅ FIX: Don't block on `ready` - creates circular dependency!
  // Excalidraw must render first to call setExcalidrawAPI → triggers init
  if (isBoardLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading board...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!board?.getBoard) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-muted-foreground">Failed to load board</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Main Canvas */}
      <Excalidraw
        excalidrawAPI={setExcalidrawAPI}
        viewModeEnabled={isReadOnly}
        theme="light"
        name="Collabify Whiteboard"
        isCollaborating={!!binding}
        onPointerUpdate={binding?.onPointerUpdate}
      />

      {/* Overlays */}
      <CursorOverlay boardId={boardId} />
      <ConnectionIndicator boardId={boardId} />
      <SyncStatusBadge boardId={boardId} />

      {/* Read-only banner */}
      {isReadOnly && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md">
            🔒 This board is locked. View only.
          </div>
        </div>
      )}
    </div>
  )
}
