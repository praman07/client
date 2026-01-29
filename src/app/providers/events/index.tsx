import { useEffect, useRef } from 'react'
import { registerChatHandlers } from '@/features/chat-events'
import { initializeDomainBridge } from '@/app/bootstrap/event-bridge'
import { store } from '@/app/store/config'
import { selectCurrentProject } from '@/entities/project/model/selectors'
import { startStorageGarbageCollector } from '@/features/storage-gc'

export function EventHandlerRegistry() {
  const initialized = useRef(false)
  const cleanupRef = useRef<{
    handlers: (() => void) | null
    gc: (() => void) | null
    bridge: (() => void) | null
  }>({ handlers: null, gc: null, bridge: null })

  useEffect(() => {
    if (!initialized.current) {
      console.log('[EventRegistry] Registering Domain Handlers')

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

      // Initialize Bridge
      cleanupRef.current.bridge = initializeDomainBridge()
      initialized.current = true
    }

    // Cleanup is ALWAYS returned, not just on first render
    return () => {
      console.log('[EventRegistry] Teardown')
      cleanupRef.current.handlers?.()
      cleanupRef.current.gc?.()
      cleanupRef.current.bridge?.()
      cleanupRef.current = { handlers: null, gc: null, bridge: null }
      initialized.current = false
    }
  }, [])

  return null // Headless provider
}
