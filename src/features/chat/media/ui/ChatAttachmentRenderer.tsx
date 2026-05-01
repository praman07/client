/**
 * ChatAttachmentRenderer.tsx
 * Renders a single attachment INSIDE a delivered chat message.
 *
 * Distinct from ChatAttachmentPreview (pre-send staging strip).
 * Handles:
 *   - URL refresh: fetches fresh presigned GET URL via useDownloadUrl()
 *   - Deleted/forbidden: renders tombstone
 *   - Images: cache-first inline render (IndexDB blob hit → instant display)
 *   - Videos: cache-first download-to-view (no streaming)
 *   - Audio/file: card with download button
 *   - Failure visibility: EVERY failure state renders a visible block — media never disappears
 *
 * @layer Features → chat/media/ui
 */

import { useCallback, useEffect, useState } from 'react'
import {
  AlertCircle,
  Archive,
  Download,
  FileCode,
  FileText,
  Film,
  ImageIcon,
  Loader2,
  Music,
  Play,
  RefreshCw,
} from 'lucide-react'
import type { ChatAttachment } from '@/shared/contracts/chat/message'
import { cn } from '@/shared/lib/utils'
import { formatBytes } from '@/shared/lib/upload-limits'
import { useDownloadUrl, useMediaCache } from '@/features/chat/media'

// ── Props ─────────────────────────────────────────────────────────────────────

interface ChatAttachmentRendererProps {
  attachment: ChatAttachment
  className?: string
}

// ── File type icon helper ─────────────────────────────────────────────────────

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith('video/')) return <Film className={cn('text-accent-primary', className)} />
  if (mimeType.startsWith('audio/')) return <Music className={cn('text-accent-secondary', className)} />
  if (mimeType === 'application/pdf') return <FileText className={cn('text-danger-primary', className)} />
  if (mimeType.startsWith('text/') || mimeType === 'application/json')
    return <FileCode className={cn('text-success-primary', className)} />
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('gzip'))
    return <Archive className={cn('text-warning-primary', className)} />
  return <FileText className={cn('text-secondary', className)} />
}

// ── Image renderer — cache-first, dimension-locked to prevent layout shift ─────
//
// Anti-CLS design: the outer container reserves a stable 4:3 aspect-ratio box
// before the image loads. The virtualizer measures this fixed height at t=0 and
// never needs to remeasure, eliminating jank from async image resolution.

