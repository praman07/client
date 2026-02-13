import { useEffect } from 'react'
import { setActiveBoardId } from '@/entities/whiteboard-session'
import { useAppDispatch } from '@/shared/hooks'

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
    console.info('[CanvasLifecycle] Mounting canvas', { boardId })

    // Set active board in Redux
    dispatch(setActiveBoardId(boardId))

    return () => {
      console.info('[CanvasLifecycle] Unmounting canvas', { boardId })

      // Clear active board
      dispatch(setActiveBoardId(''))
    }
  }, [boardId, dispatch])
}
