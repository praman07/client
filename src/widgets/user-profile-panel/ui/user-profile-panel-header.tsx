import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives'

interface UserProfilePanelHeaderProps {
  avatarUrl?: string
  displayName: string
  email: string
  projectRole?: string
}

export function UserProfilePanelHeader({
  avatarUrl,
  displayName,
  email,
  projectRole,
}: UserProfilePanelHeaderProps) {
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    toast.success('Email copied to clipboard')
  }

  return (
    <div className="flex items-start gap-4 px-6 py-5 border-b border-subtle">
      <Avatar className="h-24 w-24 rounded-xl shrink-0">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="rounded-xl text-2xl font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-primary truncate">
          {displayName}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-secondary truncate">{email}</p>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopyEmail}
            aria-label="Copy email"
          >
            <Copy size={14} />
          </Button>
        </div>
        {projectRole && (
          <Badge variant="outline" className="w-fit mt-1">
            {projectRole}
          </Badge>
        )}
      </div>
    </div>
  )
}
