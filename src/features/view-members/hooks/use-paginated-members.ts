import { useMemo } from 'react'
import type { WorkspaceMember } from '../model/types'

interface PaginatedMembersResult {
  filtered: WorkspaceMember[]
  paginated: WorkspaceMember[]
  totalPages: number
  totalCount: number
  safePage: number
}

/**
 * usePaginatedMembers
 * 
 * Handles client-side filtering and slicing for member lists.
 * Clamps the page to within valid bounds if the filtered set changes.
 */
export function usePaginatedMembers(
  allMembers: WorkspaceMember[],
  search: string,
  page: number,
  pageSize: number,
): PaginatedMembersResult {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allMembers
    return allMembers.filter(
      (m) =>
        (m.user.fullName ?? '').toLowerCase().includes(q) ||
        m.user.email.toLowerCase().includes(q),
    )
  }, [allMembers, search])

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return { filtered, paginated, totalPages, totalCount, safePage }
}
