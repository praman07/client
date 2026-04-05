import { useCurrentWorkspace } from '@/entities/workspace/hooks'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { UPDATE_WORKSPACE_MUTATION, RENAME_WORKSPACE_SLUG_MUTATION } from '@/entities/workspace/api/fragments'
import { useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from '@/entities/workspace'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/shared/ui/primitives/separator'
import { WorkspaceGeneralForm } from './workspace-general-form'

export function WorkspaceGeneralSettingsPanel() {
  const currentWorkspace = useCurrentWorkspace()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleSaveName = async (name: string) => {
    const token = await getToken()
    const client = GqlClient(token)
    await client.request(UPDATE_WORKSPACE_MUTATION, {
      workspaceId: currentWorkspace.id,
      input: { name },
    })
    queryClient.invalidateQueries({ queryKey: workspaceKeys.myWorkspaces() })
  }

  const handleSaveSlug = async (newSlug: string) => {
    const token = await getToken()
    const client = GqlClient(token)
    await client.request(RENAME_WORKSPACE_SLUG_MUTATION, {
      workspaceId: currentWorkspace.id,
      slug: newSlug,
    })
    // Full page redirect — slug change invalidates all current route params
    window.location.href = `/workspace/${newSlug}/settings/general`
  }

  return (
    <div className="max-w-4xl">
      {/* Header — Save Changes button is inside the form, shown only when dirty */}
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight">General Settings</h2>
      </div>

      <Separator className="mb-8" />

      <WorkspaceGeneralForm
        workspaceId={currentWorkspace.id}
        initialName={currentWorkspace.name}
        initialSlug={currentWorkspace.slug}
        logoUrl={currentWorkspace.logoUrl}
        urlPrefix="collabify.app/"
        onSaveName={handleSaveName}
        onSaveSlug={handleSaveSlug}
      />
    </div>
  )
}
