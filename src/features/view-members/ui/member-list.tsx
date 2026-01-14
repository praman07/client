import { useWorkspaceMembers } from '../hooks'
import { mapMembersError } from '../lib'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Skeleton,
  Table, TableBody, TableCell, TableHead , TableHeader , TableRow 
} from '@/shared/ui'

interface MemberListProps {
  workspaceId: string
}

export function MemberList({ workspaceId }: MemberListProps) {
  const { data, isLoading, error } = useWorkspaceMembers(workspaceId)

  if (isLoading) {
    return <MemberListSkeleton />
  }

  if (error) {
    const userMessage = mapMembersError(error)
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
