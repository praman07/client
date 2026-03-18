import type { IssuePriority } from '@/entities/issue'

/**
 * Variables for the updateIssue mutation.
 * All fields optional — only send what has changed.
 * @layer Features
 */
export interface UpdateIssueVariables {
  issueId: string
  title?: string
  statusId?: string
  priority?: IssuePriority
  assigneeId?: string | null
  labelIds?: Array<string>
  dueDate?: string | null
}

/**
 * Status of the 3-step S3 description upload process.
 * @layer Features
 */
export type DescriptionUploadStatus =
  | 'idle'
  | 'requesting'
  | 'uploading'
  | 'confirming'
  | 'done'
  | 'error'

export interface DescriptionUploadState {
  status: DescriptionUploadStatus
  error?: string
}
