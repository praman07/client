import { useEffect, useRef } from 'react'
import { registerChatHandlers } from '@/features/receive-message/handlers'
import { initializeDomainBridge } from '@/app/bootstrap/event-bridge'

export function EventHandlerRegistry() {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      console.log('[EventRegistry] Registering Domain Handlers')
      registerChatHandlers()
      // Initialize Bridge
      initializeDomainBridge()
      initialized.current = true
    }
  }, [])

  return null // Headless provider
}
