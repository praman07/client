/**
 * Preset options for the status icon/color picker.
 * Icon keys must match ICON_MAP in entities/issue-status/ui/status-icon.tsx.
 *
 * @layer Features
 */

export interface IconOption {
  key: string
  label: string
}

/** All 6 supported icon keys. */
export const ICON_OPTIONS: IconOption[] = [
  { key: 'circle-dashed', label: 'Backlog' },
  { key: 'circle', label: 'Todo' },
  { key: 'circle-half', label: 'In Progress' },
  { key: 'circle-dot', label: 'In Review' },
  { key: 'check-circle', label: 'Done' },
  { key: 'x-circle', label: 'Cancelled' },
]

/** 12-color Kanban palette (hex). */
export const COLOR_PRESETS: string[] = [
  '#6B7280',
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#14B8A6',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F43F5E',
  '#64748B',
  '#0EA5E9',
]
