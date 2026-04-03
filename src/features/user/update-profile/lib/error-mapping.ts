/**
 * Maps backend GraphQL errors and Clerk errors to user-friendly messages.
 * Always logs the raw error to console.error so devs can diagnose failures.
 */
export function mapUpdateProfileError(error: unknown): string {
  // Always log the actual error — the mapped message hides root causes
  console.error('[UpdateProfile] raw error:', error)

  if (!error) return 'Failed to update profile'

  const message = (error as { message?: string }).message ?? ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to update your profile'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to update this profile'
  }

  if (message.includes('NOT_FOUND')) {
    return 'User profile not found. Please try refreshing the page.'
  }

  if (message.includes('Network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }

  if (message.includes('File size') || message.includes('too large')) {
    return 'Image is too large. Please choose a file under 10MB.'
  }

  if (message.includes('Invalid file') || message.includes('mime type')) {
    return 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
  }

  return 'Failed to update profile. Please try again.'
}
