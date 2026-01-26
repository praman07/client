import { useEffect } from 'react'
import { socketOrchestrator } from '@/app/runtime/socket-orchestrator'
import { useAuth } from '@/shared/hooks'
import { useCurrentWorkspace } from '@/entities/workspace'

/**
 * Socket Intent Hook
 * Responsibilities:
 * - Observe App Readiness (Auth + Workspace)
 * - Signal Intent to Orchestrator
 * - NO side effects, NO async logic, NO teardown.
 */
export function useSocketConnection(enabled: boolean = true) {
  const { userId, isSignedIn, getToken } = useAuth()
  const workspace = useCurrentWorkspace()
  const workspaceId = workspace?.id

  useEffect(() => {
    // Check Readiness
    if (!enabled || !isSignedIn || !userId || !workspaceId) {
      // Signal Disable
      socketOrchestrator.disable()
      return
    }

    // Signal Enable (Pass Capability)
    socketOrchestrator.enable(userId, workspaceId, getToken)
  }, [enabled, isSignedIn, userId, workspaceId, getToken])
}
