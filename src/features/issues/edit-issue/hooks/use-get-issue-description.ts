/**
 * Fetches the description content for an issue from S3.
 *
 * Flow:
 *   1. Call getIssueDescriptionUrl(issueId) → signed S3 GET URL (5 min TTL)
 *   2. fetch(url) → JSON text
 *   3. JSON.parse → BlockNote Block[]
 *
 * Only fires when issueId is set AND descriptionS3Key is non-null.
 * Always stale (staleTime: 0) because the signed URL expires in 5 min.
 *
 * @layer Features
 */
import { useQuery } from '@tanstack/react-query'
import { GET_ISSUE_DESCRIPTION_URL } from '../api/fragments'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys } from '@/entities/issue'

export function useGetIssueDescription(
  issueId: string | null,
  descriptionS3Key: string | null,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: [...issueKeys.detail(issueId ?? ''), 'description'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      // Step 1: Get signed S3 GET URL
      const { getIssueDescriptionUrl } = await GqlClient(token).request(
        GET_ISSUE_DESCRIPTION_URL,
        { issueId: issueId! },
      )

      if (!getIssueDescriptionUrl.url) return []

      // Step 2+3: Fetch and parse BlockNote JSON from S3
      const res = await fetch(getIssueDescriptionUrl.url)
      if (!res.ok) throw new Error(`S3 fetch failed: ${res.status}`)

      const text = await res.text()
       
      return JSON.parse(text) as Array<any>
    },
    enabled: !!issueId && !!descriptionS3Key,
    staleTime: 0, // signed URL TTL = 5 min — always re-fetch on open
    gcTime: 0, // don't cache after modal closes
    retry: false,
  })
}
