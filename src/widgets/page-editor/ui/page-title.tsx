import { useEffect, useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import type * as Y from 'yjs'
import { useRenamePage } from '@/features/pages/rename-page'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:page-title')

interface PageTitleProps {
  ydoc: Y.Doc
  isLocked: boolean
}

/**
 * PageTitle — Collaborative, Yjs-bound title input.
 *
 * Binds to ydoc.getMap('meta').get('title').
 * Changes propagate to all peers via Yjs in real-time.
 * On blur → calls renamePage mutation to persist to PostgreSQL.
 *
 * @layer Widgets
 */
export function PageTitle({ ydoc, isLocked }: PageTitleProps) {
  const { pageId } = useParams({ strict: false })
  const project = useAppSelector(selectCurrentProject)
  const metaMap = ydoc.getMap<string>('meta')
  const [title, setTitle] = useState<string>(() => metaMap.get('title') ?? '')
  const titleRef = useRef(title)
  const { mutate: renamePage } = useRenamePage()

  // Sync from Yjs → React state (remote user changed title)
  useEffect(() => {
    const handler = () => {
      const newTitle = metaMap.get('title') ?? ''
      setTitle(newTitle)
      titleRef.current = newTitle
    }
    metaMap.observe(handler)
    return () => metaMap.unobserve(handler)
  }, [metaMap])

  const handleChange = (value: string) => {
    setTitle(value)
    titleRef.current = value
    ydoc.transact(() => {
      metaMap.set('title', value)
    }, 'local')
  }

  const handleBlur = () => {
    if (!pageId || !titleRef.current.trim() || !project?.id) return
    log.debug('Persisting title to DB', { pageId, title: titleRef.current })
    renamePage({
      pageId,
      projectId: project.id,
      title: titleRef.current.trim(),
    })
  }

  return (
    <input
      className="w-full bg-transparent text-4xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 outline-none border-none resize-none mb-2 leading-tight"
      value={title}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      placeholder="Untitled"
      disabled={isLocked}
      aria-label="Page title"
    />
  )
}
