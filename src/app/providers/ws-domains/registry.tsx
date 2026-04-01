import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createAuthPlugin } from './auth-plugin'
import { registerPlugin, unregisterPlugin } from '@/shared/ws/domains'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:domain-registry')

/**
 * DOMAIN REGISTRY
 *
 * Registers the auth plugin globally at app root.
 *
 * Auth must be global — it handles auth.invalidated, flags.invalidated, and
 * project.plugin.updated events that must be active regardless of which route
 * the user is on.
 *
 * Chat, whiteboard, and pages plugins are now managed per-route:
 *   - chat     → chat/route.tsx ChatLayout
 *   - whiteboard → whiteboard/route.tsx WhiteboardLayout
 *   - pages    → pages/route.tsx PagesLayout
 *
 * This means WS event handlers for those domains are only registered while
 * the user is inside the relevant route subtree, reducing memory footprint
 * and preventing stale handler accumulation.
 */
export function DomainRegistry() {
  const queryClient = useQueryClient()

  useEffect(() => {
    log.debug('Registering auth plugin (global)')
    const authPlugin = createAuthPlugin({ queryClient })
    registerPlugin(authPlugin)

    return () => {
      log.debug('Cleaning up auth plugin')
      unregisterPlugin('auth')
    }
  }, [queryClient])

  return null
}

