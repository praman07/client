import { useEffect, useRef } from 'react'
import { registerChatHandlers } from '@/features/chat-events' // Fixed import path
import { initializeDomainBridge } from '@/app/bootstrap/event-bridge'
import { store } from '@/app/store/config'
import { selectCurrentProject } from '@/entities/project/model/selectors'

export function EventHandlerRegistry() {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      console.log('[EventRegistry] Registering Domain Handlers')

      // DEPENDENCY INJECTION ROOT
      // The App Layer knows about the Store. The Feature does not.
      const cleanupHandlers = registerChatHandlers({
        getProjectId: () => {
          const state = store.getState()
          return selectCurrentProject(state)?.id
        },
      })

      // Initialize Bridge
      const cleanupBridge = initializeDomainBridge()
      initialized.current = true

      return () => {
        console.log('[EventRegistry] Teardown')
        cleanupHandlers()
        cleanupBridge()
        initialized.current = false
      }
    }
  }, [])

  return null // Headless provider
}
