import * as Y from 'yjs'

export interface PageDocConfig {
  pageId: string
  gc?: boolean // Garbage collection (default: true)
}

/**
 * Factory to create and configure Y.Doc instances for pages
 *
 * Pre-initializes the three shared types that the page editor uses:
 * - 'content' (XmlFragment) — Tiptap ProseMirror document tree
 * - 'meta' (Map)            — title, icon, coverUrl (all synced)
 * - 'config' (Map)          — initialContentLoaded one-shot guard
 *
 * GUID = pageId so any process (gateway, snapshot handler, stream worker)
 * that creates a Y.Doc for the same page merges edits correctly.
 *
 * @layer Entity
 */
export function createPageDoc({ pageId, gc }: PageDocConfig): Y.Doc {
  const ydoc = new Y.Doc({
    guid: pageId,
    gc: gc ?? true,
  })

  // Pre-initialize shared types for structural consistency.
  // Accessing them here ensures every Y.Doc created anywhere for this page
  // has the same root-level shared type layout before any updates are applied.
  ydoc.getXmlFragment('content') // Tiptap binding target (ProseMirror tree)
  ydoc.getMap('meta') // title, icon, coverUrl
  ydoc.getMap('config') // one-shot initialContentLoaded flag

  return ydoc
}
