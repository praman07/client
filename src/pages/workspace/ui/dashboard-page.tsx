import { ComingSoonWrapper } from '@/shared/ui/primitives/coming-soon-wrapper'
import {
  OverviewHeader,
  WorkspaceSummary,
  RecentProjects,
  ActivityFeed,
  QuickActions,
  WorkspaceMembersWidget,
  // StorageUsage,
  // OnboardingPromo,
} from '@/widgets/workspace-overview'

export function DashboardPage() {
  return (
    <div className="flex flex-col min-h-full w-full pb-10">
      <OverviewHeader />
      
      {/* 3-Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left MAIN Column (Spans 2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <WorkspaceSummary />
          <RecentProjects />
          <ComingSoonWrapper label="Activity Feed">
            <ActivityFeed />
          </ComingSoonWrapper>
        </div>

        {/* Right SIDEBAR Column (Spans 1/3) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <QuickActions />
          <WorkspaceMembersWidget />
          {/* These sections are commented out by developer for future use */}
          {/* <StorageUsage /> */}
          {/* <OnboardingPromo /> */}
        </div>
        
      </div>
    </div>
  )
}
