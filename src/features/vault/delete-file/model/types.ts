export interface DeleteFileVariables {
  fileId: string
  /** For cache invalidation */
  projectId: string
  folderId: string | null
}
