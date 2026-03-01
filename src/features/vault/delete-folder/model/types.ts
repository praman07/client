export interface DeleteFolderVariables {
  folderId: string
  /** true = cascade delete all contents; false = only delete if empty or move files first */
  cascade: boolean
  /** For cache invalidation */
  projectId: string
  parentFolderId: string | null
}
