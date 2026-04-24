import {
  OverviewHeader,
  RecentProjects,
} from '@/widgets/workspace-overview'

export function DashboardPage() {
  return (
    <div className="flex flex-col h-full pb-10 px-[var(--padding-page)]">
      {/* Header — left-aligned at top */}
      {/* <div className="pt-[var(--padding-page)]"> */}
        <OverviewHeader />
      {/* </div> */}

      {/* Recent projects — centered in remaining viewport space */}
      <div className="flex-1 flex items-start justify-center pt-40">
        <div className="max-w-2xl w-full">
          <RecentProjects />
        </div>
      </div>
    </div>
  )
}