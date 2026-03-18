/**
 * useFilterIssues — Manages the board filter state in Redux.
 *
 * Returns:
 *   - filters: current IssueFilters state
 *   - setFilter(patch): merge a partial filter update
 *   - removeOneFilter(key): remove a single filter category
 *   - clearAllFilters(): wipe all filters
 *   - activeChips: computed display chips for the toolbar
 *   - hasActiveFilters: true if any filter is set
 *
 * @layer Features
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { IssueFilters } from '@/entities/issue'
import type { AppDispatch } from '@/app/store'
import type { FilterChip } from '../model/types'
import {
  clearFilters,
  removeFilter,
  selectIssueFilters,
  selectIssueLabels,
  selectIssueStatuses,
  setFilters,
} from '@/entities/issue'

const PRIORITY_LABELS: Record<string, string> = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  NO_PRIORITY: 'No Priority',
}

const DUE_DATE_LABELS: Record<string, string> = {
  overdue: 'Overdue',
  today: 'Today',
  'this-week': 'This Week',
  'no-date': 'No Date',
}

export function useFilterIssues() {
  const dispatch = useDispatch<AppDispatch>()
  const filters = useSelector(selectIssueFilters)
  const statuses = useSelector(selectIssueStatuses)
  const labels = useSelector(selectIssueLabels)

  const setFilter = useCallback(
    (patch: Partial<IssueFilters>) => {
      dispatch(setFilters(patch))
    },
    [dispatch],
  )

  const removeOneFilter = useCallback(
    (key: keyof IssueFilters) => {
      dispatch(removeFilter(key))
    },
    [dispatch],
  )

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  // ── Compute active chips from current filters ──────────────────────────────
  const activeChips: Array<FilterChip> = []

  if (filters.statusIds?.length) {
    const names = filters.statusIds
      .map((id) => statuses.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(', ')
    activeChips.push({ category: 'statusIds', label: `Status: ${names}` })
  }

  if (filters.priorities?.length) {
    const names = filters.priorities.map((p) => PRIORITY_LABELS[p]).join(', ')
    activeChips.push({ category: 'priorities', label: `Priority: ${names}` })
  }

  if (filters.assigneeIds?.length) {
    activeChips.push({
      category: 'assigneeIds',
      label: `Assignee: ${filters.assigneeIds.length} selected`,
    })
  }

  if (filters.labelIds?.length) {
    const names = filters.labelIds
      .map((id) => labels.find((l) => l.id === id)?.name)
      .filter(Boolean)
      .join(', ')
    activeChips.push({ category: 'labelIds', label: `Label: ${names}` })
  }

  if (filters.dueDate) {
    activeChips.push({
      category: 'dueDate',
      label: `Due: ${DUE_DATE_LABELS[filters.dueDate]}`,
    })
  }

  const hasActiveFilters = activeChips.length > 0

  return {
    filters,
    setFilter,
    removeOneFilter,
    clearAllFilters,
    activeChips,
    hasActiveFilters,
  }
}
