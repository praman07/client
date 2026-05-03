'use client'

import { Send, X } from 'lucide-react'
import { useUserProfilePanel } from '@/features/chat/user-profile-panel'
import { useCreateDm } from '@/features/chat/create-dm/hooks/use-create-dm'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/primitives/sheet'
import { Button } from '@/shared/ui/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Badge } from '@/shared/ui/primitives/badge'
import { useMemberCache } from '@/widgets/chat-window/lib/member-cache-context'
import { cn } from '@/shared/lib/utils'

export function UserProfilePanel() {
  const { isOpen, userId, close } = useUserProfilePanel()
  const { getMemberInfo } = useMemberCache()
  const { mutate: createDm } = useCreateDm()

  const member = userId ? getMemberInfo(userId) : null

  const displayName = member?.fullName ?? member?.email ?? 'User'
  const avatarUrl = member?.avatarUrl ?? undefined
  const email = member?.email ?? ''
  const role = member?.role

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const formatJoinedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const handleSendDM = () => {
    if (!userId) return
    createDm(userId)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col overflow-hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            View user information
          </SheetDescription>
        </SheetHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Avatar - 3xl size (96px), square shape */}
          <div className="mb-6">
            <Avatar size="3xl" shape="square">
              {avatarUrl && (
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-layer-2 text-24 font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <h2 className="text-18 font-semibold text-primary tracking-tight mb-1">
            {displayName}
          </h2>

          {/* Email */}
          <p className="text-13 text-secondary mb-3">
            {email}
          </p>

          {/* Role Badge */}
          {role && (
            <Badge variant="accent" className="mb-3">
              {role}
            </Badge>
          )}

          {/* Member Since */}
          {member?.joinedAt && (
            <p className="text-12 text-tertiary mb-6">
              Member since {formatJoinedDate(member.joinedAt)}
            </p>
          )}

          {/* Action Button */}
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleSendDM}
          >
            <Send size={16} className="mr-2" />
            Send Direct Message
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle bg-layer-1">
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-secondary hover:text-primary"
            onClick={close}
          >
            <X size={16} className="mr-2" />
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
