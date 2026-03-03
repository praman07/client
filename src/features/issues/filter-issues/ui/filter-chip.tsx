/**
 * FilterChip — One active-filter pill in the BoardToolbar.
 *
 * Uses Badge (outline variant) from primitives.
 * Click × → removeOneFilter(category)
 *
 * @layer Features
 */
import { X } from 'lucide-react'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import type { FilterChip as FilterChipType } from '../model/types'

interface FilterChipProps {
  chip: FilterChipType
  onRemove: (category: FilterChipType['category']) => void
}

export function FilterChip({ chip, onRemove }: FilterChipProps) {
  return (
    <Badge
      variant="outline"
      className="h-7 gap-1 rounded-md px-2 text-xs font-normal text-foreground"
    >
      <span className="max-w-[200px] truncate">{chip.label}</span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-0.5 h-4 w-4 rounded-sm p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
        onClick={() => onRemove(chip.category)}
        aria-label={`Remove ${chip.label} filter`}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  )
}
