/**
 * VaultFolder entity types.
 *
 * Derived from the VaultFolder GraphQL type (vault schema.graphql).
 * No Zustand slice — folder data is TanStack Query server state only.
 *
 * @layer Entity
 */

/**
 * A folder in the Vault.
 * parentFolderId = null → folder lives at root (Home level).
 * isSystem = true → locked: cannot be renamed, moved, or deleted by users.
 */
export interface VaultFolder {
  id: string
  projectId: string
  /** null = root-level — no parent folder */
  parentFolderId: string | null
  name: string
  /** System folders (From Chat, From Pages, From Whiteboard, From Tasks) are locked */
  isSystem: boolean
  /** true if the current user has pinned this folder to their sidebar */
  isPinned: boolean
  /** Count of immediate child folders (not recursive) */
  childFolderCount: number
  /** Count of ACTIVE files directly inside this folder */
  fileCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Shape returned by getVaultSidebar.
 * Fetched once on Vault mount with staleTime: Infinity.
 * Never re-fetched during folder navigation.
 */
export interface VaultSidebar {
  pinnedFolders: VaultFolder[]
  systemFolders: VaultFolder[]
}
