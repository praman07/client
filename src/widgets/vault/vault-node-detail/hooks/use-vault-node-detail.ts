import { useState } from 'react'
import type { VaultNodeType } from '@/gql/graphql'
import { useVaultNode } from '@/features/vault/fetch-node'
import { useVaultDownloadUrl } from '@/features/vault/fetch-download-url'

/**
 * Combines useVaultNode + lazy useVaultDownloadUrl for the detail panel.
 *
 * Download URL is NOT fetched until the user clicks "Download" —
 * staleTime: 0 / gcTime: 0 ensures the presigned URL is never cached.
 *
 * @layer Widgets — vault-node-detail
 */
export function useVaultNodeDetail(id: string, type: VaultNodeType) {
  const [downloadEnabled, setDownloadEnabled] = useState(false)

  const nodeQuery = useVaultNode(id, type, !!id)

  const downloadQuery = useVaultDownloadUrl(id, downloadEnabled)

  function triggerDownload() {
    setDownloadEnabled(true)
  }

  // Auto-open the URL once it arrives
  if (downloadEnabled && downloadQuery.data) {
    const url = downloadQuery.data.url
    window.open(url, '_blank', 'noopener,noreferrer')
    setDownloadEnabled(false)
  }

  return {
    node: nodeQuery,
    download: downloadQuery,
    triggerDownload,
  }
}
