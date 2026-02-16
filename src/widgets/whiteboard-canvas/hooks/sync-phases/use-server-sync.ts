import { useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'
import { useBoardSnapshot } from '@/features/whiteboard/fetch-snapshot'
import { uint8ArrayToBase64 } from '@/entities/whiteboard-session'
import { safeApplyUpdate } from '@/shared/lib/yjs/safe-apply-update'
import { YjsOrigin } from '@/shared/lib/yjs/constants'

const log = createLogger('whiteboard:sync:server')

/**
 * Fetch and apply server snapshot diff
 * Phase 1 of sync lifecycle
 *
 * @param ydoc - Y.Doc instance
 * @param boardId - Board ID
 * @param onSynced - Callback with server state vector when sync completes
 */
export function useServerSync(
  ydoc: Y.Doc,
  boardId: string,
  onSynced: (serverStateVector: Uint8Array) => void,
) {
  const [synced, setSynced] = useState(false)
  const ydocRef = useRef(ydoc)

  useEffect(() => {
    if (ydocRef.current !== ydoc) {
      log.debug('Y.Doc instance changed, resetting sync state', { boardId })
      setSynced(false)
      ydocRef.current = ydoc
    }
  }, [ydoc, boardId])

  const clientSnapshot = useMemo(
    () => uint8ArrayToBase64(Y.encodeStateAsUpdate(ydoc)),
    [ydoc],
  )

  const { data, isSuccess } = useBoardSnapshot(boardId, clientSnapshot, {
    retry: 2,
    retryDelay: 1000,
  })

  // Apply diff once
  useEffect(() => {
    if (synced || !isSuccess || !data?.diff) return

    log.info('📥 Applying server snapshot', {
      boardId,
      diffSize: data.diff.length,
    })

    const result = safeApplyUpdate(
      ydoc,
      data.diff,
      {
        context: 'server-sync',
        boardId,
        origin: YjsOrigin.Remote,
        throwOnError: true,
      },
      log,
    )

    if (result.success) {
      const serverState = Y.encodeStateVector(ydoc)

      log.info('✅ Server sync complete', {
        boardId,
        elementsBefore: result.elementsBefore,
        elementsAfter: result.elementsAfter,
      })

      setSynced(true)
      onSynced(serverState)
    } else {
      log.error('Server sync failed', { boardId, error: result.error })
      // Still mark as synced for graceful degradation
      const serverState = Y.encodeStateVector(ydoc)
      setSynced(true)
      onSynced(serverState)
    }
  }, [data, isSuccess, synced, ydoc, boardId, onSynced])
}
