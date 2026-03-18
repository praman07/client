import { useState } from 'react'
import { useVaultExplorerActions } from '../hooks/use-vault-explorer-actions'
import { useVaultSort } from '../hooks/use-vault-sort'
import { VaultBreadcrumb } from './vault-breadcrumb'
import { VaultExplorerToolbar } from './vault-explorer-toolbar'
import { VaultExplorerSkeleton } from './vault-explorer-skeleton'
import { VaultExplorerEmpty } from './vault-explorer-empty'
import { VaultFolderCard } from './vault-folder-card'
import { VaultFileCard } from './vault-file-card'
import type { BreadcrumbEntry } from './vault-breadcrumb'
import type { VaultNodeType } from '@/gql/graphql'
import type { VaultFolder } from '@/entities/vault-folder'
import { RenameFileModal } from '@/features/vault/rename-file'
import { RenameFolderModal } from '@/features/vault/rename-folder'
import { CreateFolderModal } from '@/features/vault/create-folder'

interface VaultExplorerProps {
  projectId: string
  workspaceId: string
  folderId: string | null
  breadcrumbTrail: Array<BreadcrumbEntry>
  onSelectNode: (id: string, type: VaultNodeType) => void
  onNavigateInto: (folder: VaultFolder) => void
  onNavigateTo: (folderId: string | null) => void
}

type RenameFileTarget = {
  fileId: string
  name: string
  folderId: string | null
}
type RenameFolderTarget = {
  folderId: string
  name: string
  parentFolderId: string | null
}

/**
 * Main vault file manager content panel.
 * Renders breadcrumb (from parent trail), toolbar, folder/file grids.
 * Rename modals are owned here (per-grid selection context).
 *
 * @layer Widgets
 */
export function VaultExplorer({
  projectId,
  workspaceId,
  folderId,
  breadcrumbTrail,
  onSelectNode,
  onNavigateInto,
  onNavigateTo,
}: VaultExplorerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [renameFileTarget, setRenameFileTarget] =
    useState<RenameFileTarget | null>(null)
  const [renameFolderTarget, setRenameFolderTarget] =
    useState<RenameFolderTarget | null>(null)
  const { sort } = useVaultSort()

  const {
    childrenQuery,
    folders,
    files,
    fileInputRef,
    handleUploadClick,
    handleFilesPicked,
  } = useVaultExplorerActions({
    projectId,
    workspaceId,
    folderId,
    onSelectNode,
    sort,
  })

  const isEmpty =
    !childrenQuery.isLoading &&
    (folders).length === 0 &&
    (files).length === 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFilesPicked(e.target.files)}
      />

      {/* Create folder modal */}
      <CreateFolderModal
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        projectId={projectId}
        parentFolderId={folderId}
      />

      {/* Rename file modal */}
      {renameFileTarget && (
        <RenameFileModal
          open
          onOpenChange={(open) => {
            if (!open) setRenameFileTarget(null)
          }}
          fileId={renameFileTarget.fileId}
          projectId={projectId}
          folderId={renameFileTarget.folderId}
          currentName={renameFileTarget.name}
        />
      )}

      {/* Rename folder modal */}
      {renameFolderTarget && (
        <RenameFolderModal
          open
          onOpenChange={(open) => {
            if (!open) setRenameFolderTarget(null)
          }}
          folderId={renameFolderTarget.folderId}
          projectId={projectId}
          parentFolderId={renameFolderTarget.parentFolderId}
          currentName={renameFolderTarget.name}
        />
      )}

      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b">
        <VaultBreadcrumb trail={breadcrumbTrail} onNavigateTo={onNavigateTo} />
      </div>

      {/* Toolbar */}
      <VaultExplorerToolbar
        sort={sort}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
        onUpload={handleUploadClick}
      />

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {childrenQuery.isLoading ? (
          <VaultExplorerSkeleton />
        ) : isEmpty ? (
          <VaultExplorerEmpty
            onUpload={handleUploadClick}
            onCreateFolder={() => setIsCreateFolderOpen(true)}
          />
        ) : (
          <div className="p-6 space-y-6">
            {/* Folders section */}
            {(folders).length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Folders
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {(folders).map((folder) => (
                    <VaultFolderCard
                      key={folder.id}
                      folder={folder}
                      projectId={projectId}
                      isSelected={selectedNodeId === folder.id}
                      onSelect={() => {
                        setSelectedNodeId(folder.id)
                        // TODO: re-enable when detail sidebar is ready
                        // onSelectNode(folder.id, VaultNodeType.Folder)
                      }}
                      onOpen={() => onNavigateInto(folder)}
                      onRename={() =>
                        setRenameFolderTarget({
                          folderId: folder.id,
                          name: folder.name,
                          parentFolderId: folder.parentFolderId ?? null,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Files section */}
            {(files).length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Files
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {(files).map((file) => (
                    <VaultFileCard
                      key={file.id}
                      file={file}
                      projectId={projectId}
                      isSelected={selectedNodeId === file.id}
                      onSelect={() => {
                        setSelectedNodeId(file.id)
                        // TODO: re-enable when detail sidebar is ready
                        // onSelectNode(file.id, VaultNodeType.File)
                      }}
                      onRename={() =>
                        setRenameFileTarget({
                          fileId: file.id,
                          name: file.name,
                          folderId: file.folderId ?? null,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
