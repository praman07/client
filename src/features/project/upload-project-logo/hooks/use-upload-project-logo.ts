import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { validateLogo } from '../lib/validate-logo'
import {
  REQUEST_PROJECT_LOGO_UPLOAD_MUTATION,
  UPDATE_PROJECT,
  projectKeys,
} from '@/entities/project'
import { setCurrentProject } from '@/entities/project/model/slice'
import { selectCurrentProject } from '@/entities/project/model/selectors'
import { GqlClient } from '@/shared/api'
import { useAppDispatch, useAppSelector, useAuth  } from '@/shared/hooks'
import { uploadToS3 } from '@/shared/lib/s3'

export function useUploadProjectLogo(projectId: string, workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const currentProject = useAppSelector(selectCurrentProject)

  return async function uploadLogo(file: File, onProgress?: (percent: number) => void) {
    // Step 0: Preflight validation
    const validationError = validateLogo(file)
    if (validationError) {
      const message =
        validationError.kind === 'SIZE_EXCEEDED'
          ? 'Logo size exceeds 2 MB limit'
          : `File type ${validationError.mimeType} is not allowed`
      toast.error(message)
      throw new Error(message)
    }

    try {
      const token = await getToken()
      const client = GqlClient(token)

      // Step 1: Request presigned URL
      const requestResult = await client.request(REQUEST_PROJECT_LOGO_UPLOAD_MUTATION, {
        projectId,
        mimeType: file.type,
        sizeBytes: file.size,
      })

      const { presignedUrl, logoUrl } = requestResult.requestProjectLogoUpload

      // Step 2: Upload to S3
      await uploadToS3(presignedUrl, file, onProgress || (() => {}))

      // Step 3: Persist logoUrl on the project record
      await client.request(UPDATE_PROJECT, {
        projectId,
        input: { logoUrl },
      })

      // Step 4: Optimistic Redux update — immediately reflect the new logo
      if (currentProject) {
        dispatch(setCurrentProject({ ...currentProject, logoUrl }))
      }

      // Step 5: Invalidate TanStack Query cache for list + detail
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
      if (currentProject) {
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(workspaceId, currentProject.id),
        })
        queryClient.invalidateQueries({
          queryKey: projectKeys.bySlug(workspaceId, currentProject.key),
        })
      }

      toast.success('Logo updated successfully')
      return logoUrl
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload logo')
      throw err
    }
  }
}
