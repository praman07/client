import type * as Y from 'yjs'

interface PageCoverProps {
  ydoc: Y.Doc
}

/**
 * PageCover — placeholder for cover image.
 * Reads coverUrl from ydoc.getMap('meta').
 * Full upload UI is a follow-up implementation.
 *
 * @layer Widgets
 */
export function PageCover({ ydoc }: PageCoverProps) {
  const metaMap = ydoc.getMap<string>('meta')
  const coverUrl = metaMap.get('coverUrl')

  if (!coverUrl) return null

  return (
    <div className="w-full h-40 overflow-hidden rounded-xl mb-6">
      <img
        src={coverUrl}
        alt="Page cover"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
