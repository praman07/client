/**
 * Maps a MIME type to a Lucide icon component and a Tailwind color class.
 * Used by VaultFileCard to render MIME-aware icons with semantic colors.
 *
 * @layer Widgets — vault-explorer
 */
import {
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  Presentation,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MimeIconConfig {
  Icon: LucideIcon
  color: string // Tailwind text color class
  bgColor: string // Tailwind bg tint class for the preview area
}

export function getMimeIcon(mimeType: string): MimeIconConfig {
  if (mimeType.startsWith('image/')) {
    return {
      Icon: FileImage,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    }
  }
  if (mimeType.startsWith('video/')) {
    return {
      Icon: FileVideo,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    }
  }
  if (mimeType.startsWith('audio/')) {
    return {
      Icon: FileAudio,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    }
  }
  if (mimeType === 'application/pdf') {
    return { Icon: FileText, color: 'text-red-500', bgColor: 'bg-red-500/10' }
  }
  if (
    mimeType === 'application/zip' ||
    mimeType === 'application/x-tar' ||
    mimeType === 'application/gzip' ||
    mimeType === 'application/x-7z-compressed' ||
    mimeType === 'application/x-rar-compressed'
  ) {
    return {
      Icon: FileArchive,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    }
  }
  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'text/csv'
  ) {
    return {
      Icon: FileSpreadsheet,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    }
  }
  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'application/vnd.ms-powerpoint'
  ) {
    return {
      Icon: Presentation,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    }
  }
  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return { Icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10' }
  }
  if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/xml'
  ) {
    return {
      Icon: FileCode,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    }
  }
  // Default
  return { Icon: File, color: 'text-blue-400', bgColor: 'bg-blue-500/10' }
}
