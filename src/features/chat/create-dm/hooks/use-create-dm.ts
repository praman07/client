import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_DM_MUTATION } from '../api/fragments'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentWorkspaceId } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'
import { projectDmsKeys } from '@/features/chat/get-project-dms'
import { useCreateDmModal } from './use-create-dm-modal'
import { useNavigate, useParams } from '@tanstack/react-router'

/**
 * Mutation hook for creating a 1:1 DM conversation.
 *
 * On success:
 *  - Closes the dialog
 *  - Invalidates the project DMs query so the sidebar refreshes
 *  - Navigates to the new (or existing) DM conversation,
 *    preserving the current workspaceSlug and projectSlug route params
 */
export function useCreateDm() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const workspaceId = useAppSelector(selectCurrentWorkspaceId)
  const project = useAppSelector(selectCurrentProject)
  const { close } = useCreateDmModal()
  const navigate = useNavigate()

  // Read current route params to preserve workspaceSlug/projectSlug in navigation
  const currentParams = useParams({ strict: false }) as {
    workspaceSlug?: string
    projectSlug?: string
  }

  return useMutation({
    mutationFn: async (recipientUserId: string) => {
      if (!workspaceId || !project?.id) throw new Error('No workspace/project selected')
      const token = await getToken()
      return GqlClient(token).request(CREATE_DM_MUTATION, {
        input: {
          workspaceId,
          projectId: project.id,
          recipientUserId,
        },
      })
    },
    onSuccess: (data) => {
      const conversationId = data.createDm.id

      // Close dialog first
      close()

      // Invalidate DM list so sidebar refreshes
      if (project?.id) {
        queryClient.invalidateQueries({ queryKey: projectDmsKeys.list(project.id) })
      }

      // Navigate — spread current params to preserve workspaceSlug/projectSlug
      void navigate({
        to: '/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId',
        params: {
          workspaceSlug: currentParams.workspaceSlug ?? '',
          projectSlug: currentParams.projectSlug ?? '',
          conversationId,
        },
      })
    },
  })
}
