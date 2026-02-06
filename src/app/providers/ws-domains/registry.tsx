/**
 * DOMAIN REGISTRY: React component for plugin orchestration
 *
 * Responsibility:
 * - Register domain plugins with system
 * - Initialize event handlers for each domain
 * - Manage plugin lifecycle (mount/unmount)
 *
 * Usage:
 * ```tsx
 * <DomainRegistry plugins={[chatPlugin]} />
 * ```
 */

import { useEffect } from 'react'
import type { DomainPlugin } from './domain-plugin'
import { registerDomain } from '@/shared/ws/events/domain-registry'
import { eventRouter } from '@/shared/ws'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:registry')

interface DomainRegistryProps {
  plugins: Array<DomainPlugin>
}

/**
 * DomainRegistry component coordinates plugin registration.
 * Place this component in the app provider tree after auth/workspace providers.
 */
export function DomainRegistry({ plugins }: DomainRegistryProps) {
  useEffect(() => {
    log.debug(`Initializing ${plugins.length} domain(s)`)

    // Register each plugin
    plugins.forEach((plugin) => {
      // Register domain with event registry
      registerDomain({
        domain: plugin.domain,
        upstreamEvents: plugin.upstreamEvents,
        downstreamEvents: plugin.downstreamEvents,
      })

      // Attach event handlers
      plugin.registerHandlers(eventRouter)

      log.debug(
        `Registered ${plugin.domain} (${plugin.upstreamEvents.length} upstream, ${plugin.downstreamEvents.length} downstream)`,
      )
    })

    // Cleanup on unmount
    return () => {
      log.debug('Cleaning up domains')
      plugins.forEach((plugin) => {
        plugin.cleanup?.()
      })
    }
  }, [plugins])

  // This is a provider component, renders nothing
  return null
}
