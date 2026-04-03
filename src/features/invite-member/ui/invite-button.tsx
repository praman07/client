import { UserPlus } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useInviteMemberModal } from '../hooks/use-invite-member-modal'
import type React from 'react'

type InviteButtonProps = React.ComponentProps<typeof Button>

/**
 * InviteButton — calls useInviteMemberModal().open() imperatively.
 * Wrap with <Guard permission="workspace:member:invite"> at the call-site.
 */
export function InviteButton(props: InviteButtonProps) {
  const { open } = useInviteMemberModal()

  return (
    <Button onClick={open} {...props}>
      <UserPlus className="mr-2 h-4 w-4" />
      Invite Members
    </Button>
  )
}
