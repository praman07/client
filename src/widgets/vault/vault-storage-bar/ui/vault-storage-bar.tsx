import { formatBytes } from '../lib/format-bytes'
import { useVaultUsage } from '@/features/vault/fetch-vault-usage'

interface VaultStorageBarProps {
  projectId: string
}

/**
 * Compact storage usage meter — mounted at the bottom of VaultSidebar.
 *
 * Shows: "X.X GB of Y GB used" + fill bar.
 * Color: neutral → amber at 80% → red at 90%.
 *
 * @layer Widgets
 */
export function VaultStorageBar({ projectId }: VaultStorageBarProps) {
  const { data, isLoading } = useVaultUsage(projectId)

  if (isLoading || !data) {
    return (
      <div className="px-3 py-2">
        <div className="h-1.5 w-full rounded-full bg-layer-2 animate-pulse" />
      </div>
    )
  }

  const { projectUsedBytes, projectLimitBytes } = data

  const percentUsed =
    projectLimitBytes > 0 ? (projectUsedBytes / projectLimitBytes) * 100 : 0

  const barColor =
    percentUsed >= 90
      ? 'bg-danger-primary'
      : percentUsed >= 80
        ? 'bg-amber-500'
        : 'bg-primary'

  return (
    <div className="px-3 py-2 space-y-1.5">
      {/* Fill bar */}
      <div className="h-1.5 w-full rounded-full bg-layer-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Label */}
      <p className="text-xs text-secondary leading-none">
        {formatBytes(projectUsedBytes)} of {formatBytes(projectLimitBytes)} used
      </p>
    </div>
  )
}
