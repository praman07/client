export interface Board {
  id: string
  workspaceId: string
  projectId: string | null
  title: string
  description: string | null
  thumbnail: string | null
  elementCount: number
  fileSizeBytes: string
  isLocked: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type BoardStatus = 'active' | 'locked' | 'archived'
