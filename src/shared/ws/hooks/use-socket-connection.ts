import { useEffect, useRef } from 'react'
import { wsManager } from '../connection-manager'
import { useAuth } from '@/shared/hooks'
import { useCurrentWorkspace } from '@/entities/workspace'

/**
 * Manages the global WebSocket connection lifecycle.
 * Handles async token fetching internally.
 */
export function useSocketConnection(enabled: boolean = true) {
  const { getToken, userId, isSignedIn } = useAuth()
  const workspace = useCurrentWorkspace()
  const workspaceId = workspace?.id

  const connectingRef = useRef(false)

  useEffect(() => {
    // If disabled or not signed in or no workspace, ensure we are disconnected
    if (!enabled || !isSignedIn || !userId || !workspaceId) {
      if (
        wsManager.getStatus() === WebSocket.OPEN ||
        wsManager.getStatus() === WebSocket.CONNECTING
      ) {
        wsManager.disconnect()
      }
      return
    }

    // Identify if we are already connected or connecting
    // (wsManager handles idempotency, but we save an async call here)
    if (wsManager.getStatus() === WebSocket.OPEN) return

    let mounted = true

    const connect = async () => {
      // Prevent double-firing in strict mode
      if (connectingRef.current) return
      connectingRef.current = true

      console.log(
        '[use-socket] Triggering async connect flow. UserID:',
        userId,
        'WorkspaceID:',
        workspaceId,
      )

      try {
        // Fetch fresh token
        const token = await getToken()

        if (mounted && token) {
          console.log('[use-socket] Token acquired, connecting...')
          // Use the workspaceId from closure since it's a dependency
          wsManager.connect(token, workspaceId)
        } else {
          console.log('[use-socket] Token fetch complete but skipped', {
            mounted,
            hasToken: !!token,
          })
        }
      } catch (error) {
        console.error('[use-socket] Failed to retrieve token:', error)
      } finally {
        connectingRef.current = false
      }
    }

    connect()

    return () => {
      console.log('[use-socket] Unmounting/Cleanup')
      mounted = false
      wsManager.disconnect()
    }
  }, [getToken, userId, isSignedIn, enabled, workspaceId])
}
