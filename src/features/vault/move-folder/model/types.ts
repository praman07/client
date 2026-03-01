export interface MoveFolderVariables {
  folderId: string
  targetParentFolderId: string | null
  /** For cache invalidation only — not sent to server */
  projectId: string
  sourceParentFolderId: string | null
}
