import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Link2Off } from 'lucide-react'
import { RouteError } from '@/shared/ui/error/route-error'
import { JoinWorkspaceFlow } from '@/widgets/join-workspace/join-workspace-flow'
import { Button } from '@/shared/ui/primitives/button'
import { ErrorStateCard } from '@/shared/ui/feedback/error-state-card'

const joinSearchSchema = z.object({
  token: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_app/workspace/join')({
  validateSearch: joinSearchSchema,
  loaderDeps: ({ search: { token } }) => ({ token }),
  loader: () => null,
  component: JoinPage,
  errorComponent: RouteError,
})

function JoinPage() {
  const { token } = Route.useSearch()

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
