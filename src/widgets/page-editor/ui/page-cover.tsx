import { useEffect, useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Delete, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdatePageDetails } from '@/features/pages/update-page-details'
import { VaultFileSource, markFilesUnreferenced, uploadToVault } from '@/shared/api/vault'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:page-cover')

const COVER_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

interface PageCoverProps {
  coverUrl: string | null
}

/**
 * Extracts the vault fileId from a permanent proxy URL.
 * Proxy format: {SERVER_URL}/vault/file/{fileId}
 */
function extractFileId(url: string | null): string | null {
  if (!url) return null
  const parts = url.split('/vault/file/')
  return parts[1] ?? null
}

/**
 * useCoverBlobUrl — Fetches the cover image via JS fetch() with credentials: 'include'
 * and returns a local blob URL for display.
 *
 * Why not <img src={proxyUrl}> directly:
 *   The vault proxy authenticates via Clerk session cookie. Cross-origin <img> tags
 *   use no-cors mode by default — the browser will NOT send cookies even with
 *   crossOrigin="use-credentials" when the Clerk cookie is SameSite=Lax.
 *
 *   JS fetch() with credentials: 'include' sends the cookie correctly via the
 *   CORS preflight → actual request flow, regardless of SameSite policy.
 *   We convert the response to a blob URL for display.
 *
 * Cleans up the blob URL on coverUrl change or unmount.
 */
function useCoverBlobUrl(coverUrl: string | null): string | null {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!coverUrl) {
      setBlobUrl(null)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false

    fetch(coverUrl, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)
      })
      .catch((err) => {
        if (!cancelled) {
          log.warn('Failed to load cover image', { err, coverUrl })
          setBlobUrl(null)
        }
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [coverUrl])

  return blobUrl
}

/**
 * PageCoverBanner — full-width cover image with upload/change/remove controls.
 *
 * Upload/Replace flow:
 *   1. uploadToVault() — register → S3 PUT → confirm (3-phase pipeline)
 *   2. updatePageDetails(coverImageUrl) — saves permanent proxy URL to DB
 *   3. onSuccess: markFilesUnreferenced(oldFileId) — deferred S3 cleanup (30-min grace)
 *
 * Remove flow:
 *   1. updatePageDetails(null) — clears coverUrl in DB
 *   2. onSuccess: markFilesUnreferenced(oldFileId) — deferred S3 cleanup
 *
 * @layer Widgets
 */
export function PageCoverBanner({ coverUrl }: PageCoverProps) {
  const { pageId } = useParams({ strict: false })
  const project = useAppSelector(selectCurrentProject)
  const { getToken } = useAuth()
  const { mutate: updatePageDetails } = useUpdatePageDetails()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch cover via JS (with credentials) → blob URL for <img>
  const blobUrl = useCoverBlobUrl(coverUrl)

  const handleFileSelect = async (file: File) => {
    if (!pageId || !project?.id) return

    if (!COVER_MIME_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, and GIF images are supported for cover.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image must be smaller than 5 MB.')
      return
    }

    const toastId = `cover-upload-${pageId}`
    // Snapshot the old fileId before upload starts so we can clean it up after success
    const oldFileId = extractFileId(coverUrl)

    toast.loading('Uploading cover…', { id: toastId })

    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const result = await uploadToVault(
        file,
        {
          workspaceId: project.workspaceId,
          projectId: project.id,
          source: VaultFileSource.Page,
          sourceId: pageId,
          name: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        },
        token,
        (percent) => toast.loading(`Uploading cover… ${percent}%`, { id: toastId }),
      )

      updatePageDetails(
        { pageId: pageId, projectId: project.id, coverImageUrl: result.url },
        {
          onSuccess: async () => {
            toast.success('Cover updated', { id: toastId })
            // Deferred cleanup — mark old file unreferenced (30-min grace window on server)
            if (oldFileId) {
              const freshToken = await getToken()
              if (freshToken) {
                markFilesUnreferenced(
                  [oldFileId],
                  pageId,
                  VaultFileSource.Page,
                  freshToken,
                ).catch((err) => log.warn('Failed to mark old cover as unreferenced', { err }))
              }
            }
          },
          onError: () => toast.error('Failed to save cover', { id: toastId }),
        },
      )
    } catch (err) {
      log.error('Cover upload failed', { err, pageId })
      toast.error('Cover upload failed', { id: toastId })
    }
  }

  const handleRemove = async () => {
    if (!pageId || !project?.id) return

    // Snapshot fileId before mutation clears coverUrl from cache
    const oldFileId = extractFileId(coverUrl)
    const toastId = `cover-remove-${pageId}`

    toast.loading('Removing cover…', { id: toastId })

    updatePageDetails(
      { pageId: pageId, projectId: project.id, coverImageUrl: null },
      {
        onSuccess: async () => {
          toast.success('Cover removed', { id: toastId })
          if (oldFileId) {
            const token = await getToken()
            if (token) {
              markFilesUnreferenced(
                [oldFileId],
                pageId,
                VaultFileSource.Page,
                token,
              ).catch((err) => log.warn('Failed to mark old cover as unreferenced', { err }))
            }
          }
        },
        onError: () => toast.error('Failed to remove cover', { id: toastId }),
      },
    )
  }

  if (!coverUrl) {
    return (
      <div className="mx-auto w-full max-w-3xl px-16 pt-16 pb-0 group">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-11 text-secondary hover:bg-layer-2-hover transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            Add cover
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={COVER_MIME_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
            e.target.value = ''
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 overflow-hidden group">
      {blobUrl ? (
        <img
          src={blobUrl}
          alt="Page cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-layer-1 animate-pulse" />
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute bottom-3 right-4 flex gap-2 invisible group-hover:visible transition-opacity">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-11 bg-surface-1/80 backdrop-blur-sm text-primary hover:bg-surface-1 transition-colors"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Change cover
        </button>
        <button
          onClick={handleRemove}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-11 bg-surface-1/80 backdrop-blur-sm text-primary hover:bg-surface-1 transition-colors"
        >
          <Delete className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={COVER_MIME_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
