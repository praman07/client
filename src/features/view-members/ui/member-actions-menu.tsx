import { Fragment, useState } from 'react'
import { Loader2, MoreHorizontal } from 'lucide-react'
import { MEMBER_ACTIONS } from '../lib/member-actions'
import { useRemoveMember } from '../hooks'
import type { WorkspaceMember } from '../model/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { usePermission } from '@/shared/lib/auth'
import { cn } from '@/shared/lib/utils'

interface MemberActionsMenuProps {
  member: WorkspaceMember
  workspaceId: string
  actorRank: number
  actorUserId: string
}

export function MemberActionsMenu({
  member,
  workspaceId,
  actorRank,
  actorUserId,
}: MemberActionsMenuProps) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const { mutate: removeMember, isPending } = useRemoveMember(workspaceId)

  const isSelf = member.user.id === actorUserId

  const canRemove = usePermission('workspace:member:remove')
  const canRead = usePermission('workspace:member:read')

  const permMap: Record<string, boolean> = {
    'workspace:member:remove': canRemove,
    'workspace:member:read': canRead,
  }

  const visibleActions = MEMBER_ACTIONS.filter((action) => {
    const hasPerm = permMap[action.permission] ?? false
    const rankOk = action.isAvailable(actorRank, member.roleRank)
    if (action.key === 'remove' && isSelf) return false
    return hasPerm && rankOk
  })

  if (visibleActions.length === 0) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-25 cursor-default"
        disabled
        tabIndex={-1}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          {visibleActions.map((action, idx) => {
            const isDestructive = action.variant === 'destructive'
            const prevIsDefault =
              idx > 0 && visibleActions[idx - 1]?.variant !== 'destructive'

            return (
              <Fragment key={action.key}>
                {isDestructive && prevIsDefault && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  data-variant={isDestructive ? 'destructive' : undefined}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 text-sm',
                  )}
                  onClick={() => {
                    if (action.key === 'remove') setConfirmRemove(true)
                  }}
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {action.label}
                </DropdownMenuItem>
              </Fragment>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-semibold text-foreground">
                {member.user.fullName || member.user.email}
              </span>{' '}
              from this workspace? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                removeMember({ memberId: member.id })
                setConfirmRemove(false)
              }}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
