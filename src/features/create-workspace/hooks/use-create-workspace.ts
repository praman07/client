import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CREATE_WORKSPACE } from '../api'
import { REQUEST_WORKSPACE_LOGO_UPLOAD_MUTATION, UPDATE_WORKSPACE_MUTATION } from '@/entities/workspace'
import { workspaceKeys } from '@/entities/workspace/api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { uploadToS3 } from '@/shared/lib/s3'

interface CreateWorkspaceVariables {
  slug: string
  name: string
  logoFile?: File | null
}

export function useCreateWorkspace() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: CreateWorkspaceVariables) => {
      const token = await getToken()
      const client = GqlClient(token)

      const result = await client.request(CREATE_WORKSPACE, {
        slug: variables.slug,
        name: variables.name,
      })

      const workspace = result.createWorkspace

      if (variables.logoFile) {
        const file = variables.logoFile

        const requestResult = await client.request(REQUEST_WORKSPACE_LOGO_UPLOAD_MUTATION, {
          workspaceId: workspace.id,
          mimeType: file.type,
          sizeBytes: file.size,
        })

        const { presignedUrl, logoS3Key } = requestResult.requestWorkspaceLogoUpload

        await uploadToS3(presignedUrl, file, () => {})

        await client.request(UPDATE_WORKSPACE_MUTATION, {
          workspaceId: workspace.id,
          input: { logoS3Key },
        })
      }

      return workspace
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.myWorkspaces() })
    },
  })
}