import { useEffect, useRef } from 'react'
import { registerChatHandlers } from '@/features/chat/events'
import { store } from '@/app/store/config'
import { selectCurrentProject } from '@/entities/project/model/selectors'
import { startStorageGarbageCollector } from '@/shared/lib/storage-gc'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('app:events')

export function EventHandlerRegistry() {
  const initialized = useRef(false)
  const cleanupRef = useRef<{
    handlers: (() => void) | null
    gc: (() => void) | null
  }>({ handlers: null, gc: null })

  useEffect(() => {
    if (!initialized.current) {
      log.debug('Registering Domain Handlers')

      // DEPENDENCY INJECTION ROOT
      // The App Layer knows about the Store. The Feature does not.
      cleanupRef.current.handlers = registerChatHandlers({
        getProjectId: () => {
          const state = store.getState()
          return selectCurrentProject(state)?.id
        },
      })

      // Start GC
      cleanupRef.current.gc = startStorageGarbageCollector()

      // Note: event-bridge.ts removed - event-router already bridges to event-bus
      initialized.current = true
    }

    // Cleanup is ALWAYS returned, not just on first render
    return () => {
      log.debug('Teardown')
      cleanupRef.current.handlers?.()
      cleanupRef.current.gc?.()
      cleanupRef.current = { handlers: null, gc: null }
      initialized.current = false
    }
  }, [])

  return null // Headless provider
}
