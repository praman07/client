export interface CreateFolderVariables {
  projectId: string
  name: string
  /** null = create at root level */
  parentFolderId: string | null
}
