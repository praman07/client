import { useEffect, useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import type * as Y from 'yjs'
import { useRenamePage } from '@/features/pages/rename-page'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { usePermission } from '@/shared/lib/auth'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:page-title')

/** Debounce delay in ms before persisting title to DB. */
const TITLE_DEBOUNCE_MS = 600

interface PageTitleProps {
  ydoc: Y.Doc
  isLocked: boolean
  /**
   * DB title from usePageById — used to seed the ydoc metaMap when meta.title
   * is absent. This happens when a page was renamed via the sidebar context menu
   * (which fires the renamePage GQL mutation) but the title was never typed in
   * the editor (so the Yjs CRDT was never written).
   */
  dbTitle: string
}

/**
 * PageTitle — Collaborative, Yjs-bound title input.
 *
 * Binds to ydoc.getMap('meta').get('title').
 * Real-time propagation: Yjs CRDT syncs title to all peers instantly.
 * DB persistence: debounced renamePage mutation fires 600ms after last keystroke.
 * onBlur: cancels pending debounce and persists immediately (covers tab-away / navigation).
 *
 * Seed logic:
 *   If the ydoc metaMap has no 'title' (e.g. freshly renamed via sidebar),
 *   we seed it from the DB title (dbTitle prop) so the input shows the correct
 *   value without requiring a user keystroke first.
 *
 * useRenamePage handles: optimistic projectPages cache update + invalidateQueries on settled.
 *
 * @layer Widgets
 */
export function PageTitle({ ydoc, isLocked, dbTitle }: PageTitleProps) {
  const { pageId } = useParams({ strict: false })
  const project = useAppSelector(selectCurrentProject)
  const metaMap = ydoc.getMap<string>('meta')
  const canUpdate = usePermission('page:update')
  /** True when the user may edit: has page:update permission AND page is not locked */
  const canEdit = canUpdate && !isLocked

  // Initialization: prefer ydoc CRDT title (collaborative truth) over DB title.
  // If ydoc has no title yet (never typed in editor), fall back to dbTitle.
  const [title, setTitle] = useState<string>(() => metaMap.get('title') || dbTitle)
  const titleRef = useRef(title)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { mutate: renamePage } = useRenamePage()

  // Seed ydoc metaMap from dbTitle if the CRDT has no title yet.
  // This runs once on mount (when ydoc is already server-synced — PageEditorBody
  // is guarded by serverSynced=true in the parent). Wrapping in a transact
  // with origin 'db-seed' prevents this from being broadcast to other peers.
  useEffect(() => {
    if (!metaMap.get('title') && dbTitle) {
      log.debug('Seeding ydoc meta.title from DB', { dbTitle })
      ydoc.transact(() => {
        metaMap.set('title', dbTitle)
      }, 'db-seed')
      setTitle(dbTitle)
      titleRef.current = dbTitle
    }
    // Only run when dbTitle arrives (could be async from usePageById)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbTitle])

  // Cancel pending debounce on unmount to prevent state updates on unmounted component.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Sync from Yjs → React state (remote user changed title via ydoc CRDT)
  useEffect(() => {
    const handler = () => {
      const newTitle = metaMap.get('title') ?? ''
      setTitle(newTitle)
      titleRef.current = newTitle
    }
    metaMap.observe(handler)
    return () => metaMap.unobserve(handler)
  }, [metaMap])

  /** Persist title to DB, guarded. */
  const persistTitle = (value: string) => {
    if (!canEdit) return
    if (!pageId || !project?.id || !value.trim()) return
    log.debug('Persisting title to DB', { pageId, title: value.trim() })
    renamePage({ pageId, projectId: project.id, title: value.trim() })
  }

  const handleChange = (value: string) => {
    // 1. Update local React state immediately (no lag in UI)
    setTitle(value)
    titleRef.current = value

    // 2. Propagate to all collaborators via Yjs CRDT (real-time)
    ydoc.transact(() => {
      metaMap.set('title', value)
    }, 'local')

    // 3. Debounce DB persistence — reset timer on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      persistTitle(titleRef.current)
      debounceRef.current = null
    }, TITLE_DEBOUNCE_MS)
  }

  const handleBlur = () => {
    // Cancel pending debounce and persist immediately on focus loss.
    // Prevents double-fire if the debounce timer is mid-flight.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    persistTitle(titleRef.current)
  }

  return (
    <input
      className="w-full bg-transparent text-32 font-semibold tracking-tight text-primary placeholder:text-tertiary/40 outline-none border-none resize-none mb-2 leading-tight disabled:cursor-default"
      value={title}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      placeholder="Untitled"
      disabled={!canEdit}
      aria-label="Page title"
      aria-readonly={!canEdit}
    />
  )
}
