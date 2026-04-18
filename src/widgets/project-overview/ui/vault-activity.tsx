import React from 'react'
import { Archive, ChevronRight, File, FileCode, FileImage, FileText, FolderOpen, HardDrive } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'

interface VaultFile {
  id: string
  name: string
  mimeType: string
  sizeBytes: number
  createdByName?: string | null
  createdAt: string
}

interface VaultUsage {
  usedBytes: number
  fileCount: number
}

interface VaultActivityProps {
  files: Array<VaultFile>
  usage: VaultUsage
}

const getFileIcon = (mime: string, name: string) => {
  if (name.endsWith('/') || mime === 'inode/directory') return FolderOpen
  if (mime.startsWith('image/')) return FileImage
  if (mime.includes('pdf')) return FileText
  if (mime.includes('zip') || mime.includes('tar') || mime.includes('gzip')) return Archive
  if (
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    mime.includes('json') ||
    mime.includes('xml')
  )
    return FileCode
  if (mime.startsWith('text/')) return FileText
  return File
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const VaultActivity: React.FC<VaultActivityProps> = ({ files, usage }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="bg-layer-1 border border-subtle rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">Recent Vault Files</h3>

        {/* Storage used badge — no quota, just raw usage */}
        <div className="flex items-center gap-1.5 bg-layer-2/50 border border-subtle/60 rounded-lg px-2.5 py-1">
          <HardDrive className="h-3 w-3 text-secondary shrink-0" />
          <span className="text-[11px] font-semibold text-primary tabular-nums">
            {formatSize(usage.usedBytes)}
          </span>
          <span className="text-[11px] text-secondary">used</span>
          <span className="text-[11px] text-secondary">·</span>
          <span className="text-[11px] font-semibold text-primary tabular-nums">
            {usage.fileCount}
          </span>
          <span className="text-[11px] text-secondary">
            {usage.fileCount === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>

      {/* File list */}
      {files.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-subtle rounded-lg flex flex-col items-center gap-2">
          <FolderOpen className="h-6 w-6 text-secondary/30" />
          <p className="text-[11px] text-secondary">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType, file.name)
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-layer-2/40 transition-colors group"
              >
                <div className="h-7 w-7 shrink-0 rounded bg-layer-2/50 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-secondary group-hover:text-primary transition-colors" />
                </div>
                <p className="flex-1 min-w-0 text-[12px] font-medium text-primary/80 truncate group-hover:text-primary transition-colors">
                  {file.name}
                </p>
                <span className="text-[11px] text-secondary tabular-nums shrink-0">
                  {formatSize(file.sizeBytes)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <Link
        to="/workspace/$workspaceSlug/project/$projectSlug/vault"
        params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
        search={(prev: any) => prev}
        className="flex items-center gap-1 mt-3 text-[11px] text-secondary hover:text-primary transition-colors w-fit"
      >
        View all files
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
