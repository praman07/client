import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import type { VaultFolder } from '@/entities/vault-folder'
import type { VaultNodeType } from '@/gql/graphql'
import { SidebarProvider } from '@/shared/ui/primitives/sidebar'
import { VaultSidebar } from '@/widgets/vault/vault-sidebar'
import { VaultExplorer } from '@/widgets/vault/vault-explorer'
import { VaultNodeDetail } from '@/widgets/vault/vault-node-detail'
import { VaultUploadTray } from '@/widgets/vault/vault-upload-tray'
import { useVaultAncestors } from '@/features/vault/fetch-ancestors'
import { WidgetError } from '@/shared/ui'

type BreadcrumbEntry = Pick<VaultFolder, 'id' | 'name'>

interface VaultPageProps {
  workspaceId: string
  projectId: string
}

/**
 * Vault page — 3-panel layout:
 *   [Sidebar] | [Explorer] | [NodeDetail (conditional)]
 *
 * folderId: persisted in URL search param ?folderId=
 * breadcrumbTrail: client-side trail (zero queries for in-session navigation)
 * selectedNode: transient local state (opens detail panel)
 *
 * Breadcrumb dual-path:
 *   Client trail — accumulated as user navigates in-session. onNavigateInto
 *   pushes the full VaultFolder object (already in children query cache).
 *   Server fallback — useVaultAncestors fires only when folderId is set
 *   but trail is empty (direct URL visit or page refresh).
 *
 * @layer Pages
 */
export function VaultPage({ workspaceId, projectId }: VaultPageProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const folderId = search.folderId ?? null

  const [breadcrumbTrail, setBreadcrumbTrail] = useState<Array<BreadcrumbEntry>>([])
  const [selectedNode, setSelectedNode] = useState<{
    id: string
    type: VaultNodeType
  } | null>(null)

  // Server fallback — fires only on direct URL visit / page refresh
  // when folderId is present but the client trail is empty.
  const needsServerFallback = !!folderId && breadcrumbTrail.length === 0
  const serverAncestors = useVaultAncestors(folderId, needsServerFallback)

  useEffect(() => {
    if (needsServerFallback && serverAncestors.length > 0) {
      setBreadcrumbTrail(serverAncestors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAncestors])

  // Client path: user double-clicked a folder card in the grid.
  // Full VaultFolder is already in the children query response — no extra fetch.
  function handleNavigateInto(folder: VaultFolder) {
    setBreadcrumbTrail((prev) => [
      ...prev,
      { id: folder.id, name: folder.name },
    ])
     
     
    void (navigate as any)({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        folderId: folder.id,
      }),
    })
  }

  // Breadcrumb back-click: truncate trail to the clicked entry.
  function handleNavigateTo(targetFolderId: string | null) {
    if (!targetFolderId) {
      setBreadcrumbTrail([])
    } else {
      const idx = breadcrumbTrail.findIndex((f) => f.id === targetFolderId)
      setBreadcrumbTrail((prev) => prev.slice(0, idx + 1))
    }
     
     
    void (navigate as any)({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        folderId: targetFolderId ?? undefined,
      }),
    })
  }

  function handleSelectNode(id: string, type: VaultNodeType) {
    setSelectedNode({ id, type })
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex overflow-hidden bg-surface-1">
        {/* Left: Sidebar — isolated so sidebar failure doesn't kill explorer */}
        <ErrorBoundary FallbackComponent={WidgetError}>
          <VaultSidebar projectId={projectId} />
        </ErrorBoundary>

        {/* Center: Explorer — isolated failure */}
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          <ErrorBoundary FallbackComponent={WidgetError}>
            <VaultExplorer
              projectId={projectId}
              workspaceId={workspaceId}
              folderId={folderId}
              breadcrumbTrail={breadcrumbTrail}
              onSelectNode={handleSelectNode}
              onNavigateInto={handleNavigateInto}
              onNavigateTo={handleNavigateTo}
            />
          </ErrorBoundary>
        </main>

        {/* Right: Detail drawer — conditional, isolated */}
        {selectedNode && (
          <ErrorBoundary FallbackComponent={WidgetError}>
            <VaultNodeDetail
              selectedNodeId={selectedNode.id}
              selectedNodeType={selectedNode.type}
              onClose={() => setSelectedNode(null)}
            />
          </ErrorBoundary>
        )}

        {/* Upload tray — isolated */}
        <ErrorBoundary FallbackComponent={WidgetError}>
          <VaultUploadTray />
        </ErrorBoundary>
      </div>
    </SidebarProvider>
  )
}
