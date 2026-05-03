import { ErrorBoundary } from 'react-error-boundary'
import {
  useProjectOverview,
} from '@/entities/project'
import {
  ProjectOverviewHeader,
  RecentFiles,
  RecentIssues,
  RecentPages,
} from '@/widgets/project-overview'
import { PageSpinner, RouteError, WidgetError } from '@/shared/ui'

interface OverviewPageProps {
  projectId: string
  name: string
  projectKey: string
  description?: string | null
  isPrivate?: boolean | null
  isArchived?: boolean | null
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  projectId,
  name,
  projectKey,
  description,
  isPrivate,
  isArchived,
}) => {
  const { data: overviewData, isLoading, error } = useProjectOverview(projectId)

  if (isLoading) return <PageSpinner label="Loading project overview..." />
  if (error || !overviewData)
    return <RouteError error={error || new Error('Failed to load project')} />

  const o = overviewData.projectOverview

  // Slice to max 3 items per section
  const recentIssues = (o.recentIssues ?? []).slice(0, 3)
  const recentPages = (o.recentPages ?? []).slice(0, 3)
  const recentFiles = (o.recentVaultFiles ?? []).slice(0, 5)
  const recentWhiteboards = (o.recentWhiteboards ?? []).slice(0, 5)

  return (
    <div className="flex flex-col h-full pb-10 px-[var(--padding-page)]">
      {/* ── Header ────────────────────────────────────────────── */}
      <ErrorBoundary FallbackComponent={WidgetError}>
        <div className="pt-[var(--padding-page)]">
          <ProjectOverviewHeader
            name={name}
            projectKey={projectKey}
            description={description}
            isPrivate={isPrivate}
            isArchived={isArchived}
          />
        </div>
      </ErrorBoundary>

      {/* ── Content — centered, max-w-2xl ───────────────────── */}
      <div className="flex-1 flex items-start justify-center pt-10">
        <div className="max-w-2xl w-full flex flex-col gap-5">
          {recentIssues.length > 0 && (
            <ErrorBoundary FallbackComponent={WidgetError}>
              <RecentIssues issues={recentIssues} />
            </ErrorBoundary>
          )}

          {recentPages.length > 0 && (
            <ErrorBoundary FallbackComponent={WidgetError}>
              <RecentPages pages={recentPages} />
            </ErrorBoundary>
          )}

          {(recentFiles.length > 0 || recentWhiteboards.length > 0) && (
            <ErrorBoundary FallbackComponent={WidgetError}>
              <RecentFiles files={recentFiles} whiteboards={recentWhiteboards} />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  )
}