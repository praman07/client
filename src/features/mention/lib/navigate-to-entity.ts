/**
 * useNavigateToEntity — type-safe mention chip navigation hook.
 *
 * Uses TanStack Router's fully-typed `navigate()` with literal `to` values
 * from the generated `FileRoutesByTo` union so broken routes are compile errors.
 *
 * `to` values come from `FileRoutesByTo` (NOT `fullPaths`) — index routes are
 * addressed WITHOUT a trailing slash in the `to` union:
 *   issues/index.tsx → to: '/workspace/$workspaceSlug/project/$projectSlug/issues'
 *   vault/index.tsx  → to: '/workspace/$workspaceSlug/project/$projectSlug/vault'
 *
 * Route mapping:
 *   PAGE         → .../pages/$pageId
 *   ISSUE        → .../issues  ?issueId=
 *   VAULT_FILE   → .../vault
 *   VAULT_FOLDER → .../vault   ?folderId=
 *   WHITEBOARD   → .../whiteboard/$boardId
 *   USER         → no-op (global profile not yet built)
 *
 * @layer Features → mention/lib
 */
import { useNavigate, useParams } from '@tanstack/react-router'
import { SearchEntityType } from '@/gql/graphql'

/**
 * Returns a stable `navigateToEntity(entityId, entityType)` callback.
 * Must be rendered inside the project route tree so `workspaceSlug`
 * and `projectSlug` params are available.
 */
export function useNavigateToEntity() {
  const navigate = useNavigate()
  // Anchored to the project layout — both params are always present here
  const { workspaceSlug, projectSlug } = useParams({
    from: '/_app/workspace/$workspaceSlug/project/$projectSlug',
  })

  return function navigateToEntity(entityId: string, entityType: string): void {
    if (!entityId || !entityType) return

    switch (entityType) {
      case SearchEntityType.Page:
        void navigate({
          to: '/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId',
          params: { workspaceSlug, projectSlug, pageId: entityId },
        })
        break

      case SearchEntityType.Issue:
        // No dedicated /issues/:id route — navigate to issues with ?issueId=
        void navigate({
          to: '/workspace/$workspaceSlug/project/$projectSlug/issues',
          params: { workspaceSlug, projectSlug },
          search: (prev) => ({ ...prev, issueId: entityId }),
        })
        break

      case SearchEntityType.VaultFile:
        void navigate({
          to: '/workspace/$workspaceSlug/project/$projectSlug/vault',
          params: { workspaceSlug, projectSlug },
          search: { folderId: undefined },
        })
        break

      case SearchEntityType.VaultFolder:
        void navigate({
          to: '/workspace/$workspaceSlug/project/$projectSlug/vault',
          params: { workspaceSlug, projectSlug },
          search: (prev) => ({ ...prev, folderId: entityId }),
        })
        break

      case SearchEntityType.Whiteboard:
        void navigate({
          to: '/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId',
          params: { workspaceSlug, projectSlug, boardId: entityId },
        })
        break

      case SearchEntityType.User:
        // Global user profile not yet built — no navigation
        break

      default:
        break
    }
  }
}
