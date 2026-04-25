import React from 'react'
import { ChevronRight, File, FileCode, FileImage, Folder, HardDrive, Layout } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useParams } from '@tanstack/react-router'

interface VaultFile {
  id: string
  name: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

interface WhiteboardItem {
  id: string
  title: string
  elementCount: number
  updatedAt: string
  isLocked?: boolean | null
}

interface RecentFilesProps {
  files: Array<VaultFile>
  whiteboards: Array<WhiteboardItem>
}

const getFileIcon = (mime: string, name: string) => {
  if (name.endsWith('/') || mime === 'inode/directory') return Folder
  if (mime.startsWith('image/')) return FileImage
  if (mime.includes('pdf') || mime.includes('text')) return File
  if (
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    mime.includes('json') ||
    mime.includes('xml')
  )
    return FileCode
  return File
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

interface FileRowProps {
  icon: React.ElementType
  label: string
  meta: string
  href: string
  isLocked?: boolean
}

const FileRow: React.FC<FileRowProps> = ({ icon: Icon, label, meta, href, isLocked }) => (
  <a
    href={href}
    className="group flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-layer-1-hover transition-colors"
  >
    <div className="h-6 w-6 shrink-0 rounded bg-layer-2 flex items-center justify-center">
      <Icon className="h-3.5 w-3.5 text-secondary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-13 font-medium text-primary truncate group-hover:text-primary transition-colors">
        {label}
        {isLocked && <span className="ml-1.5 text-10 text-tertiary">(locked)</span>}
      </p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-11 text-secondary tabular-nums">{meta}</span>
      <ChevronRight className="h-3.5 w-3.5 text-tertiary group-hover:text-secondary transition-colors" />
    </div>
  </a>
)

export const RecentFiles: React.FC<RecentFilesProps> = ({ files, whiteboards }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  // Merge and sort by updatedAt
  const allItems = [
    ...files.map((f) => ({
      type: 'file' as const,
      id: f.id,
      title: f.name,
      meta: formatSize(f.sizeBytes),
      updatedAt: f.createdAt,
      mimeType: f.mimeType,
    })),
    ...whiteboards.map((w) => ({
      type: 'whiteboard' as const,
      id: w.id,
      title: w.title,
      meta: `${w.elementCount} elements`,
      updatedAt: w.updatedAt,
      isLocked: w.isLocked,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const vaultHref = `/workspace/${workspaceSlug}/project/${projectSlug}/vault`
  const boardsHref = `/workspace/${workspaceSlug}/project/${projectSlug}/whiteboards`

  return (
    <div className="bg-layer-1 border border-subtle rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-14 font-semibold text-primary">Recent Files & Boards</h3>
      </div>

      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-subtle rounded-lg gap-2">
          <HardDrive className="h-5 w-5 text-disabled" />
          <p className="text-11 text-secondary">No files or boards yet</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {allItems.map((item) => {
            const Icon = item.type === 'file' ? getFileIcon(item.mimeType, item.title) : Layout
            const href = item.type === 'file' ? vaultHref : boardsHref
            const timeAgo = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })

            return (
              <FileRow
                key={`${item.type}-${item.id}`}
                icon={Icon}
                label={item.title}
                meta={`${item.meta} · ${timeAgo}`}
                href={href}
                isLocked={item.type === 'whiteboard' ? !!item.isLocked : undefined}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}