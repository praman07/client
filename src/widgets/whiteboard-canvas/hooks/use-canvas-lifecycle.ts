import { useEffect } from 'react'
import { setActiveBoardId } from '@/entities/whiteboard-session'
import { useAppDispatch } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:canvas-lifecycle')

/**
 * Canvas lifecycle management
 *
 * - Sets active board on mount
 * - Clears active board on unmount
 * - Cleanup on navigation
 */
export function useCanvasLifecycle(boardId: string) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    log.info('Mounting canvas', { boardId })

    // Set active board in Redux
    dispatch(setActiveBoardId(boardId))

    return () => {
      log.info('Unmounting canvas', { boardId })

      // Clear active board
      dispatch(setActiveBoardId(''))
    }
  }, [boardId, dispatch])
}