function ImageAttachment({
  fileId,
  url,
  name,
  mimeType,
  sizeBytes,
  className,
}: {
  fileId: string
  url: string
  name: string
  mimeType: string
  sizeBytes: number
  className?: string
}) {
  const { getCached, cacheBlob } = useMediaCache()
  const [blobUrl, setBlobUrl] = useState<string>()
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Cache-first: try IndexDB first, fall back to presigned URL
  useEffect(() => {
    let objectUrl: string | undefined

    ;(async () => {
      const cached = await getCached(fileId)
      if (cached) {
        objectUrl = URL.createObjectURL(cached)
        setBlobUrl(objectUrl)
      }
      // No network fetch here — <img> handles the network load.
      // Cache is populated in handleLoad via canvas (no double-fetch).
    })()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId])

  // Canvas-based caching: extract the already-decoded image as a Blob.
  // Eliminates the double-fetch pattern (previously called fetch(url) again).
  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true)
      if (blobUrl) return // already in IndexDB cache
      const img = e.currentTarget
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => { if (blob) void cacheBlob(fileId, blob, mimeType) },
          mimeType,
          0.92,
        )
      } catch {
        // Non-fatal — image visible, cache just won't be populated this load
      }
    },
    [blobUrl, fileId, mimeType, cacheBlob],
  )

  const displayUrl = blobUrl ?? url

  // Failure state — always render a visible block, never collapse to 0px
  if (loadError) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-3 rounded-lg border border-subtle bg-layer-1',
          'max-w-[320px] min-h-[56px]',
          className,
        )}
      >
        <AlertCircle className="size-4 shrink-0 text-secondary" />
        <div className="flex flex-col min-w-0">
          <span className="text-11 font-medium text-primary truncate">{name}</span>
          <span className="text-11 text-secondary">
            Image failed to load · {formatBytes(sizeBytes)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/*
        Dimension-locked container — height is reserved BEFORE the image loads.
        The virtualizer (measureElement) measures this outer div at t=0 and never
        needs to remeasure, so no layout shift occurs when the blob resolves.
        max-w-[320px] + aspect-[4/3] → stable 320×240 reserved block.
      */}
      <div
        className={cn(
          'relative max-w-[320px] rounded-lg border border-subtle bg-layer-1 overflow-hidden cursor-zoom-in shadow-raised-100 hover:brightness-95 transition-all duration-150',
          className,
        )}
        style={{ aspectRatio: '4 / 3' }}
        onClick={() => setExpanded(true)}
        role="button"
        aria-label={`View image: ${name}`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(true) }}
      >
        {/* Skeleton placeholder — visible until image is decoded */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="size-8 text-tertiary" />
          </div>
        )}
        <img
          src={displayUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain"
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={() => setLoadError(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 200ms ease' }}
        />
      </div>
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-backdrop backdrop-blur-sm p-4"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-label={`Full size: ${name}`}
          aria-modal="true"
        >
          <img
            src={displayUrl}
            alt={name}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
          />
          <button
            className="absolute top-4 right-4 text-on-color/70 hover:text-on-color transition-colors"
            onClick={(e) => { e.stopPropagation(); setExpanded(false) }}
            aria-label="Close image"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}

// ── Video renderer — cache-first, download-to-view (no streaming) ─────────────

type VideoState = 'checking' | 'cached' | 'uncached' | 'downloading' | 'error'

function VideoAttachment({
  fileId,
  url,
  name,
  mimeType,
  sizeBytes,
  className,
}: {
  fileId: string
  url: string
  name: string
  mimeType: string
  sizeBytes: number
  className?: string
}) {
  const { getCached, cacheBlob } = useMediaCache()
  const [state, setState] = useState<VideoState>('checking')
  const [blobUrl, setBlobUrl] = useState<string>()
  const [downloadProgress, setDownloadProgress] = useState(0)

  // On mount: check cache
  useEffect(() => {
    let objectUrl: string | undefined

    ;(async () => {
      const cached = await getCached(fileId)
      if (cached) {
        objectUrl = URL.createObjectURL(cached)
        setBlobUrl(objectUrl)
        setState('cached')
      } else {
        setState('uncached')
      }
    })()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId])

  const handleDownload = useCallback(async () => {
    if (!url) return
    setState('downloading')
    setDownloadProgress(0)

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // Stream the response to track progress
      const contentLength = res.headers.get('Content-Length')
      const total = contentLength ? parseInt(contentLength) : sizeBytes
      const chunks: Array<BlobPart> = []
      let loaded = 0
      const reader = res.body?.getReader()

      if (!reader) throw new Error('No response body')

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        loaded += value.length
        setDownloadProgress(Math.round((loaded / total) * 100))
      }

      const blob = new Blob(chunks, { type: mimeType })
      await cacheBlob(fileId, blob, mimeType)

      const objectUrl = URL.createObjectURL(blob)
      setBlobUrl(objectUrl)
      setState('cached')
    } catch {
      setState('error')
    }
  }, [fileId, url, mimeType, sizeBytes, cacheBlob])

  // Render all states inside a stable outer container so the virtualizer never
  // re-measures due to height changes between checking/uncached/downloading/cached.
  // The outer div always has min-h-[56px], preventing the CLS-causing collapse.
  const innerContent = (() => {
    // Checking IndexDB
    if (state === 'checking') {
      return (
        <div className="flex items-center gap-2 text-secondary text-11 p-3">
          <Loader2 className="size-3.5 animate-spin shrink-0" />
          <span>Loading video…</span>
        </div>
      )
    }

    // Cached — play from IndexDB blob URL
    if (state === 'cached' && blobUrl) {
      return (
        <>
          <video
            src={blobUrl}
            controls
            className="w-full rounded-lg"
            preload="none"
            title={name}
          />
          <p className="text-11 text-secondary mt-0.5 px-1 truncate">
            {name} · {formatBytes(sizeBytes)}
          </p>
        </>
      )
    }

    // Downloading — show progress
    if (state === 'downloading') {
      return (
        <div className="flex items-center gap-3 p-3">
          <Film className="size-5 shrink-0 text-accent-primary" />
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <span className="text-13 font-medium text-primary truncate">{name}</span>
            <div className="w-full bg-layer-2 rounded-full h-1">
              <div
                className="bg-accent-primary h-1 rounded-full transition-all"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <span className="text-11 text-secondary">{downloadProgress}%</span>
          </div>
        </div>
      )
    }

    // Error state
    if (state === 'error') {
      return (
        <div className="flex items-center gap-3 p-3">
          <AlertCircle className="size-5 shrink-0 text-danger-primary" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-13 font-medium text-primary truncate">{name}</span>
            <span className="text-11 text-secondary">{formatBytes(sizeBytes)}</span>
          </div>
          <button
            onClick={handleDownload}
            className="shrink-0 p-1.5 rounded hover:bg-layer-2 text-secondary hover:text-primary transition-colors"
            title="Retry download"
            aria-label="Retry download"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      )
    }

    // Default: uncached — show "Download to view" card
    return (
      <div className="flex items-center gap-3 p-3">
        <Film className="size-5 shrink-0 text-accent-primary" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-13 font-medium text-primary truncate">{name}</span>
          <span className="text-11 text-secondary">{formatBytes(sizeBytes)} · Video</span>
        </div>
        <button
          onClick={handleDownload}
          className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded text-11 font-medium bg-accent-subtle hover:bg-accent-subtle-hover text-primary transition-colors"
          title="Download to view"
          aria-label="Download video to play"
        >
          <Play className="size-3" />
          View
        </button>
      </div>
    )
  })()

  return (
    <div
      className={cn(
        // Stable container: all states render inside this same box.
        // min-h-[56px] ensures the virtualizer always measures at least this height.
        // max-w-[320px] matches file card width; cached state expands to max-w-[480px] via child.
        'rounded-lg border border-subtle bg-layer-1 overflow-hidden',
        state === 'cached' ? 'max-w-[480px]' : 'max-w-[320px] min-h-[56px]',
        className,
      )}
    >
      {innerContent}
    </div>
  )
}
// ── Generic file card (PDFs, archives, docs, code) ────────────────────────────

