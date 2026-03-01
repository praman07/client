export interface RenameFileVariables {
  fileId: string
  name: string
  /** For cache invalidation */
  projectId: string
  folderId: string | null
}
