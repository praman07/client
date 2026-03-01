/**
 * Shared Vault type primitives.
 *
 * Used by both vault-folder and vault-file entities.
 * Lives in shared/ so neither entity has to import from the other
 * (FSD rule: entities cannot cross-import).
 *
 * @layer Shared
 */

export type VaultNodeType = 'FOLDER' | 'FILE'

export type VaultSortField = 'NAME' | 'CREATED_AT' | 'SIZE' | 'TYPE'

export type SortDirection = 'ASC' | 'DESC'

export interface VaultSortState {
  sortBy: VaultSortField
  sortDir: SortDirection
}

export const DEFAULT_VAULT_SORT: VaultSortState = {
  sortBy: 'NAME',
  sortDir: 'ASC',
}
