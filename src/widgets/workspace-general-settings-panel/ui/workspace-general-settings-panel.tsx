import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { WorkspaceGeneralForm } from './workspace-general-form'
import { useCurrentWorkspace, useWorkspaceDetails } from '@/entities/workspace/hooks'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { RENAME_WORKSPACE_SLUG_MUTATION, UPDATE_WORKSPACE_MUTATION, workspaceKeys } from '@/entities/workspace'
import { Separator } from '@/shared/ui/primitives/separator'

export function WorkspaceGeneralSettingsPanel() {
  const currentWorkspace = useCurrentWorkspace()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const workspaceId = currentWorkspace?.id

  const { data: workspaceData, isLoading } = useWorkspaceDetails(workspaceId ?? '')

  const logoUrl = workspaceData?.logoUrl ?? currentWorkspace?.logoUrl

  const handleSaveName = async (name: string) => {
    if (!workspaceId) return
    const token = await getToken()
    const client = GqlClient(token)
    await client.request(UPDATE_WORKSPACE_MUTATION, {
      workspaceId,
      input: { name },
    })
    await queryClient.invalidateQueries({ queryKey: workspaceKeys.settings(workspaceId) })
  }

  const handleSaveSlug = async (newSlug: string) => {
    if (!workspaceId) return
    const token = await getToken()
    const client = GqlClient(token)
    await client.request(RENAME_WORKSPACE_SLUG_MUTATION, {
      workspaceId,
      slug: newSlug,
    })
    window.location.href = `/workspace/${newSlug}/settings/general`
  }

  if (isLoading || !currentWorkspace || !workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <h2 className="text-20 font-semibold tracking-tight">General Settings</h2>
      </div>

      <Separator className="mb-8" />

      <WorkspaceGeneralForm
        workspaceId={workspaceId}
        initialName={workspaceData?.name ?? currentWorkspace.name}
        initialSlug={workspaceData?.slug ?? currentWorkspace.slug}
        logoUrl={logoUrl}
        urlPrefix="collabify.app/"
        onSaveName={handleSaveName}
        onSaveSlug={handleSaveSlug}
      />
    </div>
  )
}