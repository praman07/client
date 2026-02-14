import { useEffect } from 'react'
import { createChatPlugin } from './chat-plugin'
import { createWhiteboardPlugin } from './whiteboard-plugin'
import { registerPlugin, unregisterPlugin } from '@/shared/ws/domains'
import { createLogger } from '@/shared/lib/logger'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useUser } from '@/shared/hooks'

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
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { user } = useUser()

  useEffect(() => {
    log.debug('Initializing domain plugins')

    // Chat Plugin
    // Provides: projectId for message persistence
    const chatPlugin = createChatPlugin({
      getProjectId: () => projectId ?? undefined,
    })

    registerPlugin(chatPlugin)

    // Whiteboard Plugin
    // Provides: dispatch, queryClient, userId for event handlers
    const whiteboardPlugin = createWhiteboardPlugin({
      dispatch,
      queryClient,
      userId: user?.id ?? null,
    })

    registerPlugin(whiteboardPlugin)

    log.debug('Domain plugins registered')

    // Cleanup on unmount
    return () => {
      log.debug('Cleaning up domain plugins')
      unregisterPlugin('chat')
      unregisterPlugin('whiteboard')
    }
  }, [projectId, dispatch, queryClient, user?.id])

  return null
}
