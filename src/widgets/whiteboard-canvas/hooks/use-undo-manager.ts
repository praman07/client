import { useEffect } from 'react'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:undo-manager')

/**
 * Undo/Redo Manager (Simplified)
 *
 * In the refactored architecture, Excalidraw's built-in undo/redo
 * works automatically through the ExcalidrawBinding.
 *
 * This hook is kept as a stub for compatibility but can be removed.
 *
 * @param _boardId - Board ID (unused)
 * @param _setExcalidrawAPI - API setter (unused)
 */
export function useUndoManager(
  _boardId: string,
  _setExcalidrawAPI: ((api: ExcalidrawImperativeAPI) => void) | null,
) {
  useEffect(() => {
    log.debug('Undo manager: Using Excalidraw built-in undo/redo')
  }, [])

  // Excalidraw binding handles undo/redo automatically
  // No manual wiring needed
}
