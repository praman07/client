import { useQuery } from '@tanstack/react-query'
import { createGqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/auth'
import { GET_WORKSPACE_INVITE_INFO } from '@/features/join-workspace/api'
import { joinWorkspaceKeys } from '@/features/join-workspace/api/query-keys'
import { Button } from '@/shared/ui/primitives/button'
import { JoinWorkspaceCard } from '@/features/join-workspace/ui/join-workspace-card'

interface JoinWorkspaceFlowProps {
  token: string
}

export function JoinWorkspaceFlow({ token }: JoinWorkspaceFlowProps) {
  const { getToken } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: joinWorkspaceKeys.info(token),
    queryFn: async () => {
      const t = await getToken()
      const client = createGqlClient(t)
      return client.request(GET_WORKSPACE_INVITE_INFO, { token })
    },
    retry: false,
  })

  const errorCode = (error as any)?.response?.errors?.[0]?.extensions?.code

  if (errorCode === 'INVITE_NOT_FOUND' || errorCode === 'INVITE_EXPIRED') {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center text-destructive max-w-md w-full border border-destructive/20 shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Invalid Invite</h3>
        <p className="text-sm opacity-90">
          This invite link is either invalid or has expired. Please ask for a
          new invitation.
        </p>
      </div>
    )
  }

  if (errorCode === 'ALREADY_WORKSPACE_MEMBER') {
    return (
      <div className="rounded-md bg-blue-50 p-6 text-center text-blue-900 max-w-md w-full border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Already a Member</h3>
        <p className="text-sm opacity-90 mb-4">
          You are already a member of this workspace.
        </p>
        <Button variant="default" onClick={() => (window.location.href = '/')}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !data?.getWorkspaceInviteInfo) {
    // Re-throw generic errors to the route ErrorBoundary
    throw error
  }

  return (
    <JoinWorkspaceCard
      token={token}
      workspaceName={data.getWorkspaceInviteInfo.workspaceName}
      workspaceLogoUrl={data.getWorkspaceInviteInfo.workspaceLogoUrl}
      inviterName={data.getWorkspaceInviteInfo.inviterName ?? 'Someone'}
    />
  )
}
