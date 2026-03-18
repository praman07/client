/**
 * TanStack Query key factory for the issue-label entity.
 *
 * Consumed by:
 *  - widgets/issues-board            → issueLabelKeys.list(projectId)
 *  - features/issues/manage-labels  → invalidates issueLabelKeys.list(projectId)
 *  - features/issues/create-issue   → reads list for label picker
 *  - features/issues/edit-issue     → reads list for label picker
 *
 * @layer Entity
 */
export const issueLabelKeys = {
  all: (projectId: string) => ['issue-labels', projectId] as const,

  /**
   * All labels defined in a project.
   * staleTime: 60s.
   * Invalidated by: createIssueLabel, updateIssueLabel, deleteIssueLabel.
   */
  list: (projectId: string) =>
    [...issueLabelKeys.all(projectId), 'list'] as const,
}