function FileCard({
  url,
  name,
  mimeType,
  sizeBytes,
}: {
  url: string | null
  name: string
  mimeType: string
  sizeBytes: number
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-subtle bg-layer-1 max-w-[320px] group/fc hover:bg-layer-2 transition-colors">
      <FileTypeIcon mimeType={mimeType} className="size-5 shrink-0" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-13 font-medium text-primary truncate">{name}</span>
        <span className="text-11 text-secondary">{formatBytes(sizeBytes)}</span>
      </div>
      {url && (
        <a
          href={url}
          download={name}
          className="shrink-0 p-1.5 rounded hover:bg-layer-2 text-secondary hover:text-primary transition-colors"
          title={`Download ${name}`}
          aria-label={`Download ${name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="size-3.5" />
        </a>
      )}
    </div>
  )
}

// ── Tombstone (deleted / forbidden) ──────────────────────────────────────────

function AttachmentTombstone({ reason }: { reason: 'deleted' | 'forbidden' | 'error' }) {
  const messages = {
    deleted: 'This attachment is no longer available.',
    forbidden: 'You do not have access to this attachment.',
    error: 'Could not load attachment.',
  }
  return (
    <div className="flex items-center gap-2 text-11 text-secondary italic py-1 border-l-2 border-subtle pl-2">
      <AlertCircle className="size-3.5 shrink-0 text-tertiary" />
      <span>{messages[reason]}</span>
    </div>
  )
}

// ── Audio renderer ────────────────────────────────────────────────────────────

function AudioAttachment({ url, name, sizeBytes, className }: {
  url: string; name: string; sizeBytes: number; className?: string
}) {
  return (
    <div className={cn('max-w-[320px] rounded-lg border border-subtle bg-layer-1 px-3 pt-2 pb-1.5', className)}>
      <audio src={url} controls className="w-full h-9" preload="metadata" />
      <p className="text-11 text-secondary mt-1 truncate">
        {name} · {formatBytes(sizeBytes)}
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ChatAttachmentRenderer({
  attachment,
  className,
}: ChatAttachmentRendererProps) {
  // Always call the hook — React Query deduplicates and uses initialData
  // when attachment.url is still fresh (new messages from WS).
  const { url, status } = useDownloadUrl(attachment.fileId, attachment.url)

  // Loading — show a minimal spinner only if no initial URL available
  if (status === 'loading') {
    return (
      <div className={cn('flex items-center gap-2 text-secondary text-11 py-1', className)}>
        <Loader2 className="size-3.5 animate-spin" />
        <span>Loading attachment…</span>
      </div>
    )
  }

  // Deleted or forbidden — render tombstone (always visible, never disappears)
  if (status === 'deleted' || status === 'forbidden') {
    return <AttachmentTombstone reason={status} />
  }

  // Error — tombstone (also always visible)
  if (status === 'error' || !url) {
    return <AttachmentTombstone reason="error" />
  }

  const { fileId, name, mimeType, sizeBytes } = attachment

  // ── Render by MIME type ────────────────────────────────────────────────────

  // Images: cache-first inline render with lightbox + error fallback
  if (mimeType.startsWith('image/')) {
    return (
      <div className={className}>
        <ImageAttachment
          fileId={fileId}
          url={url}
          name={name}
          mimeType={mimeType}
          sizeBytes={sizeBytes}
        />
      </div>
    )
  }

  // Videos: cache-first download-to-view (no streaming)
  // User must click "View" to download + cache before playback.
  if (mimeType.startsWith('video/')) {
    return (
      <VideoAttachment
        fileId={fileId}
        url={url}
        name={name}
        mimeType={mimeType}
        sizeBytes={sizeBytes}
        className={className}
      />
    )
  }

  // Audio: native player (streaming is fine for audio — small files, no seeking cost)
  if (mimeType.startsWith('audio/')) {
    return <AudioAttachment url={url} name={name} sizeBytes={sizeBytes} className={className} />
  }

  // Everything else: file card with download button
  return (
    <div className={className}>
      <FileCard url={url} name={name} mimeType={mimeType} sizeBytes={sizeBytes} />
    </div>
  )
}
