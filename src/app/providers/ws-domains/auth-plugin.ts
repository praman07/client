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
import { AuthDownstreamEvent } from '@/shared/contracts/auth'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:auth-plugin')


interface AuthPluginContext {
  queryClient: QueryClient
}

export function createAuthPlugin({ queryClient }: AuthPluginContext) {
  // Scoped to this factory instance — safe across multiple mounts.
  let cleanupHandlers: (() => void) | null = null

  return createDomainPlugin({
    domain: 'auth',
    upstreamEvents: [],
    downstreamEvents: Object.values(AuthDownstreamEvent),

    registerHandlers() {
      log.debug('Registering auth invalidation handlers')

      const unsub1 = registerHandler<{ type: typeof AuthDownstreamEvent.AuthInvalidated; payload?: unknown }>(
        AuthDownstreamEvent.AuthInvalidated,
        () => {
          log.debug('auth.invalidated received — invalidating activeContext')
          void queryClient.invalidateQueries({ queryKey: authContextKeys.all })
        },
      )

      const unsub2 = registerHandler<{ type: typeof AuthDownstreamEvent.FlagsInvalidated; payload?: unknown }>(
        AuthDownstreamEvent.FlagsInvalidated,
        () => {
          log.debug('flags.invalidated received — invalidating activeContext')
          void queryClient.invalidateQueries({ queryKey: authContextKeys.all })
        },
      )

      const unsub3 = registerHandler<{ type: typeof AuthDownstreamEvent.PluginUpdated; payload: { projectId: string; pluginType: string; enabled: boolean } }>(
        AuthDownstreamEvent.PluginUpdated,
        ({ payload }) => {
          log.debug('project.plugin.updated received', payload)
          // Dispatch a CustomEvent so layout components can react without
          // needing the queryClient reference at this plugin layer
          window.dispatchEvent(
            new CustomEvent('project.plugin.updated', { detail: payload })
          )
        },
      )

      cleanupHandlers = () => {
        unsub1()
        unsub2()
        unsub3()
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
