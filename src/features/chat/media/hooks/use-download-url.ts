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
 *     network call for freshly delivered messages. Proxy URLs are excluded
 *     (see isPresignedUrl below) because they require auth headers and cannot
 *     be loaded by a plain <img> tag cross-subdomain.
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
 * Returns true only for real presigned S3 URLs (amazonaws.com).
 *
 * Vault proxy URLs (`/vault/file/:id`) require an Authorization header and
 * cannot be used as <img> src cross-subdomain — the browser sends them as
 * no-cors image requests without the Clerk __session cookie, resulting in 401.
 * When a proxy URL is supplied as initialUrl, we discard it so the hook always
 * fetches a fresh presigned URL via GraphQL.
 */
function isPresignedUrl(url: string): boolean {
  return url.includes('amazonaws.com') || url.includes('X-Amz-Signature')
}

/**
 * Returns a fresh presigned GET URL for a Vault file.
 *
 * @param fileId     - The Vault file ID to fetch a URL for.
 * @param initialUrl - The URL from the original WS event/ACK (may be expired
 *                     or a proxy URL). Used as initialData only when it is a
 *                     real presigned S3 URL — avoids a network call for freshly
 *                     delivered messages. Pass undefined if no URL is available.
 */
export function useDownloadUrl(
  fileId: string,
  initialUrl?: string,
): UseDownloadUrlResult {
  const { getToken } = useAuth()

  // Only treat the incoming URL as valid initialData if it is a real presigned
  // S3 URL. Proxy URLs (/vault/file/:id) silently fail when used as <img> src
  // because the browser sends them without the Clerk __session cookie.
  const validInitialUrl = initialUrl && isPresignedUrl(initialUrl) ? initialUrl : undefined

  const { data, isLoading, isError } = useQuery({
    queryKey: downloadUrlKeys.file(fileId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getDownloadUrl(fileId, token)
    },
    initialData: validInitialUrl,
    // Use performance.timeOrigin as a stable "now" timestamp that is set once
    // at page load. This tells React Query the initialData is FRESH (not stale
    // from epoch=0), preventing an immediate background refetch on mount.
    // performance.timeOrigin is read-only module-level — not a per-render call.
    initialDataUpdatedAt: validInitialUrl ? performance.timeOrigin : undefined,
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
