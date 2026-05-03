import type { GetWorkspaceInvitesQuery } from '@/gql/graphql'

export type WorkspaceInvite =
  GetWorkspaceInvitesQuery['workspaceInvites'][number]
