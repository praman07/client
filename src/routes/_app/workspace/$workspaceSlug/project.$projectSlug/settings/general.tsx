import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace/model/selectors'
import { ProjectGeneralSettings } from '@/widgets/project-general-settings'
import { Skeleton } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/general',
)({
  component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
  const { workspaceSlug } = Route.useParams()
  const workspace = useAppSelector(selectCurrentWorkspace)

  if (!workspace) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <ProjectGeneralSettings
      workspaceId={workspace.id}
      workspaceSlug={workspaceSlug}
    />
  )
}
