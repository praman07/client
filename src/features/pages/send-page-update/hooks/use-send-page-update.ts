import { useCallback } from 'react'
import { sendPageUpdate } from '@/features/pages/events/api/send-page-update'
import { useAppSelector } from '@/shared/hooks'
import { selectIsPageOnline } from '@/entities/page-session/model/selectors'

/**
 * Stable callback hook for sending page Yjs updates.
 * Wraps the existing sendPageUpdate API fn (at features/pages/events/api).
 * Online/offline logic is fully handled by that function.
 *
 * Used in Phase 4 (useNetworkSync) inside ydoc.on('update').
 *
 * @layer Features
 */
export function useSendPageUpdate(pageId: string) {
  const isOnline = useAppSelector(selectIsPageOnline)

  return useCallback(
    (update: Uint8Array): Promise<string> => {
      return sendPageUpdate(pageId, update, isOnline)
    },
    [pageId, isOnline],
  )
}
