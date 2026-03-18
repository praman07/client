/**
 * Maps errors from the createIssue mutation to user-friendly messages.
 * @layer Features
 */
export function mapCreateIssueError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('not found') || msg.includes('invalid status'))
      return 'Invalid status for this project. Please refresh and try again.'
    if (msg.includes('not a member'))
      return 'Selected assignee is not a member of this project.'
    if (msg.includes('label')) return 'One or more selected labels are invalid.'
  }
  return 'Failed to create issue. Please try again.'
}
