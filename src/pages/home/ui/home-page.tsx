import { extractFirstName } from '../lib/utils'

import { HomeHeader } from './home-header'
import { RecentWorkspaces } from './recent-workspaces'
import { useUserHome } from '@/entities/user/hooks/use-user-home'
import { useUser } from '@/entities/user'
import { PendingInvitesSection } from './pending-invites-section'
import type { WorkspaceFragmentFragment } from '@/gql/graphql'

export function HomePage() {
  const { user, isLoaded: isUserLoading } = useUser()
  const { data: userHomeData, isLoading: isUserHomeLoading } = useUserHome()

  const firstName = extractFirstName(user?.fullName)
  const workspaces = (userHomeData?.workspaces ?? []) as unknown as WorkspaceFragmentFragment[]
  const pendingInvites = userHomeData?.pendingInvites ?? []

  return (
    <>
      <HomeHeader firstName={firstName} isLoading={!isUserLoading} />
      <div className="w-full max-w-screen-2xl mx-auto px-[var(--padding-page)] flex-1 py-6 md:py-8 space-y-8 md:space-y-10">
        <PendingInvitesSection invites={pendingInvites} />
        <RecentWorkspaces workspaces={workspaces} isLoading={isUserHomeLoading} />
      </div>
    </>
  )
}
