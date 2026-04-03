import { Separator } from '@/shared/ui/primitives/separator'
import { UpdateProfileForm, AvatarUploadField } from '@/features/user/update-profile'

/**
 * UserProfilePage — pure composition root.
 * All state, form logic, and data flow lives in the update-profile feature slice.
 */
export function UserProfilePage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          This information is visible to your teammates across all workspaces.
        </p>
      </div>

      <AvatarUploadField />

      <Separator />

      <UpdateProfileForm />
    </div>
  )
}
