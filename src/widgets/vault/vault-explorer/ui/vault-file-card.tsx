import { MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatBytes } from '../lib/format-bytes'
import { getMimeIcon } from '../lib/get-mime-icon'
import { VaultFileContextMenu } from './vault-file-context-menu'
import type { VaultFile } from '@/entities/vault-file'
import { cn } from '@/shared/lib/utils'
import { useVaultDownloadUrl } from '@/features/vault/fetch-download-url'

interface VaultFileCardProps {
  file: VaultFile
  onSelect: () => void
  onRename?: () => void
  isSelected: boolean
  projectId: string
}

/**
 * File grid card — Google Drive style.
 * - Images: shows a lazy-loaded thumbnail preview.
 * - Other types: MIME-aware icon on a semantically tinted background.
 * - Metadata row: uploader name · size · relative date.
 * @layer Widgets
 */
export function VaultFileCard({
  file,
  onSelect,
  onRename,
  isSelected,
  projectId,
}: VaultFileCardProps) {
  const { Icon, color, bgColor } = getMimeIcon(file.mimeType)
  const isImage = file.mimeType.startsWith('image/')

  // Only fetch a presigned GET URL for image files (thumbnail preview)
  const { data: downloadData } = useVaultDownloadUrl(file.id, isImage)
  const thumbnailUrl = downloadData?.url
  const showThumb = isImage && !!thumbnailUrl

  const uploadedAt = file.confirmedAt
    ? formatDistanceToNow(new Date(file.confirmedAt), { addSuffix: true })
    : formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })

  return (
    <VaultFileContextMenu file={file} projectId={projectId} onRename={onRename}>
      <div
        onClick={onSelect}
        className={cn(
          'group flex flex-col rounded-xl cursor-pointer select-none transition-all duration-150 overflow-hidden border',
          isSelected
            ? 'border-accent-subtle ring-2 ring-accent-subtle bg-accent-subtle'
            : 'border-subtle/50 hover:border-subtle hover:shadow-md bg-layer-1',
        )}
      >
        {/* ── Preview area ──────────────────────────────── */}
        <div
          className={cn(
            'relative flex h-32 w-full items-center justify-center overflow-hidden transition-colors duration-150',
            showThumb ? 'bg-layer-2/40' : bgColor,
            !isSelected && !showThumb && 'group-hover:brightness-95',
          )}
        >
          {showThumb && thumbnailUrl ? (
            // Thumbnail via presigned S3 GET URL
            <img
              src={thumbnailUrl}
              alt={file.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon
              className={cn('h-14 w-14 drop-shadow-sm', color)}
              strokeWidth={1.25}
            />
          )}

          {/* Hover overlay tint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-150" />
        </div>

        {/* ── Info row ──────────────────────────────────── */}
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1">
          <Icon className={cn('h-3 w-3 shrink-0', color)} strokeWidth={2} />
          <span className="flex-1 text-sm font-medium truncate leading-none">
            {file.name}
          </span>
          <button
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 rounded-md p-1 opacity-0 group-hover:opacity-100 hover:bg-layer-1 transition-opacity duration-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-secondary" />
          </button>
        </div>

        {/* ── Metadata row ──────────────────────────────── */}
        <div className="flex items-center gap-1 px-3 pb-2.5 text-xs text-secondary truncate">
          {file.uploader && (
            <>
              <span className="truncate max-w-20">
                {file.uploader.fullName.split(' ')[0]}
              </span>
              <span className="shrink-0">·</span>
            </>
          )}
          <span className="shrink-0">{formatBytes(file.sizeBytes)}</span>
          <span className="shrink-0">·</span>
          <span className="shrink-0 truncate">{uploadedAt}</span>
        </div>
      </div>
    </VaultFileContextMenu>
  )
}
