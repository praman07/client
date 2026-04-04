import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface PaginationControlsProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

/**
 * PaginationControls
 * 
 * Provides a UI for navigating pages and changing page size.
 * Uses a sliding window of page numbers centered on the current page.
 */
export function PaginationControls({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  const startItem = Math.min((page - 1) * pageSize + 1, totalCount)
  const endItem = Math.min(page * pageSize, totalCount)

  // Compute page numbers to show — max 5 visible, sliding window centered on current page
  const pageNumbers = (() => {
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(1, page - 2)
    let end = start + maxVisible - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 px-1">
      {/* Left: count info */}
      <p className="text-xs text-muted-foreground font-medium">
        Showing <span className="text-foreground">{startItem}</span> to{' '}
        <span className="text-foreground">{endItem}</span> of{' '}
        <span className="text-foreground">{totalCount}</span> members
      </p>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        {/* Page size selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/40 rounded-md px-2.5 py-1 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary/30">
            {pageSize} / page <ChevronDown className="h-3 w-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 p-1">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => onPageSizeChange(size)}
                className={cn(
                  'text-xs flex items-center justify-between',
                  size === pageSize && 'bg-muted text-foreground font-semibold',
                )}
              >
                {size} per page
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/40"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          
          {/* Prev */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/40"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Page number buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((p) => (
              <Button
                key={p}
                variant={p === page ? 'secondary' : 'ghost'}
                size="icon"
                className={cn('h-8 w-8 text-xs font-medium', p === page && 'border border-border/60')}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            ))}
          </div>

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/40"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          
          {/* Last */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/40"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
