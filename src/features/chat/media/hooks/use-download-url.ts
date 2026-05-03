/**
 * useDownloadUrl — React Query hook for refreshing expired presigned GET URLs.
 *
 * Vault presigned GET URLs have a 5-minute TTL (GET) and 1-hour TTL (batch).
 * For chat messages delivered more than ~4 minutes ago, the URL in
 * message.metadata.attachments.url will have expired. This hook refreshes it.
 *
 * Caching strategy:
 *   - staleTime: 4 min — matches ~5-min URL TTL with a 1-min safety buffer
 *   - gcTime: 10 min — release memory after session-level usage
 *   - initialData: the url from the WS event/ACK (if present) — avoids a
 *     network call for freshly delivered messages
 *   - initialDataUpdatedAt: a stable epoch timestamp captured at module load
 *     via performance.timeOrigin (impurity-free) — tells React Query the
 *     initialData is FRESH, preventing an immediate background refetch that
 *     causes intermittent rendering failures when two same-named files are
 *     uploaded simultaneously.
 *
 * @layer Features → chat/media/hooks
 */

import { useQuery } from '@tanstack/react-query'
import { getDownloadUrl } from '@/shared/api/vault'
import { useAuth } from '@/shared/hooks'

export const downloadUrlKeys = {
  file: (fileId: string) => ['vault', 'download-url', fileId] as const,
}

export type DownloadUrlStatus = 'loading' | 'ready' | 'deleted' | 'forbidden' | 'error'

export interface UseDownloadUrlResult {
  url: string | null
  status: DownloadUrlStatus
}

/**
 * Returns a fresh presigned GET URL for a Vault file.
 *
 * @param fileId     - The Vault file ID to fetch a URL for.
 * @param initialUrl - The URL from the original WS event/ACK (may be expired).
 *                     Used as initialData — avoids a network call if still valid.
 *                     Pass undefined if no URL is available yet.
 */
export function useDownloadUrl(
  fileId: string,
  initialUrl?: string,
): UseDownloadUrlResult {
  const { getToken } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: downloadUrlKeys.file(fileId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getDownloadUrl(fileId, token)
    },
    initialData: initialUrl || undefined,
    // Use performance.timeOrigin as a stable "now" timestamp that is set once
    // at page load. This tells React Query the initialData is FRESH (not stale
    // from epoch=0), preventing an immediate background refetch on mount.
    // performance.timeOrigin is read-only module-level — not a per-render call.
    initialDataUpdatedAt: initialUrl ? performance.timeOrigin : undefined,
    staleTime: 4 * 60 * 1000,   // 4 minutes — matches 5-min presigned URL TTL
    gcTime: 10 * 60 * 1000,     // 10 minutes — enough for normal chat session
    enabled: !!fileId,
    retry: 2,                    // retry twice before showing error tombstone
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  })

  // Still fetching, no data yet
  if (isLoading) return { url: null, status: 'loading' }
  // Network/server error after all retries
  if (isError) return { url: null, status: 'error' }

  return { url: data ?? null, status: 'ready' }
}
