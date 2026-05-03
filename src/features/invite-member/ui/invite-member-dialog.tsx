import { useInviteMemberModal } from '../hooks/use-invite-member-modal'
import { InviteMemberForm } from './invite-member-form'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { useAppSelector } from '@/shared/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

/**
 * InviteMemberDialog — Canonical Pattern B modal.
 *
 * Open state is held in Redux (inviteMember.isOpen).
 * Mount this once in the workspace layout — never inline at page level.
 * Trigger via useInviteMemberModal().open() from any component.
 */
export function InviteMemberDialog() {
  const { isOpen, close } = useInviteMemberModal()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  if (!currentWorkspace) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite teammates to <b>{currentWorkspace.name}</b>.
          </DialogDescription>
        </DialogHeader>
        {isOpen && <InviteMemberForm onClose={close} />}
      </DialogContent>
    </Dialog>
  )
}
