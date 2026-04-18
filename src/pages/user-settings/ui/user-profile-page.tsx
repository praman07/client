import { Separator } from '@/shared/ui/primitives/separator'
import { AvatarUploadField, UpdateProfileForm } from '@/features/user/update-profile'

/**
 * UserProfilePage — pure composition root.
 * All state, form logic, and data flow lives in the update-profile feature slice.
 */
export function UserProfilePage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-20 sm:text-24 font-bold tracking-tight">Profile</h1>
        <p className="text-13 sm:text-14 text-secondary mt-1">
          This information is visible to your teammates across all workspaces.
        </p>
      </div>

      <AvatarUploadField />

      <Separator />

      <UpdateProfileForm />
    </div>
  )
}
