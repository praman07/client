/**
 * EventHandlerRegistry (headless)
 *
 * Previously owned chat handler registration at app startup.
 * After the route-based plugin refactor, handler registration is
 * now the responsibility of each domain route layout:
 *   - /chat      → chat/route.tsx    → registerPlugin(createChatPlugin(...))
 *   - /whiteboard → whiteboard/route.tsx → registerPlugin(createWhiteboardPlugin(...))
 *   - /pages     → pages/route.tsx   → registerPlugin(createPagesPlugin(...))
 *
 * This component now ONLY starts the storage garbage collector.
 * It is kept as a headless provider for future app-level side effects.
 *
 * @layer App
 */

import { useEffect } from 'react'
import { startStorageGarbageCollector } from '@/shared/lib/storage-gc'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('app:events')

export function EventHandlerRegistry() {
  useEffect(() => {
    log.debug('Starting storage garbage collector')
    const stopGc = startStorageGarbageCollector()

    return () => {
      log.debug('Stopping storage garbage collector')
      stopGc()
    }
  }, [])

  return null // Headless provider
}
