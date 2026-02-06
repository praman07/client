/**
 * SOCKET ORCHESTRATOR: RUNTIME CONTROLLER
 * This file MUST NOT import from:
 * - React (hooks, providers, components)
 *
 * Responsibility: Translate app capability (Auth + Workspace) into Transport Intent.
 */
import { wsManager } from '@/shared/ws'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:orchestrator')

type OrchestratorState = {
  enabled: boolean
  userId: string | null
  workspaceId: string | null
}

class SocketOrchestrator {
  private state: OrchestratorState = {
    enabled: false,
    userId: null,
    workspaceId: null,
  }

  constructor() {
    wsManager.onAuthError(() => {
      log.warn('Auth Error detected. Retrying connection...')
      this.connecting = false // Force reset lock
      this.ensureConnection()
    })
  }

  private connecting = false
  private currentGetToken: (() => Promise<string | null>) | null = null

  enable(
    userId: string,
    workspaceId: string,
    getToken: () => Promise<string | null>,
  ) {
    const workspaceChanged = this.state.workspaceId !== workspaceId

    // If fully identical, do nothing (idempotency)
    if (
      this.state.enabled &&
      this.state.userId === userId &&
      !workspaceChanged
    ) {
      return
    }

    // Update State
    this.state = {
      enabled: true,
      userId,
      workspaceId,
    }
    this.currentGetToken = getToken

    // If workspace changed, we MUST disconnect to force a reconnect with new params
    if (workspaceChanged) {
      wsManager.disconnect()
    }

    this.ensureConnection()
  }

  disable() {
    // Optimization: If already disabled, do nothing
    if (!this.state.enabled) return

    this.state = {
      enabled: false,
      userId: null,
      workspaceId: null,
    }
    this.currentGetToken = null

    wsManager.disconnect()
  }

  private async ensureConnection() {
    log.debug('ensureConnection called', {
      connecting: this.connecting,
      enabled: this.state.enabled,
      userId: this.state.userId,
      workspaceId: this.state.workspaceId,
      hasGetToken: !!this.currentGetToken,
    })

    if (this.connecting) return
    if (!this.state.enabled) return
    if (!this.state.userId || !this.state.workspaceId) return
    if (!this.currentGetToken) return

    this.connecting = true

    try {
      // Double check state after lock
      if (!this.state.enabled) return

      log.debug('Fetching token...')
      const token = await this.currentGetToken()
      log.debug('Token fetched:', !!token)

      if (!token) return

      // Check again before connecting (async gap)
      if (!this.state.enabled || !this.state.workspaceId) return

      log.debug('Calling wsManager.connect()')
      wsManager.connect(token, this.state.workspaceId)
    } catch (err) {
      log.error('Token fetch failed', err)
    } finally {
      this.connecting = false
    }
  }
}

export const socketOrchestrator = new SocketOrchestrator()
