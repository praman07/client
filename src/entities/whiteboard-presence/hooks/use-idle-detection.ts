import { useEffect } from 'react'
import { setUserActive, setUserIdle } from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export function useIdleDetection(boardId: string) {
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((state) => state.user.currentUser?.id)

  useEffect(() => {
    // Don't set up idle detection if user is not authenticated
    if (!currentUserId) {
      return
    }

    // Store as const for closure type narrowing
    const userId = currentUserId

    let idleTimer: NodeJS.Timeout | null = null

    function resetIdleTimer() {
      if (idleTimer) {
        clearTimeout(idleTimer)
      }

      dispatch(setUserActive({ userId }))

      idleTimer = setTimeout(() => {
        dispatch(setUserIdle({ userId }))
      }, IDLE_TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'pointerdown', 'scroll']

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    resetIdleTimer()

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer)
      })
      if (idleTimer) {
        clearTimeout(idleTimer)
      }
    }
  }, [boardId, currentUserId, dispatch])
}
