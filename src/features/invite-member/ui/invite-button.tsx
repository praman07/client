import { UserPlus } from 'lucide-react'
import { InviteMemberDialog } from './invite-member-dialog'
import { Button } from '@/shared/ui/primitives/button'

type InviteButtonProps = React.ComponentProps<typeof Button>

export function InviteButton(props: InviteButtonProps) {
  return (
    <InviteMemberDialog>
      <Button {...props}>
        <UserPlus className="mr-2 h-4 w-4" />
        Invite Members
      </Button>
    </InviteMemberDialog>
  )
}
