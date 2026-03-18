import { useEffect } from 'react'
import * as Y from 'yjs'
import { Awareness } from 'y-protocols/awareness'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import type { RefObject } from 'react'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:sync:binding')

/**
 * Create Excalidraw binding after server sync
 * Phase 4 of sync lifecycle
 *
 * @param ydoc - Y.Doc instance
 * @param api - Excalidraw API instance
 * @param excalidrawRef - Ref to Excalidraw container
 * @param serverSynced - Whether server sync completed
 * @param setBinding - Callback to set binding instance
 */
export function useExcalidrawBinding(
  ydoc: Y.Doc,
  api: ExcalidrawImperativeAPI | null,
  excalidrawRef: RefObject<HTMLElement>,
  serverSynced: boolean,
  setBinding: (binding: ExcalidrawBinding | null) => void,
) {
  useEffect(() => {
    if (!api || !serverSynced) {
      log.debug('⏳ Waiting for API and server sync before binding', {
        hasAPI: !!api,
        serverSynced,
      })
      return
    }

    log.info('🔗 Creating Excalidraw binding', {})

    const yElements = ydoc.getArray<Y.Map<any>>('elements')
    const yAssets = ydoc.getMap('assets')
    const awareness = new Awareness(ydoc)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- excalidrawRef.current may be null on first mount before the ref is assigned
    const undoManagerOptions = excalidrawRef.current
      ? {
          excalidrawDom: excalidrawRef.current,
          undoManager: new Y.UndoManager(yElements),
        }
      : undefined

    const binding = new ExcalidrawBinding(
      yElements,
      yAssets,
      api,
      awareness,
      undoManagerOptions,
    )

    setBinding(binding)

    log.info('✅ Excalidraw binding created', {})

    return () => {
      log.debug('🧹 Destroying Excalidraw binding', {})
      binding.destroy()
      setBinding(null)
    }
  }, [ydoc, api, serverSynced, excalidrawRef, setBinding])
}
