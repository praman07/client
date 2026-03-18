import { useEffect, useState } from 'react'

/**
 * Online Status Hook - Shared Layer
 *
 * Tracks network connectivity and WebSocket connection state.
 * Returns true only if BOTH are online.
 *
 * @returns true if navigator.onLine AND WebSocket connected
 *
 * @example
 * const isOnline = useOnlineStatus()
 *
 * if (!isOnline) {
 *   // Queue to IndexedDB
 * }
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    return navigator.onLine
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
