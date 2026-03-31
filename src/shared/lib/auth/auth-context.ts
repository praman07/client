/**
 * auth-context.ts
 *
 * TypeScript types for the AuthorizationProvider context shape.
 * This is the single source of truth for what the context exposes.
 */

export interface AuthScopeContext {
  /** True while the activeContext query is in-flight */
  isLoading: boolean
  /** Current workspace ID (from Redux) */
  workspaceId: string | null
  /** Current project ID (from Redux, optional) */
  projectId: string | null
  /** User's resolved role name at workspace scope */
  workspaceRole: string | null
  /** User's resolved role name at project scope (null if no project) */
  projectRole: string | null
  /** Full list of permission strings granted at the current scope */
  grantedPermissions: Array<string>
  /** All known feature flags resolved for the current user/scope */
  featureFlags: Record<string, boolean>
}

export const AUTH_SCOPE_CONTEXT_DEFAULT: AuthScopeContext = {
  isLoading: false,
  workspaceId: null,
  projectId: null,
  workspaceRole: null,
  projectRole: null,
  grantedPermissions: [],
  featureFlags: {},
}
