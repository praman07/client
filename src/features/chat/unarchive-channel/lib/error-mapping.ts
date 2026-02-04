export function mapUnarchiveChannelError(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('not found')) {
    return 'Channel not found'
  }

  if (message.includes('not archived')) {
    return 'This channel is not archived'
  }

  if (message.includes('forbidden') || message.includes('permission')) {
    return "You don't have permission to unarchive this channel"
  }

  return 'Failed to unarchive channel. Please try again.'
}
