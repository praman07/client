import type { GetWorkspaceMembersQuery } from '@/gql/graphql'

export type WorkspaceMember =
  GetWorkspaceMembersQuery['workspaceMembers'][number]
