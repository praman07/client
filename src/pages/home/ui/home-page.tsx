import { extractFirstName } from '../lib/utils'

import { HomeHeader } from './home-header'
import { RecentWorkspaces } from './recent-workspaces'
import { ActivityFeedStubs } from './activity-feed-stubs'
import { useMyWorkspaces } from '@/entities/workspace/hooks/use-my-workspaces'
import { useUser } from '@/entities/user'

export function HomePage() {
  const { user, isLoaded: isUserLoading } = useUser()
  const { data: workspacesData, isLoading: isWorkspacesLoading } = useMyWorkspaces()

  const firstName = extractFirstName(user?.fullName)
  const workspaces = (workspacesData?.myWorkspaces ?? []) as unknown as Array<any>

  return (
    <>
      <HomeHeader firstName={firstName} isLoading={!isUserLoading} />
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-6 md:py-8 space-y-8 md:space-y-10">
        <RecentWorkspaces workspaces={workspaces} isLoading={isWorkspacesLoading} />
        <ActivityFeedStubs />
      </div>
    </>
  )
}
