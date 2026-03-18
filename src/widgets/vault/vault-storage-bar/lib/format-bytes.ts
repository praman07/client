/**
 * Formats a byte count to human-readable string.
 * Examples: 1023 → "1023 B", 1024 → "1.0 KB"
 *
 * @layer Widgets — vault-storage-bar
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}
