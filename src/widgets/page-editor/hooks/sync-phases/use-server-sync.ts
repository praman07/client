import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import { usePageSnapshot } from '@/features/pages/fetch-snapshot'
import { setYDocStatus } from '@/entities/page-session/model/slice'
import { useAppDispatch } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:phase1:server-sync')

export interface ServerSyncState {
  serverSynced: boolean
  lastStreamId: string
}

/**
 * Phase 1 — Server Sync
 *
 * Fetches the Y.Doc snapshot from GraphQL (getPageSnapshot).
 * Applies the diff to the local ydoc. Captures the lastStreamId
 * for gap-fill on Phase 4 WS subscription.
 *
 * Server absorbs any offline edits uploaded via clientSnapshot
 * argument and returns only the delta the client is missing.
 *
 * @layer Widgets
 */
export function useServerSync(
  ydoc: Y.Doc,
  pageId: string,
  onServerSynced: (lastStreamId: string) => void,
): ServerSyncState {
  const dispatch = useAppDispatch()
  const [serverSynced, setServerSynced] = useState(false)
  const [lastStreamId, setLastStreamId] = useState('0-0')
  const appliedRef = useRef(false)

  const { data: snapshot, isSuccess, isError } = usePageSnapshot(pageId)

  useEffect(() => {
    if (!isSuccess || !snapshot || appliedRef.current) return
    appliedRef.current = true

    try {
      dispatch(setYDocStatus('loading'))
      Y.applyUpdate(ydoc, snapshot.diff, 'server')
      log.info('Server snapshot applied', {
        pageId,
        lastStreamId: snapshot.lastStreamId,
        diffSize: snapshot.diff.byteLength,
      })

      const streamId = snapshot.lastStreamId || '0-0'
      setLastStreamId(streamId)
      setServerSynced(true)
      dispatch(setYDocStatus('synced'))
      onServerSynced(streamId)
    } catch (err) {
      log.error('Failed to apply server snapshot', { pageId, err })
      dispatch(setYDocStatus('error'))
    }
    
  }, [isSuccess, snapshot])

  useEffect(() => {
    if (isError) {
      dispatch(setYDocStatus('error'))
      log.error('Snapshot query failed', { pageId })
    }
  }, [isError, dispatch, pageId])

  return { serverSynced, lastStreamId }
}
