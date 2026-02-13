import { useEffect, useRef } from 'react'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import * as Y from 'yjs'
import { useYDocInstance } from '@/entities/whiteboard-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:y-excalidraw')

/**
 * y-excalidraw binding - production-ready CRDT sync
 *
 * Replaces custom binding with battle-tested library.
 * Handles all Y.js ↔ Excalidraw conversion automatically.
 *
 * @layer Widgets
 * @module whiteboard-canvas
 */
export function useYExcalidraw(
  boardId: string,
  excalidrawAPI: ExcalidrawImperativeAPI | null,
  onReady?: (ready: boolean) => void,
) {
  const { ydoc } = useYDocInstance(boardId)
  const bindingRef = useRef<ExcalidrawBinding | null>(null)

  useEffect(() => {
    if (!ydoc || !excalidrawAPI) return

    // Prevent re-creating binding if already exists
    if (bindingRef.current) {
      log.debug('⏭️ Binding already exists, skipping', { boardId })
      return
    }

    try {
      log.debug('🔗 Binding y-excalidraw', { boardId })

      // ✅ Simple approach: Always use Y.Array for elements
      // No migration - old snapshots are from buggy custom binding anyway
      // Just start fresh with correct structure
      const yElements = ydoc.getArray<Y.Map<any>>('elements')
      const yAssets = ydoc.getMap('assets')

      // ✅ Create binding instance
      // Library handles:
      // - Excalidraw onChange → Y.Doc updates
      // - Y.Doc updates → Excalidraw rendering
      // - Array conversions (points, groupIds, etc.)
      // - Origin tracking (prevents self-echo)
      bindingRef.current = new ExcalidrawBinding(
        yElements,
        yAssets,
        excalidrawAPI,
      )

      log.debug('✅ y-excalidraw bound successfully', { boardId })

      // Signal that binding is ready
      onReady?.(true)
    } catch (error) {
      log.error('💥 y-excalidraw binding failed', error)
      throw error // Let error boundary handle it
    }

    return () => {
      try {
        log.debug('🔓 Unbinding y-excalidraw', { boardId })

        if (bindingRef.current) {
          bindingRef.current.destroy()
          bindingRef.current = null
        }
      } catch (error) {
        log.error('💥 y-excalidraw unbind failed', error)
      }
    }
  }, [ydoc, excalidrawAPI, boardId])
}
