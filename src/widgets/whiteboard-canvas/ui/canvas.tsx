import '@excalidraw/excalidraw/index.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import { useWhiteboardSync } from '../hooks/use-whiteboard-sync'
import { useWhiteboardMediaLifecycle } from '../hooks/use-whiteboard-media-lifecycle'
import { CanvasCollaborators } from './canvas-collaborators'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { createVaultGenerateIdForFile } from '@/shared/lib/excalidraw'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:canvas')

interface WhiteboardCanvasProps {
  boardId: string
  /** When true, the canvas is read-only (board is locked). Default: false. */
  isReadOnly?: boolean
}

/**
 * Whiteboard Canvas — Full Media Lifecycle Integration
 *
 * System Design Decision: Complete Synchronization Lifecycle
 *   This singular orchestrator handles Y.Doc Initialization → IDB Persistence → Client Diff → WebSocket Sync → Excalidraw Binding.
 *
 * System Design Decision: Universal Image Interception
 *   Leverages `generateIdForFile` instead of DOM `onPaste` events to guarantee 100% intercept-coverage
 *   across all entry points (toolbar, drop zones, clipboard). Images are natively piped directly into the
 *   Vault proxy schema before touching the canvas.
 *
 * Design decisions:
 * - Dark theme is applied to match the Obsidian Architect design system.
 * - Collaboration UI (top-right avatar strip) replaces the legacy sidebar.
 * - `viewModeEnabled` respects the `isReadOnly` prop (locked boards).
 * - UIOptions hides the GitHub link clutter.
 */
export function WhiteboardCanvas({
  boardId,
  isReadOnly = false,
}: WhiteboardCanvasProps) {
  const excalidrawRef = useRef<HTMLDivElement>(null!)
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null)

  const { getToken } = useAuth()
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector(selectCurrentWorkspace)

  // Single hook orchestrates entire sync lifecycle.
  // isReadOnly prevents ExcalidrawBinding from being created in view mode.
  const { ydoc, binding, serverSynced, indexeddbSynced } = useWhiteboardSync(
    boardId,
    api,
    excalidrawRef,
    isReadOnly,
  )

  // Track image element removals → notify server to start cleanup timer
  useWhiteboardMediaLifecycle(ydoc, boardId)

  /**
   * System Design Decision: Safe Invocation Context
   * Aborts uploads entirely if the contextual shell (workspace/project) fails to load,
   * avoiding silent tracking failures.
   * // TODO (Architecture): Abstract context-readiness into a higher-order wrapper component to completely eliminate nullish branches here.
   */
  const handleGenerateIdForFile = useCallback(
    async (file: File): Promise<string> => {
      if (!api || !project || !workspace) {
        // Should not happen in practice — Excalidraw only calls this after mount
        throw new Error('Whiteboard not fully initialized')
      }
      return createVaultGenerateIdForFile({
        ydoc,
        boardId,
        projectId: project.id,
        workspaceId: workspace.id,
        excalidrawAPI: api,
        getToken: getToken as () => Promise<string | null>,
      })(file)
    },
    [api, ydoc, boardId, project, workspace, getToken],
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
        theme="dark"
        name="Collabifyy Whiteboard"
        isCollaborating={!!binding}
        viewModeEnabled={isReadOnly}
        generateIdForFile={isReadOnly ? undefined : handleGenerateIdForFile}
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
          },
        }}
        renderTopRightUI={() => <CanvasCollaborators />}
      />
    </div>
  )
}
