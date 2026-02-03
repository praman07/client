export function mapRenameChannelError(error: any): string {
  if (!error) return 'Failed to rename channel'

  const message = error.message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to rename channels'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to rename this channel'
  }

  if (message.includes('CONFLICT') || message.includes('already taken')) {
    return 'A channel with this name already exists'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Channel not found'
  }

  return 'Failed to rename channel. Please try again.'
}
