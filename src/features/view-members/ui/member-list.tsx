import { useQuery } from '@tanstack/react-query'
import { ClientError } from 'graphql-request'
import { GET_WORKSPACE_MEMBERS } from '../api/queries'
import { workspaceMemberKeys } from '../api/query-keys'
import { useAuth } from '@/shared/auth'
import { createGqlClient } from '@/shared/api/graphql-client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/primitives/table'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { Badge } from '@/shared/ui/primitives/badge'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

interface MemberListProps {
  workspaceId: string
}

export function MemberList({ workspaceId }: MemberListProps) {
  const { getToken } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: workspaceMemberKeys.list(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = createGqlClient(token)
      return client.request(GET_WORKSPACE_MEMBERS, { workspaceId })
    },
  })

  if (isLoading) {
    return <MemberListSkeleton />
  }

  if (error) {
    // FE-ERR-01: Branch on code, not message (simplified here as generic fallback for now)
    const isClientError = error instanceof ClientError
    const errorCode = isClientError
      ? error.response.errors?.[0]?.extensions?.code
      : 'UNKNOWN'

    let userMessage = 'Failed to load members.'
    if (errorCode === 'FORBIDDEN') {
      userMessage = 'You do not have permission to view members.'
    }

    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{userMessage}</p>
      </div>
    )
  }

  const members = data?.workspaceMembers || []

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.user.avatarUrl || undefined} />
                    <AvatarFallback>
                      {member.user.fullName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.user.fullName || 'Unknown User'}</span>
                </div>
              </TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{member.role}</Badge>
              </TableCell>
              <TableCell>
                {/* Safe date parsing assuming timestamp string */}
                {new Date(Number(member.joinedAt)).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MemberListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}
