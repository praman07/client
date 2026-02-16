import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'
import { useSendBoardUpdate } from '@/features/whiteboard/send-board-update'

const log = createLogger('whiteboard:sync:client-diff')

/**
 * Calculate and send client→server diff (offline edits)
 * Phase 3 of sync lifecycle
 *
 * @param ydoc - Y.Doc instance
 * @param boardId - Board ID
 * @param indexeddbSynced - Whether IndexedDB sync completed
 * @param serverStateVectorRef - Ref to server state vector
 */
export function useClientDiff(
  ydoc: Y.Doc,
  boardId: string,
  indexeddbSynced: boolean,
  serverStateVectorRef: RefObject<Uint8Array | null>,
) {
  const sendUpdate = useSendBoardUpdate(boardId)
  const [sent, setSent] = useState(false)
  const ydocRef = useRef(ydoc)

  useEffect(() => {
    if (ydocRef.current !== ydoc) {
      log.debug('Y.Doc instance changed, resetting client diff state', {
        boardId,
      })
      setSent(false)
      ydocRef.current = ydoc
    }
  }, [ydoc, boardId])

  useEffect(() => {
    const serverStateVector = serverStateVectorRef.current
    if (!indexeddbSynced || !serverStateVector || sent) {
      return
    }

    log.debug('🧮 Computing client→server diff', { boardId })

    const clientDiff = Y.encodeStateAsUpdate(ydoc, serverStateVector)

    if (clientDiff.length > 0) {
      log.info('📤 Sending offline edits to server', {
        boardId,
        diffSize: clientDiff.length,
      })

      sendUpdate(clientDiff)
    } else {
      log.debug('No offline edits to send', { boardId })
    }

    setSent(true)
  }, [ydoc, boardId, indexeddbSynced, serverStateVectorRef, sent, sendUpdate])
}
