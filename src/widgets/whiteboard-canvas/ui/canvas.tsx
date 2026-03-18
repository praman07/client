import '@excalidraw/excalidraw/index.css'
import { useEffect, useRef, useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import { useWhiteboardSync } from '../hooks/use-whiteboard-sync'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:canvas')

interface WhiteboardCanvasProps {
  boardId: string
}

/**
 * Whiteboard Canvas - Clean Sequential Sync
 *
 * Uses single orchestration hook with clear state progression:
 * 1. Y.Doc creation (deterministic GUID)
 * 2. Server sync
 * 3. IndexedDB persistence
 * 4. Client diff calculation & send
 * 5. Network sync (WebSocket)
 * 6. Excalidraw binding
 */
export function WhiteboardCanvas({ boardId }: WhiteboardCanvasProps) {
  const excalidrawRef = useRef<HTMLDivElement>(null!)
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null)

  // Single hook orchestrates entire sync lifecycle
  const { binding, serverSynced, indexeddbSynced } = useWhiteboardSync(
    boardId,
    api,
    excalidrawRef,
  )

  // Debug logging
  useEffect(() => {
    log.debug('Canvas state', {
      boardId,
      hasBinding: !!binding,
      serverSynced,
      indexeddbSynced,
    })
  }, [boardId, binding, serverSynced, indexeddbSynced])

  return (
    <div ref={excalidrawRef} className="relative h-full w-full">
      <Excalidraw
        excalidrawAPI={setApi}
        theme="light"
        name="Collabify Whiteboard"
        isCollaborating={!!binding}
      />
    </div>
  )
}
