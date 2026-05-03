/**
 * GetPagesHome query document.
 *
 * Fields are inlined (no fragment interpolation) so the gql() tagged template
 * produces a string that exactly matches the codegen-generated overload,
 * giving us a fully-typed TypedDocumentNode<GetPagesHomeQuery, ...>.
 *
 * Schema: PagesHomeResult { pages: [PageHomeItem!]! }
 */
import { gql } from '@/gql';

export const GET_PAGES_HOME = gql(`
  query GetPagesHome($workspaceId: ID!, $projectId: ID!, $limit: Int) {
    getPagesHome(workspaceId: $workspaceId, projectId: $projectId, limit: $limit) {
      pages {
        id
        title
        emojiIcon
        updatedAt
        createdByName
      }
    }
  }
`);