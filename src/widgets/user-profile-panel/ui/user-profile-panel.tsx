import { useUserProfilePanel } from '@/features/chat/user-profile-panel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { useMemberCache } from '@/widgets/chat-window/lib/member-cache-context'

export function UserProfilePanel() {
  const { isOpen, userId, close } = useUserProfilePanel()
  const { getMemberInfo } = useMemberCache()

  const member = userId ? getMemberInfo(userId) : null

  const displayName = member?.fullName ?? member?.email ?? 'User'
  const avatarUrl = member?.avatarUrl ?? undefined
  const email = member?.email ?? ''
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-sm w-[calc(100vw-2rem)] flex flex-col p-0 gap-0 overflow-hidden bg-surface-1 border-subtle">
        <DialogHeader className="px-6 pt-5 pb-4 shrink-0 border-b border-subtle">
          <DialogTitle className="text-base font-semibold text-primary">
            Profile
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <Avatar className="h-20 w-20 rounded-xl">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="rounded-xl text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <p className="text-base font-semibold text-primary">
              {displayName}
            </p>
            {email && (
              <p className="text-sm text-secondary">{email}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
