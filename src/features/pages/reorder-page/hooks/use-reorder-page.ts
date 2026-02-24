import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import type { Page } from '@/entities/page'
import { REORDER_PAGE } from '../api/fragments'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:reorder-page-hook')

export interface ReorderPageVariables {
  pageId: string
  /** Required for cache targeting — not sent to server */
  projectId: string
  /** null = move to root (remove from parent) */
  newParentId?: string | null
  newPosition: number
}

/**
 * Mutation hook for moving a page to a new position in the tree.
 *
 * Supports:
 *  - Reordering within same parent (newParentId unchanged)
 *  - Cross-parent move (newParentId changes)
 *  - Move to root (newParentId = null)
 *
 * Server guard: CONFLICT if newParentId is a descendant of pageId (cycle).
 *
 * Optimistic update: moves page in local cache tree instantly.
 * onError: rolls back to snapshot.
 * onSettled: invalidates to sync with server truth.
 *
 * @layer Features
 */
export function useReorderPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      pageId,
      newParentId,
      newPosition,
    }: ReorderPageVariables) => {
      log.info('Reordering page', { pageId, newParentId, newPosition })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(REORDER_PAGE, {
        input: { pageId, newParentId, newPosition },
      })
    },

    onMutate: async ({ pageId, projectId, newParentId, newPosition }) => {
      await queryClient.cancelQueries({
        queryKey: pageKeys.projectPages(projectId),
      })
      const snapshot = queryClient.getQueryData<Page[]>(
        pageKeys.projectPages(projectId),
      )

      queryClient.setQueryData<Page[]>(
        pageKeys.projectPages(projectId),
        (old) =>
          old
            ? movePageInTree(old, pageId, newParentId ?? null, newPosition)
            : old,
      )

      log.debug('Optimistic reorder applied', {
        pageId,
        newParentId,
        newPosition,
      })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Reorder failed — rolling back', { pageId, err })
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(
          pageKeys.projectPages(projectId),
          context.snapshot,
        )
      }
    },

    onSettled: (_data, _err, { projectId }) => {
      // Always re-sync after a tree move — optimistic helper may have edge cases
      queryClient.invalidateQueries({
        queryKey: pageKeys.projectPages(projectId),
      })
    },
  })
}

// ─── Pure tree helpers ───────────────────────────────────────────────────────

/**
 * Moves a page to a new position and optional new parent in the tree.
 *
 * Algorithm:
 *  1. Extract the page from its current location (any depth)
 *  2. Update its parentId and position
 *  3. Insert it into the correct new parent, sorted by position
 */
function movePageInTree(
  pages: Page[],
  pageId: string,
  newParentId: string | null,
  newPosition: number,
): Page[] {
  const { page: extracted, tree: stripped } = extractPage(pages, pageId)
  if (!extracted) return pages

  const updated: Page = {
    ...extracted,
    parentId: newParentId,
    position: newPosition,
  }
  return insertPage(stripped, updated, newParentId)
}

/** Extract a page from any depth in the tree. Returns the page + the tree without it. */
function extractPage(
  pages: Page[],
  pageId: string,
): { page: Page | null; tree: Page[] } {
  let found: Page | null = null

  const tree = pages
    .filter((p) => {
      if (p.id === pageId) {
        found = p
        return false
      }
      return true
    })
    .map((p) => {
      if (!p.children?.length) return p
      const result = extractPage(p.children as Page[], pageId)
      if (result.page) found = result.page
      return { ...p, children: result.tree }
    })

  return { page: found, tree }
}

/** Insert a page under newParentId (or at root if null), sorted by position. */
function insertPage(
  pages: Page[],
  page: Page,
  newParentId: string | null,
): Page[] {
  if (newParentId === null) {
    // Insert at root level, sorted by position
    return [...pages, page].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    )
  }

  return pages.map((p) => {
    if (p.id === newParentId) {
      const children = [...((p.children as Page[]) ?? []), page].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
      )
      return { ...p, children }
    }
    if (p.children?.length) {
      return {
        ...p,
        children: insertPage(p.children as Page[], page, newParentId),
      }
    }
    return p
  })
}
