export function mapDeleteChannelError(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('not found')) {
    return 'Channel not found'
  }

  if (
    message.includes('not archived') ||
    message.includes('must be archived')
  ) {
    return 'Channel must be archived before deletion'
  }

  if (message.includes('forbidden') || message.includes('permission')) {
    return "You don't have permission to delete this channel"
  }

  return 'Failed to delete channel. Please try again.'
}
