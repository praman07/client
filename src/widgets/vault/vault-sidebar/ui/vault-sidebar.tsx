import { ErrorBoundary } from 'react-error-boundary'
import { useVaultSidebarState } from '../hooks/use-vault-sidebar-state'
import { VaultSidebarSection } from './vault-sidebar-section'
import { VaultFolderItem } from './vault-folder-item'
import { VaultSidebarSkeleton } from './vault-sidebar-skeleton'
import type { VaultFolder } from '@/entities/vault-folder'
import { ScrollArea, WidgetError  } from '@/shared/ui'
import { Sidebar, SidebarContent } from '@/shared/ui/primitives/sidebar'
import { useVaultSidebar } from '@/features/vault/fetch-sidebar'
import { VaultStorageBar } from '@/widgets/vault/vault-storage-bar'

interface VaultSidebarProps {
  projectId: string
}

/**
 * Vault left-panel sidebar.
 * Shows pinned folders, system folders, and a storage bar at the bottom.
 * Clicking a folder navigates to it (updates URL ?folderId param).
 *
 * @layer Widgets
 */
export function VaultSidebar({ projectId }: VaultSidebarProps) {
  const { data, isLoading } = useVaultSidebar(projectId)
  const { activeFolderId, navigate } = useVaultSidebarState()

  const pinnedFolders = (data?.pinnedFolders ?? [])
  const systemFolders = (data?.systemFolders ?? [])
  const pinnedIds = new Set(pinnedFolders.map((f: VaultFolder) => f.id))

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-subtle inset-y-0 z-0 relative h-full"
    >
      <SidebarContent className="overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col gap-2 p-2 animate-fade-in-in">
            {isLoading ? (
              <VaultSidebarSkeleton />
            ) : (
              <>
                {/* Pinned folders */}
                {pinnedFolders.length > 0 && (
                  <VaultSidebarSection label="Pinned">
                    {pinnedFolders.map((folder: VaultFolder) => (
                      <VaultFolderItem
                        key={folder.id}
                        folder={folder}
                        isActive={activeFolderId === folder.id}
                        isPinned
                        onClick={() => navigate(folder.id)}
                      />
                    ))}
                  </VaultSidebarSection>
                )}

                {/* System folders */}
                <VaultSidebarSection label="Folders" defaultOpen>
                  {systemFolders.map((folder: VaultFolder) => (
                    <VaultFolderItem
                      key={folder.id}
                      folder={folder}
                      isActive={activeFolderId === folder.id}
                      isPinned={pinnedIds.has(folder.id)}
                      onClick={() => navigate(folder.id)}
                    />
                  ))}
                </VaultSidebarSection>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Storage bar — isolated so a usage API failure doesn't crash the sidebar */}
        <div className="border-t border-subtle mt-auto">
          <ErrorBoundary FallbackComponent={WidgetError}>
            <VaultStorageBar projectId={projectId} />
          </ErrorBoundary>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
