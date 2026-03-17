import type { IssuePriority } from '@/entities/issue'

/**
 * Variables passed to the createIssue GraphQL mutation.
 * @layer Features
 */
export interface CreateIssueVariables {
  projectId: string
  title: string
  statusId: string
  priority: IssuePriority
  assigneeId: string | null
  labelIds: Array<string>
  dueDate: string | null
}
