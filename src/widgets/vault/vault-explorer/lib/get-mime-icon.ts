/**
 * Maps a MIME type to a Lucide icon component and color values.
 * Uses extended palette tokens for semantic color coding.
 *
 * @layer Widgets — vault-explorer
 */
import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Presentation,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MimeIconConfig {
  Icon: LucideIcon
  color: string
  bgColor: string
}

type MimeEntry = MimeIconConfig

const MIME_MAP: Record<string, MimeEntry> = {
  'image/': { Icon: FileImage, color: 'var(--ext-violet-500)', bgColor: 'oklch(0.65 0.18 275 / 10%)' },
  'video/': { Icon: FileVideo, color: 'var(--ext-pink-500)', bgColor: 'oklch(0.67 0.21 340 / 10%)' },
  'audio/': { Icon: FileAudio, color: 'var(--ext-orange-500)', bgColor: 'oklch(0.68 0.20 50 / 10%)' },
  'application/pdf': { Icon: FileText, color: 'var(--ext-red-500)', bgColor: 'oklch(0.63 0.22 20 / 10%)' },
  'application/zip': { Icon: FileArchive, color: 'var(--ext-yellow-500)', bgColor: 'oklch(0.78 0.22 90 / 10%)' },
  'application/x-tar': { Icon: FileArchive, color: 'var(--ext-yellow-500)', bgColor: 'oklch(0.78 0.22 90 / 10%)' },
  'application/gzip': { Icon: FileArchive, color: 'var(--ext-yellow-500)', bgColor: 'oklch(0.78 0.22 90 / 10%)' },
  'application/x-7z-compressed': { Icon: FileArchive, color: 'var(--ext-yellow-500)', bgColor: 'oklch(0.78 0.22 90 / 10%)' },
  'application/x-rar-compressed': { Icon: FileArchive, color: 'var(--ext-yellow-500)', bgColor: 'oklch(0.78 0.22 90 / 10%)' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { Icon: FileSpreadsheet, color: 'var(--ext-green-500)', bgColor: 'oklch(0.65 0.18 155 / 10%)' },
  'application/vnd.ms-excel': { Icon: FileSpreadsheet, color: 'var(--ext-green-500)', bgColor: 'oklch(0.65 0.18 155 / 10%)' },
  'text/csv': { Icon: FileSpreadsheet, color: 'var(--ext-green-500)', bgColor: 'oklch(0.65 0.18 155 / 10%)' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { Icon: Presentation, color: 'var(--ext-orange-600)', bgColor: 'oklch(0.58 0.18 50 / 10%)' },
  'application/vnd.ms-powerpoint': { Icon: Presentation, color: 'var(--ext-orange-600)', bgColor: 'oklch(0.58 0.18 50 / 10%)' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { Icon: FileText, color: 'var(--ext-indigo-500)', bgColor: 'oklch(0.58 0.18 262 / 10%)' },
  'application/msword': { Icon: FileText, color: 'var(--ext-indigo-500)', bgColor: 'oklch(0.58 0.18 262 / 10%)' },
  'text/': { Icon: FileCode, color: 'var(--ext-teal-500)', bgColor: 'oklch(0.65 0.18 195 / 10%)' },
  'application/json': { Icon: FileCode, color: 'var(--ext-teal-500)', bgColor: 'oklch(0.65 0.18 195 / 10%)' },
  'application/xml': { Icon: FileCode, color: 'var(--ext-teal-500)', bgColor: 'oklch(0.65 0.18 195 / 10%)' },
}

const DEFAULT: MimeEntry = { Icon: File, color: 'var(--ext-grey-500)', bgColor: 'var(--bg-layer-2)' }

export function getMimeIcon(mimeType: string): MimeIconConfig {
  const entry = MIME_MAP[mimeType]
  return entry ?? DEFAULT
}