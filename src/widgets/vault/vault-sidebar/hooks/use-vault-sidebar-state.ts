import { useNavigate, useSearch } from '@tanstack/react-router'

/**
 * Reads the current folderId from the URL ?folderId search param
 * and exposes a navigate() helper to change it.
 *
 * folderId = null → root / Home view.
 *
 * @layer Widgets — vault-sidebar
 */
export function useVaultSidebarState() {
  const navigate = useNavigate()

  // Search params — using any because vault route search types
  // are not yet declared in route type definitions
  const search = useSearch({ strict: false })
  const activeFolderId = search.folderId ?? null

  function navigateToFolder(folderId: string | null) {
     
     
    void (navigate as any)({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        folderId: folderId ?? undefined,
      }),
    })
  }

  return { activeFolderId, navigate: navigateToFolder }
}
