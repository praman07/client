export function mapArchiveChannelError(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('not found')) {
    return 'Channel not found'
  }

  if (message.includes('forbidden') || message.includes('permission')) {
    return "You don't have permission to archive this channel"
  }

  if (message.includes('already archived')) {
    return 'This channel is already archived'
  }

  return 'Failed to archive channel. Please try again.'
}
