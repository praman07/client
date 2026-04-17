/**
 * navigate-to-entity — derives a TanStack Router route from an entityId.
 *
 * EntityId prefix convention (FR-013):
 *   PAGE        ids contain no prefix — routed by type field
 *   ISSUE       ids contain no prefix — routed by type field
 *   VAULT_FILE  ids contain no prefix — routed by type field
 *   WHITEBOARD  ids contain no prefix — routed by type field
 *   USER        profile pages — routed by type field
 *
 * Returns null if the entityType is unrecognised or if entityId is empty.
 * MentionChip callers should guard against null before navigating.
 *
 * @layer Features → mention/lib
 */
import { SearchEntityType } from '@/gql/graphql'

// Route segments per entity type
const TYPE_SEGMENT: Partial<Record<string, string>> = {
  [SearchEntityType.Page]:        'pages',
  [SearchEntityType.Issue]:       'issues',
  [SearchEntityType.VaultFile]:   'vault',
  [SearchEntityType.VaultFolder]: 'vault',
  [SearchEntityType.Whiteboard]:  'whiteboards',
  [SearchEntityType.User]:        'members',
}

/**
 * Build a relative route path for the given entity.
 *
 * Pattern: /<segment>/<entityId>
 *
 * The project/workspace prefix is intentionally omitted because navigation
 * happens inside an already-scoped project context. TanStack Router's
 * `useNavigate` will resolve this relative to the current route tree.
 *
 * Returns null for unknown entity types or empty entityIds.
 */
export function buildEntityRoute(
  entityId: string,
  entityType: string,
): string | null {
  if (!entityId || !entityType) return null

  const segment = TYPE_SEGMENT[entityType]
  if (!segment) return null

  return `${segment}/${entityId}`
}
