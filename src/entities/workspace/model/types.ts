import type {
  WorkspaceFragmentFragment,
  WorkspaceSettingsFragmentFragment,
} from '@/gql/graphql'

/**
 * Lightweight workspace type — used in sidebar, workspace switcher, and card.
 * Shape: { id, name, slug, logoUrl, memberRole }
 */
export type WorkspacePartial = WorkspaceFragmentFragment

/**
 * Full workspace type — used in the settings page general tab.
 * Shape: { id, name, slug, logoUrl, domainWhitelist, memberRole, createdAt, updatedAt }
 */
export type WorkspaceSettings = WorkspaceSettingsFragmentFragment
