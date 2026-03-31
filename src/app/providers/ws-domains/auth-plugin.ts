/**
 * AUTH PLUGIN: Domain plugin for authorization WS events
 *
 * Responsibility:
 * - Register auth + flag invalidation event types with domain registry
 * - Wire registerHandler listeners for auth.invalidated + flags.invalidated
 * - Trigger React Query invalidation so AuthorizationProvider refetches
 *
 * Mirrors pages-plugin.ts structure exactly.
 *
 * @layer App
 */

import type { QueryClient } from '@tanstack/react-query'
import { createDomainPlugin } from '@/shared/ws/domains'
import { registerHandler } from '@/shared/ws/event-bus'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:auth-plugin')

let cleanupHandlers: (() => void) | null = null

interface AuthPluginContext {
  queryClient: QueryClient
}

export function createAuthPlugin({ queryClient }: AuthPluginContext) {
  return createDomainPlugin({
    domain: 'auth',
    upstreamEvents: [],
    downstreamEvents: ['auth.invalidated', 'flags.invalidated'],

    registerHandlers() {
      log.debug('Registering auth invalidation handlers')

      const unsub1 = registerHandler<{ type: 'auth.invalidated'; payload?: unknown }>(
        'auth.invalidated',
        () => {
          log.debug('auth.invalidated received — invalidating activeContext')
          void queryClient.invalidateQueries({ queryKey: authContextKeys.all })
        },
      )

      const unsub2 = registerHandler<{ type: 'flags.invalidated'; payload?: unknown }>(
        'flags.invalidated',
        () => {
          log.debug('flags.invalidated received — invalidating activeContext')
          void queryClient.invalidateQueries({ queryKey: authContextKeys.all })
        },
      )

      cleanupHandlers = () => {
        unsub1()
        unsub2()
      }

      log.debug('Auth invalidation handlers registered')
    },

    cleanup() {
      log.debug('Cleaning up auth handlers')
      if (cleanupHandlers) {
        cleanupHandlers()
        cleanupHandlers = null
      }
    },

    onReconnect() {
      // On reconnect, force-refetch — may have missed invalidation events while disconnected
      log.debug('WS reconnected — force-refreshing activeContext')
      void queryClient.invalidateQueries({ queryKey: authContextKeys.all })
    },
  })
}
