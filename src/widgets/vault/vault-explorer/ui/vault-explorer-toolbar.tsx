import { ArrowUpDown, FolderPlus, Upload } from 'lucide-react'
import type { VaultSortState } from '@/shared/lib/vault-types'
import { Button } from '@/shared/ui/primitives/button'
import { Guard } from '@/shared/lib/auth'

interface VaultExplorerToolbarProps {
  sort: VaultSortState
  onCreateFolder: () => void
  onUpload: () => void
}

/**
 * Toolbar row: New Folder + Upload buttons + sort indicator.
 * @layer Widgets
 */
export function VaultExplorerToolbar({
  sort,
  onCreateFolder,
  onUpload,
}: VaultExplorerToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
      <Guard permission="vault:folder:create">
        <Button variant="outline" size="sm" onClick={onCreateFolder}>
          <FolderPlus className="h-4 w-4 mr-1.5" />
          New Folder
        </Button>
      </Guard>

      <Guard permission="vault:file:upload">
        <Button size="sm" onClick={onUpload}>
          <Upload className="h-4 w-4 mr-1.5" />
          Upload
        </Button>
      </Guard>

      <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
        <ArrowUpDown className="h-3.5 w-3.5" />
        {sort.sortBy} · {sort.sortDir}
      </div>
    </div>
  )
}
