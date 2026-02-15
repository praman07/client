import '@excalidraw/excalidraw/index.css'
import { useEffect, useRef } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'

import { useCollabV2 } from '../hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:canvas:v2')

interface WhiteboardCanvasV2Props {
  boardId: string
}

/**
 * V2 Whiteboard Canvas - Offline-First Architecture (Reference Pattern)
 *
 * Uses excalidraw-yjs-starter reference implementation:
 * - Single hook creates entire Y.js stack
 * - No waiting for sync (Y.js handles it)
 * - Stable dependencies prevent unnecessary recreates
 *
 * Phase 1: Pure offline (no network sync)
 * Phase 2: Add network sync via WebSocket
 */
export function WhiteboardCanvasV2({ boardId }: WhiteboardCanvasV2Props) {
  const excalidrawRef = useRef<HTMLDivElement>(null!)

  // Reference pattern: single hook for everything
  const { setApi, binding } = useCollabV2(excalidrawRef, boardId)

  // Lifecycle logging
  useEffect(() => {
    log.info('V2 Canvas state', {
      boardId,
      hasBinding: !!binding,
    })
    return () => log.debug('V2 Canvas unmounting', { boardId })
  }, [boardId, binding])

  return (
    <div ref={excalidrawRef} className="relative h-full w-full">
      {/* Main Canvas */}
      <Excalidraw
        excalidrawAPI={setApi}
        theme="light"
        name="Collabify Whiteboard V2"
        isCollaborating={!!binding}
        onPointerUpdate={binding?.onPointerUpdate}
      />

      {/* V2 Beta Badge */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-blue-100 border border-blue-400 text-blue-800 px-3 py-1 rounded-md text-xs font-medium">
          V2 (Offline-First)
        </div>
      </div>
    </div>
  )
}
