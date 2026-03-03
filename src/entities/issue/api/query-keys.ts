/**
 * TanStack Query key factory for the issue entity.
 *
 * Consumed by:
 *  - widgets/issues-board          → issueKeys.list(projectId)
 *  - features/issues/edit-issue    → issueKeys.detail(issueId)
 *  - features/issues/edit-issue    → issueKeys.descriptionUrl(issueId)
 *  - features/issues/create-issue  → invalidates issueKeys.list(projectId)
 *  - features/issues/drag-issue    → invalidates issueKeys.list(projectId)
 *
 * @layer Entity
 */
export const issueKeys = {
  all: (projectId: string) => ['issues', projectId] as const,

  /**
   * Full flat list of issues for a project (board primary query).
   * staleTime: 30s. Invalidated by all create / update / drag mutations.
   */
  list: (projectId: string) => [...issueKeys.all(projectId), 'list'] as const,

  /**
   * Full detail for a single issue, including descriptionS3Key (edit modal).
   * staleTime: 30s. Invalidated by updateIssue.
   */
  detail: (issueId: string) => ['issues', 'detail', issueId] as const,

  /**
   * Short-lived presigned S3 GET URL for the issue description.
   * staleTime: 0, gcTime: 0 — NEVER cache. Always request fresh.
   * Server TTL = 5 min.
   */
  descriptionUrl: (issueId: string) =>
    ['issues', 'description-url', issueId] as const,
}
