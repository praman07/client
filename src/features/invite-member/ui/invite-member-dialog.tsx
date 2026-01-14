import { useState } from 'react'
import { InviteMemberForm } from './invite-member-form'
import { selectCurrentWorkspace } from '@/entities/session/model/selectors'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/redux'

interface Props {
  children: React.ReactNode
}

export function InviteMemberDialog({ children }: Props) {
  const [open, setOpen] = useState(false)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      {open && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Invite teammates to <b>{currentWorkspace?.name}</b>.
            </DialogDescription>
          </DialogHeader>
          <InviteMemberForm onClose={() => setOpen(false)} />
        </DialogContent>
      )}
    </Dialog>
  )
}
