/**
 * Maps errors from edit-issue operations to user-friendly messages.
 * @layer Features
 */
export function mapUpdateIssueError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('not found'))
      return 'Issue not found. Please refresh and try again.'
    if (msg.includes('not a member'))
      return 'Selected assignee is not a project member.'
  }
  return 'Failed to save issue. Please try again.'
}

export function mapDescriptionUploadError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('not found'))
      return 'Description file not found in storage. Please try again.'
    if (msg.includes('already confirmed') || msg.includes('409'))
      return 'Description was already saved. Please reload.'
  }
  return 'Failed to save description. Please try again.'
}
