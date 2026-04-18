import type { VaultFolder } from '@/entities/vault-folder'
import type { VaultFile } from '@/entities/vault-file'
import { formatBytes } from '@/widgets/vault/vault-explorer/lib/format-bytes'

interface VaultDetailMetaProps {
  node: VaultFolder | VaultFile
  type: 'FOLDER' | 'FILE'
}

/**
 * Metadata rows displayed in the detail panel.
 * @layer Widgets
 */
export function VaultDetailMeta({ node, type }: VaultDetailMetaProps) {
  const file = type === 'FILE' ? (node as VaultFile) : null

  const rows: Array<{ label: string; value: string }> = [
    {
      label: 'Type',
      value: type === 'FILE' ? (file?.mimeType ?? '—') : 'Folder',
    },
    ...(file ? [{ label: 'Size', value: formatBytes(file.sizeBytes) }] : []),
    { label: 'Created', value: new Date(node.createdAt).toLocaleDateString() },
    { label: 'Modified', value: new Date(node.updatedAt).toLocaleDateString() },
    ...(file?.uploader?.fullName
      ? [{ label: 'Uploaded by', value: file.uploader.fullName }]
      : []),
  ]

  return (
    <div className="flex flex-col gap-3">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <span className="text-xs text-secondary">{label}</span>
          <span className="text-sm truncate">{value}</span>
        </div>
      ))}
    </div>
  )
}
