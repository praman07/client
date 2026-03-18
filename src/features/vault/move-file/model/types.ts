export interface MoveFileVariables {
  fileId: string
  targetFolderId: string | null
  /** For cache invalidation only — not sent to server */
  projectId: string
  sourceFolderId: string | null
}
