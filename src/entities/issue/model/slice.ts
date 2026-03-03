/**
 * Issues board Redux slice — optimistic Kanban state.
 *
 * Strategy:
 *  - Features dispatch actions here BEFORE the GraphQL mutation resolves (optimistic).
 *  - On mutation error, features dispatch revert actions + show toast.error().
 *  - TanStack Query cache is the server-of-record; this slice is the display-of-record.
 *
 * Named "issues" → registered as store.issues in app/store/config.ts
 *
 * @layer Entity
 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Issue, IssueFilters } from './types'
import type { IssueStatus } from '@/entities/issue-status'
import type { IssueLabel } from '@/entities/issue-label'

interface IssuesBoardState {
  /** Columns ordered by position (fractional index) */
  statuses: IssueStatus[]
  /** All issues for the project — flat list, across all statuses */
  issues: Issue[]
  /** Project labels — for label picker popovers in create/edit modals */
  labels: IssueLabel[]
  /** Active board filters — client-side only, no refetch on change */
  filters: IssueFilters
}

const initialState: IssuesBoardState = {
  statuses: [],
  issues: [],
  labels: [],
  filters: {},
}

export const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    // ── Seed actions (called once on board mount) ───────────────────────────
    setStatuses(state, action: PayloadAction<IssueStatus[]>) {
      state.statuses = [...action.payload].sort(
        (a, b) => a.position - b.position,
      )
    },
    setIssues(state, action: PayloadAction<Issue[]>) {
      state.issues = action.payload
    },
    setLabels(state, action: PayloadAction<IssueLabel[]>) {
      state.labels = action.payload
    },

    // ── Issue actions (optimistic — dispatch before mutation) ──────────────
    addIssue(state, action: PayloadAction<Issue>) {
      state.issues.push(action.payload)
    },
    updateIssue(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Issue> }>,
    ) {
      const idx = state.issues.findIndex((i) => i.id === action.payload.id)
      if (idx !== -1) {
        state.issues[idx] = { ...state.issues[idx], ...action.payload.patch }
      }
    },
    removeIssue(state, action: PayloadAction<string>) {
      state.issues = state.issues.filter((i) => i.id !== action.payload)
    },
    /**
     * Move to a different column (cross-column drag).
     * Updates the embedded status.id + position atomically.
     */
    moveIssue(
      state,
      action: PayloadAction<{
        id: string
        newStatusId: string
        newPosition: number
      }>,
    ) {
      const { id, newStatusId, newPosition } = action.payload
      const idx = state.issues.findIndex((i) => i.id === id)
      if (idx !== -1) {
        state.issues[idx].status = {
          ...state.issues[idx].status,
          id: newStatusId,
        }
        state.issues[idx].position = newPosition
      }
    },
    /**
     * Reorder within the same column (same-column drag).
     * Only updates position — priority is never changed by drag.
     */
    reorderIssue(
      state,
      action: PayloadAction<{ id: string; newPosition: number }>,
    ) {
      const { id, newPosition } = action.payload
      const idx = state.issues.findIndex((i) => i.id === id)
      if (idx !== -1) {
        state.issues[idx].position = newPosition
      }
    },

    // ── Status column actions (optimistic) ─────────────────────────────────
    addStatus(state, action: PayloadAction<IssueStatus>) {
      state.statuses.push(action.payload)
      state.statuses.sort((a, b) => a.position - b.position)
    },
    updateStatus(
      state,
      action: PayloadAction<{ id: string; patch: Partial<IssueStatus> }>,
    ) {
      const idx = state.statuses.findIndex((s) => s.id === action.payload.id)
      if (idx !== -1) {
        state.statuses[idx] = {
          ...state.statuses[idx],
          ...action.payload.patch,
        }
      }
    },
    removeStatus(state, action: PayloadAction<string>) {
      state.statuses = state.statuses.filter((s) => s.id !== action.payload)
    },
    reorderStatus(
      state,
      action: PayloadAction<{ id: string; newPosition: number }>,
    ) {
      const { id, newPosition } = action.payload
      const idx = state.statuses.findIndex((s) => s.id === id)
      if (idx !== -1) {
        state.statuses[idx].position = newPosition
        state.statuses.sort((a, b) => a.position - b.position)
      }
    },

    // ── Filter actions ──────────────────────────────────────────────────────
    setFilters(state, action: PayloadAction<Partial<IssueFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = {}
    },
    /** Remove one filter category without clearing the rest. */
    removeFilter(state, action: PayloadAction<keyof IssueFilters>) {
      delete state.filters[action.payload]
    },
  },
})

export const {
  setStatuses,
  setIssues,
  setLabels,
  addIssue,
  updateIssue,
  removeIssue,
  moveIssue,
  reorderIssue,
  addStatus,
  updateStatus,
  removeStatus,
  reorderStatus,
  setFilters,
  clearFilters,
  removeFilter,
} = issuesSlice.actions

export default issuesSlice.reducer
