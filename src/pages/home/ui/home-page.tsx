import { extractFirstName } from '../lib/utils'

import { HomeHeader } from './home-header'
import { RecentWorkspaces } from './recent-workspaces'
import { PendingInvitesSection } from './pending-invites-section'
import type { WorkspaceFragmentFragment } from '@/gql/graphql'
import { useUserHome } from '@/entities/user/hooks/use-user-home'
import { useUser } from '@/entities/user'

export function HomePage() {
  const { user, isLoaded: isUserLoading } = useUser()
  const { data: userHomeData, isLoading: isUserHomeLoading } = useUserHome()

  const firstName = extractFirstName(user?.fullName)
  const workspaces = (userHomeData?.workspaces ?? []) as unknown as Array<WorkspaceFragmentFragment>
  const pendingInvites = userHomeData?.pendingInvites ?? []

  return (
    <div className="flex-1 min-h-0 space-y-6">
      <HomeHeader firstName={firstName} isLoading={!isUserLoading} />
      <PendingInvitesSection invites={pendingInvites} />
      <RecentWorkspaces workspaces={workspaces} isLoading={isUserHomeLoading} />
    </div>
  )
}