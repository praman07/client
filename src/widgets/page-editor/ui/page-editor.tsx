import '@blocknote/shadcn/style.css'
import { reset as resetLinkify } from 'linkifyjs'
import { useMemo, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import * as Y from 'yjs'
import { usePageSync } from '../hooks/use-page-sync'
import type { PageAwarenessProvider } from '@/entities/page-session'
import { assignColor } from '@/entities/page-presence/lib/color-assignment'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentUser } from '@/entities/user/model/selectors'
import { PageEditorSkeleton } from './page-editor-skeleton'
import { PageTitle } from './page-title'
import { LockedBanner } from './locked-banner'
import { CollaboratorBar } from './collaborator-bar'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:page-editor')

interface PageEditorProps {
  pageId: string
}

/**
 * PageEditor — two-layer orchestrator.
 *
 * Layer 1: runs usePageSync (Phases 1–4) — owns Y.Doc + AwarenessProvider.
 * Layer 2: PageEditorBody — only mounts after serverSynced=true, so BlockNote
 *          reads the fragment only after server data has been applied.
 *
 * @layer Widgets
 */
export function PageEditor({ pageId }: PageEditorProps) {
  const { ydoc, awarenessProvider, serverSynced, isLocked } =
    usePageSync(pageId)

  log.debug('Render', { pageId, serverSynced, isLocked })

  if (!serverSynced) return <PageEditorSkeleton />

  return (
    <PageEditorBody
      ydoc={ydoc}
      awarenessProvider={awarenessProvider}
      isLocked={isLocked}
    />
  )
}

// ─── PageEditorBody ───────────────────────────────────────────────────────────
// Only mounts when serverSynced=true — guarantees the Y.Doc has server content
// before BlockNote reads its "blocknote" XmlFragment.

interface PageEditorBodyProps {
  ydoc: Y.Doc
  awarenessProvider: PageAwarenessProvider
  isLocked: boolean
}

function PageEditorBody({
  ydoc,
  awarenessProvider,
  isLocked,
}: PageEditorBodyProps) {
  // Reset linkifyjs before each mount so BlockNote can re-register all schemes
  // (http, https, ftp, mailto, tel...) without 'already initialized' warnings.
  // useRef guard: runs once per mount, skipped on re-renders.
  const linkifyResetDone = useRef(false)
  if (!linkifyResetDone.current) {
    linkifyResetDone.current = true
    resetLinkify()
  }

  const currentUser = useAppSelector(selectCurrentUser)

  const userColor = useMemo(
    () => (currentUser?.id ? assignColor(currentUser.id) : '#6366f1'),
    [currentUser?.id],
  )

  log.debug('PageEditorBody mount — binding BlockNote to ydoc fragment', {
    isLocked,
    userId: currentUser?.id,
  })

  const editor = useCreateBlockNote({
    collaboration: {
      // BlockNote reads/writes to the "blocknote" XmlFragment internally.
      // MUST match this name — "content" or "default" will produce an empty editor.
      fragment: ydoc.getXmlFragment('blocknote'),
      provider: {
        // Passes our Yjs Awareness instance for real-time cursor positions
        awareness: awarenessProvider.awareness,
      },
      user: {
        name: currentUser?.fullName ?? 'Anonymous',
        color: userColor,
      },
      showCursorLabels: "always",
    },
  })

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="mx-auto w-full max-w-3xl px-2 py-12">
        <CollaboratorBar />

        {/* <PageCover ydoc={ydoc} /> */}

        <PageTitle ydoc={ydoc} isLocked={isLocked} />

        {isLocked && <LockedBanner />}

        <BlockNoteView
          editor={editor}
          theme="light"
          editable={!isLocked}
        />
      </div>
    </div>
  )
}
