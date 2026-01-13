import { Loader2 } from 'lucide-react'

import { useAcceptWorkspaceInviteMutation } from '../api/mutations'
import { Button } from '@/shared/ui/primitives/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/primitives/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { useUser } from '@/shared/auth'

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
  const { user } = useUser()
  const { mutate, isPending } = useAcceptWorkspaceInviteMutation()

  const handleJoin = () => {
    mutate(token)
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-xl">
            <AvatarImage src={workspaceLogoUrl || undefined} />
            <AvatarFallback className="text-2xl">
              {workspaceName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl">Join {workspaceName}</CardTitle>
        <CardDescription className="text-lg pt-2">
          {inviterName} has invited you to join their workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground pb-4">
          You are joining as <b>{user?.primaryEmailAddress?.emailAddress}</b>
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
