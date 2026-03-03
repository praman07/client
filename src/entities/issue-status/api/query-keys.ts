/**
 * TanStack Query key factory for the issue-status entity.
 *
 * Consumed by:
 *  - widgets/issues-board             → issueStatusKeys.list(projectId)
 *  - features/issues/manage-statuses → invalidates issueStatusKeys.list(projectId)
 *  - features/issues/drag-issue      → invalidates issueStatusKeys.list(projectId) on column reorder
 *
 * @layer Entity
 */
export const issueStatusKeys = {
  all: (projectId: string) => ['issue-statuses', projectId] as const,

  /**
   * All Kanban columns for a project, ordered by position.
   * staleTime: 60s.
   * Invalidated by: createIssueStatus, updateIssueStatus, deleteIssueStatus, reorderIssueStatus.
   */
  list: (projectId: string) =>
    [...issueStatusKeys.all(projectId), 'list'] as const,
}
