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
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Vault Files</h3>

        {/* Storage used badge — no quota, just raw usage */}
        <div className="flex items-center gap-1.5 bg-muted/50 border border-border/60 rounded-lg px-2.5 py-1">
          <HardDrive className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] font-semibold text-foreground tabular-nums">
            {formatSize(usage.usedBytes)}
          </span>
          <span className="text-[11px] text-muted-foreground">used</span>
          <span className="text-[11px] text-muted-foreground">·</span>
          <span className="text-[11px] font-semibold text-foreground tabular-nums">
            {usage.fileCount}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {usage.fileCount === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>

      {/* File list */}
      {files.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-border rounded-lg flex flex-col items-center gap-2">
          <FolderOpen className="h-6 w-6 text-muted-foreground/30" />
          <p className="text-[11px] text-muted-foreground">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType, file.name)
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/40 transition-colors group"
              >
                <div className="h-7 w-7 shrink-0 rounded bg-muted/50 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="flex-1 min-w-0 text-[12px] font-medium text-foreground/80 truncate group-hover:text-foreground transition-colors">
                  {file.name}
                </p>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
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
        className="flex items-center gap-1 mt-3 text-[11px] text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        View all files
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
