/**
 * Three-step S3 description upload orchestrator:
 *
 *   Step 1: requestIssueDescriptionUpload(issueId, sizeBytes)
 *           → server returns { presignedUrl, descriptionFileId }
 *   Step 2: PUT the JSON blob directly to S3 presignedUrl (raw fetch)
 *   Step 3: confirmIssueDescriptionUpload(descriptionFileId)
 *           → server marks file as ACTIVE, returns updated issue
 *
 * Skips the entire flow if hasDescriptionChanged returns false.
 *
 * Returns:
 *   upload(issueId, blocks, originalBlocks) → async function
 *   state → 'idle' | 'requesting' | 'uploading' | 'confirming' | 'done' | 'error'
 *
 * Server resolvers:
 *   requestIssueDescriptionUpload, confirmIssueDescriptionUpload
 *
 * @layer Features
 */
import { useCallback, useState } from 'react'
import {
  CONFIRM_ISSUE_DESCRIPTION_UPLOAD,
  REQUEST_ISSUE_DESCRIPTION_UPLOAD,
} from '../api/fragments'
import { hasDescriptionChanged } from '../lib/description-change-detector'
import { mapDescriptionUploadError } from '../lib/error-mapping'
import type { DescriptionUploadStatus } from '../model/types'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'

export function useDescriptionUpload() {
  const { getToken } = useAuth()
  const [status, setStatus] = useState<DescriptionUploadStatus>('idle')
  const [error, setError] = useState<string | undefined>()

  const upload = useCallback(
    async (
      issueId: string,
      currentBlocks: Array<unknown>,
      originalBlocks: Array<unknown>,
    ): Promise<boolean> => {
      // Skip upload if content hasn't changed
      if (!hasDescriptionChanged(currentBlocks, originalBlocks)) {
        return false
      }

      try {
        const token = await getToken()
        if (!token) throw new Error('Not authenticated')

        const client = GqlClient(token)
        const blob = new Blob([JSON.stringify(currentBlocks)], {
          type: 'application/json',
        })

        // ── Step 1: Request presigned URL ─────────────────────────────────
        setStatus('requesting')
        const { requestIssueDescriptionUpload: req } = await client.request(
          REQUEST_ISSUE_DESCRIPTION_UPLOAD,
          { input: { issueId, sizeBytes: blob.size } },
        )

        // ── Step 2: PUT to S3 ─────────────────────────────────────────────
        setStatus('uploading')
        const uploadRes = await fetch(req.presignedUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': 'application/json' },
        })
        if (!uploadRes.ok) {
          throw new Error(`S3 upload failed: ${uploadRes.status}`)
        }

        // ── Step 3: Confirm ───────────────────────────────────────────────
        setStatus('confirming')
        await client.request(CONFIRM_ISSUE_DESCRIPTION_UPLOAD, {
          input: { descriptionFileId: req.descriptionFileId },
        })

        setStatus('done')
        return true
      } catch (err) {
        const message = mapDescriptionUploadError(err)
        setError(message)
        setStatus('error')
        throw err
      }
    },
    [getToken],
  )

  return { upload, state: { status, error } }
}
