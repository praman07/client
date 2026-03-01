export interface RenameFolderVariables {
  folderId: string
  name: string
  /** For cache invalidation */
  projectId: string
  parentFolderId: string | null
}
