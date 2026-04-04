export function mapInvitesError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('FORBIDDEN')) return 'You do not have permission to view invitations.'
    if (error.message.includes('NOT_FOUND')) return 'Invitation not found or already accepted.'
    return error.message
  }
  return 'An unexpected error occurred.'
}
