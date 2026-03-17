/**
 * Page entity types
 *
 * Derived from the `Page` GraphQL type (schema.graphql lines 299-331).
 * No Redux slice — page metadata is React Query server state.
 *
 * @layer Entity
 */

export type PageRole = 'EDITOR' | 'VIEWER' | 'COMMENTER'

export interface PageCollaborator {
  userId: string
  role: PageRole
  joinedAt: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

export interface Page {
  id: string
  title: string
  workspaceId: string
  projectId: string
  /** null = root-level page (no parent) */
  parentId: string | null
  /** emoji or absolute URL for the page icon */
  icon: string | null
  coverUrl: string | null
  /**
   * Fractional index position for ordering within parent.
   * e.g. 1.5 = sits between siblings at 1.0 and 2.0.
   * Managed by Postgres only — NOT a CRDT / Y.Array.
   */
  position: number
  isArchived: boolean
  isLocked: boolean
  /** S3 key for the latest compiled Y.Doc snapshot (disaster recovery) */
  s3Key: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
  collaborators: Array<PageCollaborator>
  /**
   * Populated only by getProjectPages — empty [] in all other contexts.
   * The page-list widget builds the display tree client-side from this flat+nested structure.
   */
  children: Array<Page>
}

/**
 * Lightweight page type for list/tree nodes where collaborators aren't needed.
 * Use this in page-list, DnD reorder, breadcrumbs etc.
 */
export type PageSummary = Omit<Page, 'collaborators'>

export type PageStatus = 'active' | 'locked' | 'archived'
