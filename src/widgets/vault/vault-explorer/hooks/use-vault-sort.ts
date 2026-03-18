import { useState } from 'react'
import type { VaultSortState } from '@/shared/lib/vault-types'
import { DEFAULT_VAULT_SORT } from '@/shared/lib/vault-types'

/**
 * Local sort state for vault-explorer. No URL persistence.
 * @layer Widgets — vault-explorer
 */
export function useVaultSort() {
  const [sort, setSort] = useState<VaultSortState>(DEFAULT_VAULT_SORT)
  return { sort, setSort }
}
