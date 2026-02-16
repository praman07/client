import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { useBoardSnapshot } from '@/features/whiteboard/fetch-snapshot'
import { YjsOrigin } from '@/shared/lib/yjs/constants'
import { uint8ArrayToBase64 } from '@/entities/whiteboard-session'
import { createLogger } from '@/shared/lib/logger'
import { safeApplyUpdate } from '@/shared/lib/yjs/safe-apply-update'

const log = createLogger('whiteboard:state-vector-sync')

/**
 * Bidirectional Y.js Synchronization Hook
 *
 * Synchronizes client and server Y.Doc state using full document snapshots.
 * Enables true bidirectional sync - client offline edits are uploaded to server.
 *
 * **Flow:**
 * 1. Wait for IndexedDB to finish loading local snapshot
 * 2. Encode full Y.Doc snapshot (includes any offline edits)
 * 3. Send to server via getBoardSnapshot query
 * 4. Server computes:
 *    - Client→Server diff: Offline edits to write to stream + broadcast
 *    - Server→Client diff: Missing updates to send back
 * 5. Apply server→client diff to Y.Doc with 'remote' origin
 * 6. Signal sync complete
 *
 * **Why full snapshot vs state vector:**
 * - State vector only tells server what we've seen (server→client sync)
 * - Full snapshot allows server to compute what we have (client→server sync)
 * - Enables offline editing with automatic reconciliation on reconnect
 *
 * @param ydoc - Y.Doc instance from useCollabV2
 * @param boardId - Board ID
 * @param indexeddbSynced - Whether IndexedDB has finished loading
 * @returns { synced, error } - Sync status and any error
 *
 * @example
 * ```typescript
 * const { ydoc, indexeddbSynced } = useCollabV2(...)
 * const { synced } = useStateVectorSync(ydoc, boardId, indexeddbSynced)
 *
 * // Only start network sync after state is synchronized
 * useNetworkSyncV2(ydoc, boardId, synced)
 * ```
 */
export function useStateVectorSync(
  ydoc: Y.Doc | null,
  boardId: string,
  // ❌ REMOVED: indexeddbSynced parameter - we sync BEFORE IndexedDB now!
) {
  const [synced, setSynced] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [serverStateVector, setServerStateVector] = useState<Uint8Array | null>(
    null,
  )

  // ✅ Encode FULL Y.Doc snapshot for bidirectional sync
  // Runs IMMEDIATELY when Y.Doc is available (before IndexedDB!)
  const clientSnapshotBinary = ydoc ? Y.encodeStateAsUpdate(ydoc) : null

  const clientSnapshotB64 = clientSnapshotBinary
    ? uint8ArrayToBase64(clientSnapshotBinary)
    : undefined

  const {
    data,
    error: fetchError,
    isSuccess,
    isError,
  } = useBoardSnapshot(boardId, clientSnapshotB64, {
    enabled: !!ydoc && !synced, // ✅ Run as soon as Y.Doc exists!
    retry: 2,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (!ydoc) {
      log.debug('Waiting for Y.Doc', { hasYDoc: !!ydoc })
      return
    }

    if (isSuccess && data?.diff) {
      try {
        // ✅ Capture server state BEFORE applying diff
        // This will be used later to compute client→server diff
        const serverState = Y.encodeStateVector(ydoc)

        log.info('📊 Applying server→client diff', {
          boardId,
          diffSize: data.diff.length,
          clientSnapshotSent: !!clientSnapshotB64,
          clientSnapshotSize: clientSnapshotBinary?.length || 0,
          lastStreamId: data.lastStreamId,
        })

        // Apply server diff with 'remote' origin
        // This prevents echo loop and marks update as non-local
        const result = safeApplyUpdate(
          ydoc,
          data.diff,
          {
            context: 'client:state-vector-sync',
            boardId,
            origin: YjsOrigin.Remote,
            throwOnError: true, // Critical - must succeed for sync
            streamId: data.lastStreamId ?? undefined,
          },
          log,
        )

        if (!result.success) {
          throw result.error!
        }

        log.info('✅ Server sync complete', {
          boardId,
          elementsBefore: result.elementsBefore,
          elementsAfter: result.elementsAfter,
          elementsDelta: result.elementsDelta,
          lastStreamId: data.lastStreamId,
        })

        // ✅ Save server state vector for client diff calculation
        setServerStateVector(serverState)
        setSynced(true)
        setError(null)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        log.error('❌ Failed to apply state diff', {
          boardId,
          error: error.message,
        })
        setError(error)

        // Graceful degradation: mark as synced anyway
        // User can work with potentially stale data
        setSynced(true)
      }
    } else if (isError && fetchError) {
      log.error('❌ Failed to fetch snapshot', {
        boardId,
        error: fetchError.message,
      })
      setError(fetchError as Error)

      // Graceful degradation: mark as synced anyway
      setSynced(true)
    }
  }, [ydoc, boardId, data, isSuccess, isError, fetchError])

  return { synced, error, serverStateVector } // ✅ Return server state for client diff
}
