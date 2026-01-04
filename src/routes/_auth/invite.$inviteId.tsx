import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/invite/$inviteId')({
  component: InvitePage,
})

function InvitePage() {
  const { inviteId } = Route.useParams()
  return <div className="text-center">Accepting Invite: {inviteId}</div>
}
