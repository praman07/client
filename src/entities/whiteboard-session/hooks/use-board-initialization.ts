import { useState, useCallback } from 'react'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:init-state')

/**
 * INITIALIZATION STATE MANAGER
 *
 * Responsibility:
 * - Track board initialization lifecycle phases
 * - Signal when network sync should be enabled
 * - Handle React Strict Mode mount/unmount cycles gracefully
 *
 * Architecture:
 * - State Machine: IDLE → CREATING → LOADING → BINDING → READY → SYNCING
 * - Each phase transition is explicitly logged for debugging
 * - Only READY phase allows network sync to activate
 *
 * Why This Exists:
 * - Prevents premature network sync during initialization
 * - Stops empty Y.Doc state from being broadcast to other users
 * - Provides clear debugging trail of initialization progress
 *
 * @layer Entity
 */

export type InitPhase =
  | 'idle'
  | 'creating-ydoc'
  | 'loading-data'
  | 'binding-excalidraw'
  | 'ready'
  | 'syncing'

export interface BoardInitializationState {
  phase: InitPhase
  isReady: boolean
  advanceToCreatingYDoc: () => void
  advanceToLoadingData: () => void
  advanceToBinding: () => void
  markReady: () => void
  startSyncing: () => void
  reset: () => void
}

export function useBoardInitialization(
  boardId: string,
): BoardInitializationState {
  const [phase, setPhase] = useState<InitPhase>('idle')
  const [isReady, setIsReady] = useState(false)

  const advanceToCreatingYDoc = useCallback(() => {
    setPhase('creating-ydoc')
    log.debug('Phase: Creating Y.Doc', { boardId })
  }, [boardId])

  const advanceToLoadingData = useCallback(() => {
    setPhase('loading-data')
    log.debug('Phase: Loading data', { boardId })
  }, [boardId])

  const advanceToBinding = useCallback(() => {
    setPhase('binding-excalidraw')
    log.debug('Phase: Binding y-excalidraw', { boardId })
  }, [boardId])

  const markReady = useCallback(() => {
    setPhase('ready')
    setIsReady(true)
    log.info('✅ Board initialization complete - network sync enabled', {
      boardId,
    })
  }, [boardId])

  const startSyncing = useCallback(() => {
    if (!isReady) {
      log.warn('Cannot start syncing - board not ready', { boardId, phase })
      return
    }
    setPhase('syncing')
    log.debug('Phase: Syncing', { boardId })
  }, [boardId, isReady, phase])

  const reset = useCallback(() => {
    setPhase('idle')
    setIsReady(false)
    log.debug('Phase: Reset to idle', { boardId })
  }, [boardId])

  return {
    phase,
    isReady,
    advanceToCreatingYDoc,
    advanceToLoadingData,
    advanceToBinding,
    markReady,
    startSyncing,
    reset,
  }
}
