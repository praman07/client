import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { useSendPageUpdate } from '@/features/pages/send-page-update/hooks/use-send-page-update'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:phase3:client-diff')

/**
 * Phase 3 — Client Diff Push (one-shot)
 *
 * Gate: idbSynced must be true (IDB local edits merged into ydoc first).
 *
 * Computes the diff between our local ydoc state and the server state vector
 * captured in Phase 1. If non-empty, sends it to the server to push any
 * offline edits made while disconnected.
 *
 * Runs exactly ONCE per page session (sentRef guard).
 *
 * @layer Widgets
 */
export function useClientDiff(
  ydoc: Y.Doc,
  pageId: string,
  idbSynced: boolean,
  serverStateVectorRef: React.MutableRefObject<Uint8Array | null>,
): void {
  const sendPageUpdate = useSendPageUpdate(pageId)
  const sentRef = useRef(false)

  useEffect(() => {
    if (!idbSynced || sentRef.current) return
    sentRef.current = true

    const serverSv = serverStateVectorRef.current
    if (!serverSv) {
      log.debug('No server state vector — skipping client diff', { pageId })
      return
    }

    const diff = Y.encodeStateAsUpdate(ydoc, serverSv)

    // An empty Yjs update has a known minimal byte length (2 bytes)
    if (diff.byteLength <= 2) {
      log.debug('No offline edits to push', { pageId })
      return
    }

    log.info('Pushing offline diff to server', {
      pageId,
      diffSize: diff.byteLength,
    })
    sendPageUpdate(diff).catch((err) => {
      log.error('Failed to push offline diff', { pageId, err })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idbSynced])
}
