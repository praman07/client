import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbEntry {
  id: string
  name: string
}

interface VaultBreadcrumbProps {
  trail: Array<BreadcrumbEntry>
  onNavigateTo: (folderId: string | null) => void
}

/**
 * Breadcrumb nav: Home > Ancestor > ... > Current folder.
 * Clicking any crumb calls onNavigateTo which truncates the client trail
 * and updates the URL search param.
 *
 * @layer Widgets — vault-explorer
 */
export function VaultBreadcrumb({ trail, onNavigateTo }: VaultBreadcrumbProps) {
  return (
    <nav
      aria-label="Folder breadcrumb"
      className="flex items-center gap-1 text-sm text-secondary"
    >
      {/* Home */}
      <button
        onClick={() => onNavigateTo(null)}
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        Home
      </button>

      {trail.map((entry) => (
        <span key={entry.id} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <button
            onClick={() => onNavigateTo(entry.id)}
            className="hover:text-primary transition-colors truncate max-w-[120px]"
          >
            {entry.name}
          </button>
        </span>
      ))}
    </nav>
  )
}
