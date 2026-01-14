import { Link } from '@tanstack/react-router'
import { Link2Off } from 'lucide-react'
import { JoinWorkspaceFlow } from '@/features/join-workspace'
import { Button, ErrorStateCard } from '@/shared/ui'

interface JoinPageProps {
  token?: string
}

export function JoinWorkspacePage({ token }: JoinPageProps) {
  if (!token) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <ErrorStateCard
          icon={Link2Off}
          title="Invalid Invite Link"
          description="It looks like this invite link is missing or incomplete. Please check the URL or ask the workspace admin for a new invitation."
          action={
            <Button asChild variant="default">
              <Link to="/onboarding">Go to Workspace</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <JoinWorkspaceFlow token={token} />
    </div>
  )
}
