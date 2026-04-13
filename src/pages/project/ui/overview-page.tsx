import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  useProjectOverview,
} from '@/entities/project'
import {
  ActiveMembers,
  IssueStatusBreakdown,
  PriorityDistribution,
  ProjectChannels,
  ProjectHealth,
  ProjectOverviewHeader,
  RecentIssues,
  RecentPages,
  UpcomingDeadlines,
  VaultActivity,
} from '@/widgets/project-overview'
import { PageSpinner, RouteError, WidgetError } from '@/shared/ui'

interface OverviewPageProps {
  projectId: string
  projectSlug: string
  workspaceId: string
  name: string
  projectKey: string
  description?: string | null
  isPrivate?: boolean | null
  isArchived?: boolean | null
  activePlugins: Array<string>
  workspaceSlug: string
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  projectId,
  projectSlug,
  name,
  projectKey,
  description,
  isPrivate,
  isArchived,
  activePlugins,
  workspaceSlug,
}) => {
  const { data: overviewData, isLoading, error } = useProjectOverview(projectId)
  // This Contributors will be used later for now keep it as commneted
  // const { data: contributorData, isLoading: isContributorLoading } =
    // useProjectContributorStats(projectId)

  if (isLoading) return <PageSpinner label="Loading project overview..." />
  if (error || !overviewData)
    return <RouteError error={error || new Error('Failed to load project')} />

  const o = overviewData.projectOverview
  const projectBasePath = `/workspace/${workspaceSlug}/project/${projectSlug}`

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-5 p-4 md:p-6 lg:p-8">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <ErrorBoundary FallbackComponent={WidgetError}>
          <ProjectOverviewHeader
            name={name}
            projectKey={projectKey}
            description={description}
            isPrivate={isPrivate}
            isArchived={isArchived}
            activePlugins={activePlugins}
            projectBasePath={projectBasePath}
          />
        </ErrorBoundary>

        {/* ── Row A: Stat chips (full-width flex row) ───────────────────── */}
        <ErrorBoundary FallbackComponent={WidgetError}>
          <ProjectHealth
            openIssues={o.openIssues}
            completedIssues={o.completedIssues}
            overdueIssues={o.overdueIssues}
            pageCount={o.pageCount}
            memberCount={o.memberCount}
          />
        </ErrorBoundary>

        {/* ── Row B: Status Breakdown (2/3) + Upcoming Deadlines (1/3) ──── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Status Breakdown — wider, grows to fill */}
          <ErrorBoundary FallbackComponent={WidgetError}>
            <div className="lg:col-span-2 min-h-[280px]">
              <IssueStatusBreakdown
                statuses={o.issuesByStatus}
                totalIssues={o.totalIssues}
              />
            </div>
          </ErrorBoundary>

          {/* Upcoming Deadlines — narrower column */}
          <ErrorBoundary FallbackComponent={WidgetError}>
            <div className="min-h-[280px]">
              <UpcomingDeadlines issues={o.upcomingIssues} />
            </div>
          </ErrorBoundary>
        </div>

        {/* ── Row C: Priority (1/3) + Active Members (1/3) + Recent Pages (1/3) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ErrorBoundary FallbackComponent={WidgetError}>
            <div className="min-h-[260px]">
              <PriorityDistribution distribution={o.issuesByPriority} />
            </div>
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={WidgetError}>
            <div className="min-h-[260px]">
              <ActiveMembers
                members={o.members}
                totalCount={o.memberCount}
                channels={o.projectChannels}
              />
            </div>
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={WidgetError}>
            <div className="min-h-[260px] md:col-span-2 lg:col-span-1">
              <RecentPages pages={o.recentPages} />
            </div>
          </ErrorBoundary>
        </div>

        {/* ── Row D: Recent Issues (full width) ────────────────────────── */}
        <ErrorBoundary FallbackComponent={WidgetError}>
          <RecentIssues issues={o.recentIssues} />
        </ErrorBoundary>

        {/* ── Row E: Contributor Cards (full-width flex row) ─────────────── */}
        {/* <ErrorBoundary FallbackComponent={WidgetError}>
          <ContributorActivity
            stats={contributorData?.projectContributorStats ?? []}
            loading={isContributorLoading}
          />
        </ErrorBoundary> */}

        {/* ── Row F: Vault (2/3) + Channels (1/3) — adaptive ──────────── */}
        {o.recentVaultFiles.length > 0 && o.projectChannels.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <ErrorBoundary FallbackComponent={WidgetError}>
              <div className="lg:col-span-2">
                <VaultActivity
                  files={o.recentVaultFiles}
                  usage={o.vaultUsage}
                />
              </div>
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={WidgetError}>
              <div className="min-h-[160px]">
                <ProjectChannels
                  channels={o.projectChannels}
                />
              </div>
            </ErrorBoundary>
          </div>
        ) : o.recentVaultFiles.length > 0 ? (
          <ErrorBoundary FallbackComponent={WidgetError}>
            <VaultActivity
              files={o.recentVaultFiles}
              usage={o.vaultUsage}
            />
          </ErrorBoundary>
        ) : o.projectChannels.length > 0 ? (
          <ErrorBoundary FallbackComponent={WidgetError}>
            <ProjectChannels
              channels={o.projectChannels}
            />
          </ErrorBoundary>
        ) : null}

      </div>
    </div>
  )
}
