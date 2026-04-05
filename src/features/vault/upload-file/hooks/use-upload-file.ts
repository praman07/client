import { useQueryClient } from '@tanstack/react-query'
import { validateFile } from '../lib/validate-file'
import { uploadToS3 } from '@/shared/lib/s3'
import { CONFIRM_VAULT_UPLOAD, REQUEST_VAULT_UPLOAD } from '../api/fragments'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { vaultFileKeys, vaultNodeKeys } from '@/entities/vault-file'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('vault:upload')

export type UploadStatus =
  | 'queued'
  | 'uploading'
  | 'confirming'
  | 'done'
  | 'error'

export interface UploadSlot {
  /** Temp client-side ID — replaced by real fileId after requestVaultUpload */
  localId: string
  name: string
  sizeBytes: number
  progress: number
  status: UploadStatus
  error?: string
}

/**
 * 3-step vault upload orchestrator.
 *
 * Returns an imperative uploadFile() function (not useMutation) because:
 * - Multiple files are uploaded concurrently / queued
 * - Progress tracking needs XHR.upload.onprogress (not fetch)
 * - The 3 async steps must run in sequence per file
 *
 * Steps:
 *  0. Client-side preflight (size limit, MIME allowlist) — sync
 *  1. requestVaultUpload  → { fileId, presignedUrl }
 *  2. PUT file bytes to S3 via XHR with onprogress
 *  3. confirmVaultUpload  → marks file ACTIVE
 *
 * Cache invalidated on confirm: vaultNodeKeys.children, vaultFileKeys.usage
 *
 * @layer Features
 */
export function useUploadFile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return async function uploadFile(params: {
    file: File
    projectId: string
    workspaceId: string
    folderId: string | null
    onProgress: (percent: number) => void
    onStatusChange: (status: UploadStatus, error?: string) => void
  }): Promise<void> {
    const {
      file,
      projectId,
      workspaceId,
      folderId,
      onProgress,
      onStatusChange,
    } = params

    // Step 0: client-side preflight (sync — no network call)
    const validationError = validateFile(file)
    if (validationError) {
      const message =
        validationError.kind === 'SIZE_EXCEEDED'
          ? `File exceeds the 50 MB size limit`
          : `File type "${validationError.mimeType}" is not allowed`
      log.info('Step 0: preflight FAILED', {
        name: file.name,
        kind: validationError.kind,
      })
      onStatusChange('error', message)
      throw new Error(message)
    }
    log.info('Step 0: preflight passed', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      // Step 1: requestVaultUpload — reserve quota, get presigned URL
      log.info('Step 1: requestVaultUpload — requesting presigned URL')
      onStatusChange('uploading')
      const requestResult = await GqlClient(token).request(
        REQUEST_VAULT_UPLOAD,
        {
          input: {
            projectId,
            workspaceId,
            folderId,
            name: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
          },
        },
      )

      const { fileId, presignedUrl } = requestResult.requestVaultUpload
      log.info('Step 1: done', {
        fileId,
        presignedUrlHost: presignedUrl.split('?')[0],
      })

      // Step 2: PUT bytes directly to S3 (bypasses our server)
      log.info('Step 2: uploadToS3 — XHR PUT starting')
      await uploadToS3(presignedUrl, file, onProgress)
      log.info('Step 2: uploadToS3 — done')

      // Step 3: confirmVaultUpload — verify upload, mark ACTIVE
      log.info('Step 3: confirmVaultUpload — activating file', { fileId })
      onStatusChange('confirming')
      await GqlClient(token).request(CONFIRM_VAULT_UPLOAD, {
        input: { fileId },
      })
      log.info('Step 3: done — file ACTIVE', { fileId })

      onStatusChange('done')

      // Invalidate so the file appears in the listing and usage bar updates
      queryClient.invalidateQueries({
        queryKey: vaultNodeKeys.children(projectId, folderId),
      })
      queryClient.invalidateQueries({
        queryKey: vaultFileKeys.usage(projectId),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      onStatusChange('error', message)
      throw err
    }
  }
}
  