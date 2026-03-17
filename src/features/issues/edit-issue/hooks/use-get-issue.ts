/**
 * Fetches full issue detail for the edit modal.
 * Only fires when an issueId is provided (modal is open).
 * Uses ISSUE_DETAIL_FIELDS which includes descriptionS3Key.
 *
 * Server resolver: getIssue
 * @layer Features
 */
import { useQuery } from '@tanstack/react-query'
import { GET_ISSUE } from '../api/fragments'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys } from '@/entities/issue'

export function useGetIssue(issueId: string | null) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: issueKeys.detail(issueId ?? ''),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_ISSUE, { issueId: issueId! })
    },
    enabled: !!issueId,
    staleTime: 30_000,
     
    select: (data) => data.getIssue as any,
  })
}
