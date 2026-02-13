import '@excalidraw/excalidraw/index.css'
import { useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'

import { useBoard } from '@/features/whiteboard/fetch-board'
import { useBoardSnapshot } from '@/features/whiteboard/fetch-snapshot'
import { useReadOnlyMode } from '../hooks/use-read-only-mode'
import { useYDocInstance } from '@/entities/whiteboard-session'
import { useCanvasLifecycle } from '../hooks/use-canvas-lifecycle'
import { useYExcalidraw } from '../hooks/use-y-excalidraw'
import { useNetworkSync } from '../hooks/use-network-sync'
import { useSubscribeBoard } from '@/features/whiteboard/subscribe-board'
import { CursorOverlay } from '../ui/cursor-overlay'
import { ConnectionIndicator } from '../ui/connection-indicator'
import { SyncStatusBadge } from '../ui/sync-status-badge'

interface WhiteboardCanvasProps {
  boardId: string
}

export function WhiteboardCanvas({ boardId }: WhiteboardCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [bindingReady, setBindingReady] = useState(false)
  
  // Feature hooks
  const { data: board, isLoading: isBoardLoading } = useBoard(boardId)
  const { data: snapshot, isLoading: isSnapshotLoading } = useBoardSnapshot(boardId)
  const isReadOnly = useReadOnlyMode(boardId)
  
  // Get snapshot ready flag (prevents subscription race condition)
  const { snapshotReady } = useYDocInstance(boardId)
  
  // Widget hooks
  useCanvasLifecycle(boardId)
  
  // ✅ y-excalidraw library binding
  useYExcalidraw(boardId, excalidrawAPI, setBindingReady)
  
  // ✅ Network sync (Y.Doc → WebSocket)
  // CRITICAL: Only enable after binding is ready AND subscribed
  useNetworkSync(boardId, bindingReady && snapshotReady)
  
  // CRITICAL: Only subscribe after snapshot is applied
  // This prevents WebSocket deltas from arriving before snapshot
  useSubscribeBoard(boardId, { enabled: snapshotReady })
  
  // Loading state
  if (isBoardLoading || isSnapshotLoading) {
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
  
  console.info('[WhiteboardCanvas] Rendering canvas', {
    boardId,
    isReadOnly,
    hasSnapshot: !!snapshot,
  })
  
  // Note: Snapshot data needs to be applied to Y.Doc first
  // The binding hook will then sync to Excalidraw
  // For now, we let the Y.Doc initialization handle snapshot loading
  const initialData = undefined
  
  return (
    <div className="relative h-full w-full">
      {/* Main Canvas */}
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
        initialData={initialData}
        viewModeEnabled={isReadOnly}
        theme="light"
        name="Collabify Whiteboard"
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
