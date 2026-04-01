/**
 * Navigation configuration — shared tab definitions used across the app.
 *
 * Note on `href` typing:
 * TanStack Router's `LinkProps['to']` is a union of absolute literal route paths.
 * Nav tabs use relative paths (e.g. './chat') resolved at runtime via the `from`
 * prop on <NavTabs>. TypeScript cannot validate relative paths statically, so
 * href is typed as `string` here and the call-site passes `as any` to NavTabs.
 * This is intentional — the router will throw at runtime if a path is invalid.
 */

/** Shared nav item shape */
export interface NavItem {
  label: string
  href: string
  activeOptions?: { exact?: boolean }
}

export const WORKSPACE_TABS: NavItem[] = [
  { label: 'Overview', href: '.', activeOptions: { exact: true } },
  { label: 'Projects', href: './projects' },
  { label: 'Members', href: './members' },
  { label: 'Settings', href: './settings' },
]

/**
 * Maps PluginType string values to their nav tab metadata.
 * Order here determines the order in the nav when multiple plugins are active.
 */
export const PLUGIN_TAB_REGISTRY: Record<string, NavItem> = {
  CHAT:       { label: 'Chat',       href: './chat' },
  WHITEBOARD: { label: 'Whiteboard', href: './whiteboard' },
  PAGES:      { label: 'Pages',      href: './pages' },
  VAULT:      { label: 'Vault',      href: './vault' },
  ISSUES:     { label: 'Issues',     href: './kanban' },
}

/**
 * Core tabs always shown regardless of active plugins.
 * Home is pinned first; Settings is pinned last.
 */
export const CORE_PROJECT_TABS: NavItem[] = [
  { label: 'Home', href: '.', activeOptions: { exact: true } },
]

export const CORE_PROJECT_TAIL_TABS: NavItem[] = [
  { label: 'Settings', href: './settings' },
]

/**
 * Builds the ordered nav tab list for a project layout.
 *
 * Core tabs are pinned first (Home) and last (Settings).
 * Plugin tabs are derived from activePlugins in the order they appear in
 * PLUGIN_TAB_REGISTRY — not the order they appear in activePlugins — so
 * the nav is always deterministic regardless of server-side array order.
 *
 * @param activePlugins - PluginType string[] from the project fragment
 */
export function buildProjectNav(activePlugins: string[]): NavItem[] {
  const pluginTabs = Object.entries(PLUGIN_TAB_REGISTRY)
    .filter(([key]) => activePlugins.includes(key))
    .map(([, tab]) => tab)

  return [...CORE_PROJECT_TABS, ...pluginTabs, ...CORE_PROJECT_TAIL_TABS]
}
