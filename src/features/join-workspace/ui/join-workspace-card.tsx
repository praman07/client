import { Loader2 } from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAcceptInvite } from '../hooks'
import { mapAcceptInviteError } from '../lib'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui'
import { useUser } from '@/shared/hooks'

interface Props {
  token: string
  workspaceName: string
  workspaceLogoUrl?: string | null
  inviterName: string
}

export function JoinWorkspaceCard({
  token,
  workspaceName,
  workspaceLogoUrl,
  inviterName,
}: Props) {
  const { mutate, isPending } = useAcceptInvite()
  const { user } = useUser()
  const navigate = useNavigate()

  const handleJoin = () => {
    mutate(token, {
      onSuccess: (data) => {
        if (data.acceptWorkspaceInvite.success) {
          toast.success(data.acceptWorkspaceInvite.message)
          navigate({
            to: '/workspace/$workspaceSlug',
            params: { workspaceSlug: data.acceptWorkspaceInvite.workspaceSlug },
          })
        }
      },
      onError: (error) => {
        const message = mapAcceptInviteError(error)

        // Handle redirect for specific error cases
        if (message === 'You are already a member of this workspace') {
          toast.error(message)
          navigate({ to: '/' })
          return
        }

        toast.error(message)
      },
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <Avatar className="h-20 w-20 ring-4 ring-subtle shadow-raised-200">
            <AvatarImage src={workspaceLogoUrl || undefined} />
            <AvatarFallback className="text-24">
              {workspaceName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-24">Join {workspaceName}</CardTitle>
        <CardDescription className="text-16 pt-2">
          {inviterName} has invited you to join their workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-13 text-secondary pb-4">
          You are joining as <b>{user?.email}</b>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <Button
          onClick={handleJoin}
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Join Workspace
        </Button>
      </CardFooter>
    </Card>
  )
}
