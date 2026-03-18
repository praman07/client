/**
 * Maps errors from label management mutations to user-friendly messages.
 * @layer Features
 */
export function mapLabelError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('duplicate') || msg.includes('already exists'))
      return 'A label with this name already exists in the project.'
    if (msg.includes('not found'))
      return 'Label not found. Please refresh and try again.'
  }
  return 'Failed to update label. Please try again.'
}
