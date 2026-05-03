import { useUser as useClerkUser } from '@clerk/clerk-react'

/**
 * useClerkProfile — exposes Clerk-side profile mutations.
 *
 * Architecture: Clerk is the source of truth for auth-level data (fullName, avatar).
 * This hook wraps Clerk's imperative API so consumers call a clean, typed interface.
 *
 * Strategy: Always update Clerk first. If Clerk fails, abort DB write (avoids drift).
 * If DB fails after a successful Clerk update, we surface the error for user retry.
 */
export function useClerkProfile() {
  const { user } = useClerkUser()

  /**
   * Update fullName in Clerk. Splits the full name into firstName + lastName.
   * Throws if Clerk update fails so the caller can abort the DB write.
   */
  const updateClerkName = async (fullName: string): Promise<void> => {
    if (!user) throw new Error('No Clerk user session found')
    const trimmed = fullName.trim()
    const spaceIdx = trimmed.indexOf(' ')
    const firstName = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx)
    const lastName = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1)
    await user.update({ firstName, lastName })
  }

  /**
   * Upload avatar to Clerk, returns the new CDN image URL.
   * Strategy: setProfileImage returns an ImageResource (not a UserResource),
   * so we must call user.reload() to refresh the UserResource and read imageUrl.
   */
  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('No Clerk user session found')
    await user.setProfileImage({ file })
    await user.reload()
    return user.imageUrl
  }

  return { updateClerkName, uploadAvatar }
}
