/**
 * Maps errors from status management mutations to user-friendly messages.
 * @layer Features
 */
export function mapStatusError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('system') && msg.includes('delete'))
      return 'System columns cannot be deleted.'
    if (msg.includes('issues') || msg.includes('not empty'))
      return 'Move or delete all issues in this column before deleting it.'
    if (msg.includes('duplicate') || msg.includes('already exists'))
      return 'A column with this name already exists.'
  }
  return 'Failed to update column. Please try again.'
}
