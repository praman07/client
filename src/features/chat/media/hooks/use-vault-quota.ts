/**
 * useVaultQuota — React Query hook for project storage quota.
 *
 * Returns available bytes (projectLimit - used - reserved) for the
 * quota-aware upload validator. Falls back to Infinity when loading
 * so that the upload UI is never blocked by a slow quota fetch.
 *
 * Refresh strategy:
 *   - staleTime: 60 seconds (server recommends polling every 60s)
 *   - After every upload/delete: call invalidateVaultQuota(queryClient, projectId)
 *     to force a fresh fetch immediately.
 *
 * @layer Features → chat/media/hooks
 */

import { useQuery } from '@tanstack/react-query'
import type { useQueryClient } from '@tanstack/react-query';
import { GqlClient } from '@/shared/api/graphql-client'
import { GET_VAULT_USAGE } from '@/shared/api/vault/vault-usage'
import { useAuth } from '@/shared/hooks'

// ── Query key factory ─────────────────────────────────────────────────────────

export const vaultQuotaKeys = {
  all: ['vault', 'quota'] as const,
  project: (projectId: string) => ['vault', 'quota', projectId] as const,
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface VaultQuota {
  /** Bytes available for upload (limit − used − reserved). */
  availableBytes: number
  /** Human-readable % used (0–100). */
  percentUsed: number
  /** Is the project quota critically low (<5% remaining)? */
  isNearLimit: boolean
  /** Is the project quota completely full? */
  isFull: boolean
}

/**
 * Fetches storage quota for a project.
 *
 * @param projectId - The project to check quota for.
 * @returns VaultQuota with availableBytes, percentUsed, isNearLimit, isFull.
 *          While loading, availableBytes is Infinity (never blocks uploads).
 */
export function useVaultQuota(projectId: string): {
  quota: VaultQuota
  isLoading: boolean
} {
  const { getToken } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: vaultQuotaKeys.project(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      // NOTE: Response fields are BigInt serialized as strings by GraphQL.
      // We parse them to number here — safe up to 9 PB which exceeds any plan limit.
      const result = await GqlClient(token).request(GET_VAULT_USAGE, { projectId })
      return result.getVaultUsage
    },
    staleTime: 60 * 1000,       // 60 seconds
    gcTime: 5 * 60 * 1000,      // 5 minutes
    enabled: !!projectId,
    retry: 2,
  })

  if (!data) {
    return {
      quota: {
        availableBytes: Infinity,  // never block uploads while loading
        percentUsed: 0,
        isNearLimit: false,
        isFull: false,
      },
      isLoading,
    }
  }

  // Parse BigInt-as-string fields from GQL response
  const used = Number(data.projectUsedBytes)
  const reserved = Number(data.projectReservedBytes)
  const limit = Number(data.projectLimitBytes)
  const available = Math.max(0, limit - used - reserved)
  const percentUsed = limit > 0 ? Math.round(((used + reserved) / limit) * 100) : 0

  return {
    quota: {
      availableBytes: available,
      percentUsed,
      isNearLimit: percentUsed >= 90,
      isFull: available <= 0,
    },
    isLoading,
  }
}

// ── Invalidation helper ───────────────────────────────────────────────────────

/**
 * Call after a successful upload or deletion to immediately refresh quota.
 * Pass the queryClient instance from useQueryClient().
 */
export function invalidateVaultQuota(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
) {
  queryClient.invalidateQueries({ queryKey: vaultQuotaKeys.project(projectId) })
}
