import { FolderPlus, Upload } from 'lucide-react'

interface VaultExplorerEmptyProps {
  onUpload: () => void
  onCreateFolder: () => void
}

/**
 * Empty state — shown when a folder has no files or subfolders.
 * Doubles as the drop zone hint.
 * @layer Widgets
 */
export function VaultExplorerEmpty({
  onUpload,
  onCreateFolder,
}: VaultExplorerEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-layer-2">
        <Upload className="h-8 w-8 text-tertiary" />
      </div>
      <div>
        <h3 className="text-16 font-semibold text-primary">This folder is empty</h3>
        <p className="text-14 text-secondary mt-1">
          Drop files here or use the buttons above to upload or create a folder.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 text-13 px-3 py-1.5 rounded-md border border-subtle bg-layer-2 hover:bg-layer-2-hover text-primary transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload file
        </button>
        <button
          onClick={onCreateFolder}
          className="flex items-center gap-1.5 text-13 px-3 py-1.5 rounded-md border border-subtle bg-layer-2 hover:bg-layer-2-hover text-primary transition-colors"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          New folder
        </button>
      </div>
    </div>
  )
}
