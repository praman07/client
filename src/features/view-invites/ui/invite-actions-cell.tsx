import { Loader2 } from 'lucide-react'
import { useCancelInvite, useResendInvite } from '../hooks'
import type { WorkspaceInvite } from '../model/types'

interface InviteActionsCellProps {
  invite: WorkspaceInvite
  workspaceId: string
  canResend: boolean
  canCancel: boolean
}

export function InviteActionsCell({
  invite,
  workspaceId,
  canResend,
  canCancel,
}: InviteActionsCellProps) {
  const { mutate: cancelInvite, isPending: isCancelling } = useCancelInvite(workspaceId)
  const { mutate: resendInvite, isPending: isResending } = useResendInvite(workspaceId)

  const isAnyPending = isCancelling || isResending

  return (
    <div className="flex items-center justify-end gap-4 pr-1">
      {canResend && (
        <button
          onClick={() => resendInvite({ inviteId: invite.id })}
          disabled={isAnyPending}
          className="text-11 font-semibold tracking-wider text-accent-primary hover:text-accent-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase flex items-center gap-1"
        >
          {isResending && <Loader2 className="h-3 w-3 animate-spin" />}
          Resend
        </button>
      )}
      {canCancel && (
        <button
          onClick={() => cancelInvite({ inviteId: invite.id })}
          disabled={isAnyPending}
          className="text-11 font-semibold tracking-wider text-danger-primary hover:text-danger-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase flex items-center gap-1"
        >
          {isCancelling && <Loader2 className="h-3 w-3 animate-spin" />}
          Revoke
        </button>
      )}
    </div>
  )
}
