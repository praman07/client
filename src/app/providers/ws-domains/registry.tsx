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
import { createChatPlugin } from './chat-plugin'
import { registerPlugin } from '@/shared/ws/domains'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:domain-registry')

/**
 * DOMAIN REGISTRY
 *
 * Responsibility:
 * - Register all domain plugins at app startup
 * - Initialize domain-specific event handlers
 *
 * Architecture:
 * - Component mounts once in app root
 * - Registers plugins via centralized plugin registry
 * - Plugins handle their own cleanup
 */

interface DomainRegistryProps {
  projectId: string | null
}

export function DomainRegistry({ projectId }: DomainRegistryProps) {
  useEffect(() => {
    log.debug('Initializing domain plugins')

    // Chat Plugin
    // Provides: projectId for message persistence
    const chatPlugin = createChatPlugin({
      getProjectId: () => projectId ?? undefined,
    })

    registerPlugin(chatPlugin)

    // Future plugins:
    // const whiteboardPlugin = createWhiteboardPlugin({ ... })
    // registerPlugin(whiteboardPlugin)
    //
    // const pagesPlugin = createPagesPlugin({ ... })
    // registerPlugin(pagesPlugin)

    log.debug('Domain plugins registered')

    // Cleanup on unmount
    return () => {
      log.debug('Cleaning up domain plugins')
      // Plugin registry handles cleanup
    }
  }, [projectId])

  return null
}
