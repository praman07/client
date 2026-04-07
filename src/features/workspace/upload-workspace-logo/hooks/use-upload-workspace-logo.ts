import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { validateLogo } from '../lib/validate-logo'
import { REQUEST_WORKSPACE_LOGO_UPLOAD_MUTATION, UPDATE_WORKSPACE_MUTATION, workspaceKeys } from '@/entities/workspace'
import { updateWorkspace } from '@/entities/workspace/model/slice'
import { selectCurrentWorkspace } from '@/entities/workspace/model/selectors'
import { GqlClient } from '@/shared/api'
import { useAppDispatch, useAppSelector, useAuth  } from '@/shared/hooks'
import { uploadToS3 } from '@/shared/lib/s3'

export function useUploadWorkspaceLogo(workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  return async function uploadLogo(file: File, onProgress?: (percent: number) => void) {
    // Step 0: Preflight validation
    const validationError = validateLogo(file)
    if (validationError) {
      const message =
        validationError.kind === 'SIZE_EXCEEDED'
          ? 'Logo size exceeds 2MB limit'
          : `File type ${validationError.mimeType} is not allowed`
      toast.error(message)
      throw new Error(message)
    }

    try {
      const token = await getToken()
      const client = GqlClient(token)

      // Step 1: Request presigned URL
      const requestResult = await client.request(REQUEST_WORKSPACE_LOGO_UPLOAD_MUTATION, {
        workspaceId,
        mimeType: file.type,
        sizeBytes: file.size,
      })

      const { presignedUrl, logoUrl } = requestResult.requestWorkspaceLogoUpload

      // Step 2: Upload to S3
      await uploadToS3(presignedUrl, file, onProgress || (() => {}))

      // Step 3: Persist logoUrl on the workspace record
      await client.request(UPDATE_WORKSPACE_MUTATION, {
        workspaceId,
        input: { logoUrl },
      })

      // Step 4: Optimistic Redux update — immediately reflect new logo in all
      // components reading from Redux (sidebar, nav, workspace card, etc.)
      // without waiting for the async refetch cycle to complete.
      if (currentWorkspace) {
        dispatch(updateWorkspace({ ...currentWorkspace, logoUrl }))
      }

      // Step 5: Invalidate query cache so next mount gets fresh data
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.myWorkspaces(),
      })

      toast.success('Logo updated successfully')
      return logoUrl
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload logo')
      throw err
    }
  }
}
