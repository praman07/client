import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'

interface CollaboratorAvatarProps {
  userName: string
  avatarUrl: string | null
  color: string
  isIdle?: boolean
}

export function CollaboratorAvatar({
  userName,
  avatarUrl,
  color,
  isIdle = false,
}: CollaboratorAvatarProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar
      className="h-8 w-8"
      style={{
        opacity: isIdle ? 0.5 : 1,
        borderColor: color,
        borderWidth: 2,
      }}
    >
      <AvatarImage src={avatarUrl ?? undefined} alt={userName} />
      <AvatarFallback style={{ backgroundColor: color }} className="text-on-color">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
