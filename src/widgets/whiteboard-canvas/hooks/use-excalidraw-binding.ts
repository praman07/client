import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import { createAwareness } from '@/entities/whiteboard-session'
import type { RefObject } from 'react'

/**
 * React hook to manage ExcalidrawBinding lifecycle
 *
 * Handles:
 * - Binding creation with Y.Doc and Excalidraw API
 * - Awareness setup for presence/cursors
 * - Undo/Redo manager integration
 * - Cleanup on unmount or dependency changes
 *
 * @param ydoc - Y.Doc instance (null if not ready)
 * @param excalidrawAPI - Excalidraw API instance (null if not ready)
 * @param excalidrawRef - Ref to Excalidraw container DOM element
 * @returns ExcalidrawBinding instance (null if dependencies not ready)
 */
export function useExcalidrawBinding(
  ydoc: Y.Doc | null,
  excalidrawAPI: ExcalidrawImperativeAPI | null,
  excalidrawRef: RefObject<HTMLDivElement>,
  synced: boolean, // NEW: Must wait for IndexedDB sync!
) {
  const bindingRef = useRef<ExcalidrawBinding | null>(null)
  const [binding, setBinding] = useState<ExcalidrawBinding | null>(null)

  useEffect(() => {
    console.log('[useExcalidrawBinding] Effect triggered', {
      hasYdoc: !!ydoc,
      hasAPI: !!excalidrawAPI,
      hasRef: !!excalidrawRef.current,
      synced, // Log sync status
    })

    // 🚨 CRITICAL: Wait for IndexedDB sync BEFORE creating binding!
    // Otherwise binding sees empty Y.Doc and clears the canvas
    if (!ydoc || !excalidrawAPI || !excalidrawRef.current || !synced) {
      console.log(
        '[useExcalidrawBinding] Missing dependencies or not synced, skipping binding creation',
      )
      return
    }

    console.log('[useExcalidrawBinding] Creating binding...')

    try {
      // Get Y.js shared types
      const yElements = ydoc.getArray<Y.Map<any>>('elements')
      const yAssets = ydoc.getMap('assets')

      // Create awareness for cursor/presence tracking
      // TODO: Get user info from auth context
      const awareness = createAwareness(ydoc)

      // Create undo manager
      const undoManager = new Y.UndoManager(yElements)

      // Create binding
      const newBinding = new ExcalidrawBinding(
        yElements,
        yAssets,
        excalidrawAPI,
        awareness,
        {
          excalidrawDom: excalidrawRef.current,
          undoManager,
        },
      )

      bindingRef.current = newBinding
      setBinding(newBinding) // Trigger re-render so component sees it!
      console.log('[useExcalidrawBinding] ✅ Binding created successfully')
    } catch (error) {
      console.error(
        '[useExcalidrawBinding] ❌ Failed to create binding:',
        error,
      )
    }

    return () => {
      console.log('[useExcalidrawBinding] Cleaning up binding')
      bindingRef.current?.destroy()
      bindingRef.current = null
      setBinding(null) // Clear state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ydoc, excalidrawAPI, synced]) // excalidrawRef is stable, don't include it

  return binding // Return state, not ref!
}
