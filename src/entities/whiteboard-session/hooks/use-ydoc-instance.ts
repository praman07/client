import { useEffect, useRef } from 'react'
import type { Doc as YDoc } from 'yjs'
import { createYDoc, destroyYDoc } from '../lib/ydoc-manager'

export function useYDocInstance(boardId: string | null): YDoc | null {
  const ydocRef = useRef<YDoc | null>(null)

  useEffect(() => {
    if (!boardId) {
      if (ydocRef.current) {
        destroyYDoc(boardId!)
        ydocRef.current = null
      }
      return
    }

    const ydoc = createYDoc(boardId)
    ydocRef.current = ydoc

    return () => {
      destroyYDoc(boardId)
      ydocRef.current = null
    }
  }, [boardId])

  return ydocRef.current
}
