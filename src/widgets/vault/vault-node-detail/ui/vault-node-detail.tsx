import { X } from 'lucide-react'
import { VaultFolderDetail } from './vault-folder-detail'
import { VaultFileDetail } from './vault-file-detail'
import type { VaultFolder } from '@/entities/vault-folder'
import type { VaultFile } from '@/entities/vault-file'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { useVaultNode } from '@/features/vault/fetch-node'
import { VaultNodeType } from '@/gql/graphql'

interface VaultNodeDetailProps {
  selectedNodeId: string
  selectedNodeType: VaultNodeType
  onClose: () => void
}

/**
 * Right-side detail drawer.
 * Fetches full node data via useVaultNode then delegates to
 * VaultFolderDetail or VaultFileDetail based on type.
 *
 * @layer Widgets
 */
export function VaultNodeDetail({
  selectedNodeId,
  selectedNodeType,
  onClose,
}: VaultNodeDetailProps) {
  const { data, isLoading } = useVaultNode(
    selectedNodeId,
    selectedNodeType,
    true,
  )

  return (
    <aside className="w-72 shrink-0 border-l bg-surface-1 flex flex-col h-full overflow-y-auto">
      {/* Close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <span className="text-sm font-medium text-secondary">
          Details
        </span>
        <button
          onClick={onClose}
          className="text-secondary hover:text-primary transition-colors rounded p-1 hover:bg-layer-2"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <DetailSkeleton />
      ) : data ? (
        selectedNodeType === VaultNodeType.Folder ? (
          <VaultFolderDetail folder={data as VaultFolder} onClose={onClose} />
        ) : (
          <VaultFileDetail file={data as VaultFile} onClose={onClose} />
        )
      ) : null}
    </aside>
  )
}

function DetailSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  )
}
