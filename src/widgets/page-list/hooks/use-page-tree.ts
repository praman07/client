import type { Page } from '@/entities/page'
import type { PageTreeNode } from '../lib/types'

/**
 * Converts a flat Page[] (with parentId references) into a nested PageTreeNode[].
 * Runs in O(n). Uses position for sibling ordering.
 *
 * The input already has children[] pre-populated 3 levels deep by getProjectPages
 * (the server inline-populates them). We convert those into PageTreeNodes for
 * recursive rendering without a second pass.
 *
 * @layer Widgets
 */
export function buildPageTree(pages: Array<Page>): Array<PageTreeNode> {
  function toNode(page: Page): PageTreeNode {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- GraphQL can return null for children field
    const sorted = [...(page.children ?? [])].sort(
      (a, b) => a.position - b.position,
    )
    return {
      page,
      children: sorted.map(toNode),
    }
  }

  return pages
    .filter((p) => !p.parentId) // roots only — server already nests children
    .sort((a, b) => a.position - b.position)
    .map(toNode)
}

/**
 * Hook — wraps buildPageTree as a stable reference.
 * Used by PageSidebar to build the tree from useProjectPages data.
 */
export function usePageTree(pages: Array<Page>): Array<PageTreeNode> {
  // Memoisation happens in the parent via useMemo; this is just the pure fn call.
  return buildPageTree(pages)
}
