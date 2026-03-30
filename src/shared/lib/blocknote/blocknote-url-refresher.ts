/**
 * blocknote-url-refresher.ts
 *
 * On editor mount AND after each upload: scans every block for `vault://<fileId>`
 * URL references, batch-fetches live presigned GET URLs in a single round-trip,
 * and patches the editor blocks in-place.
 *
 * Why this is needed:
 *   `blocknote-upload-adapter` stores `vault://<fileId>` instead of a raw
 *   presigned URL to avoid link rot (presigned URLs expire in 1 hour, but the
 *   YJS document lives forever). This function is the complementary read path:
 *   it resolves opaque `vault://` references back to real, displayable URLs.
 *
 * ⚠️  IMPORTANT — blockFileMap design:
 *   `refreshVaultUrls` calls `editor.updateBlock()` which mutates the YJS
 *   document, replacing `vault://fileId` with a live presigned URL. After this
 *   mutation, scanning the doc for `vault://` prefixes will find NOTHING — the
 *   original tracking scheme breaks.
 *
 *   To work around this, pass an optional `blockFileMap` (Map<blockId, fileId>).
 *   `refreshVaultUrls` populates this map for every `vault://` ref it resolves.
 *   The editors then use `extractTrackedFileIds` instead of `extractVaultFileIds`
 *   to compute which vault files are still present in the document — based on
 *   stable blockId presence, not URL scheme.
 *
 * @layer Shared → lib/blocknote
 */

import type { Block, BlockNoteEditor } from '@blocknote/core'
import { batchGetDownloadUrls } from '@/shared/api/vault'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('shared:blocknote:url-refresher')

// ── Types ────────────────────────────────────────────────────────────────────

const VAULT_SCHEME = 'vault://'

interface VaultRef {
  blockId: string
  fileId: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Recursively walks the editor's block tree and collects every block that has
 * a `url` prop starting with `vault://`. Handles nested blocks via `children`.
 */
function collectVaultRefs(blocks: Array<Block<any, any, any>>): Array<VaultRef> {
  const refs: Array<VaultRef> = []

  for (const block of blocks) {
    const url = (block.props as Record<string, unknown>)['url']

    if (typeof url === 'string' && url.startsWith(VAULT_SCHEME)) {
      const fileId = url.slice(VAULT_SCHEME.length)
      if (fileId.length > 0) refs.push({ blockId: block.id, fileId })
    }

    if (Array.isArray(block.children) && block.children.length > 0) {
      refs.push(...collectVaultRefs(block.children))
    }
  }

  return refs
}

/**
 * Recursively collects every blockId present in the document.
 * Used by extractTrackedFileIds to determine which blocks still exist.
 */
function collectAllBlockIds(blocks: Array<Block<any, any, any>>): Set<string> {
  const ids = new Set<string>()
  for (const block of blocks) {
    ids.add(block.id)
    if (Array.isArray(block.children) && block.children.length > 0) {
      for (const id of collectAllBlockIds(block.children)) ids.add(id)
    }
  }
  return ids
}

// ── Public helpers ────────────────────────────────────────────────────────────

/**
 * Returns the set of vault fileIds currently present in a BlockNote document
 * by scanning for `vault://fileId` URL prefixes.
 *
 * ⚠️  Only works BEFORE `refreshVaultUrls` has replaced vault:// refs with
 * presigned URLs. For tracking after resolution, use `extractTrackedFileIds`.
 */
export function extractVaultFileIds(
  blocks: Array<Block<any, any, any>>,
): Set<string> {
  return new Set(collectVaultRefs(blocks).map((r) => r.fileId))
}

/**
 * Returns the set of vault fileIds that are still present in the document,
 * using `blockFileMap` (Map<blockId, fileId>) as the lookup.
 *
 * This works even after `refreshVaultUrls` has replaced `vault://fileId`
 * with presigned URLs in the YJS document — it checks blockId presence,
 * not URL scheme.
 *
 * Usage:
 * ```ts
 * const blockFileMap = useRef(new Map<string, string>())
 *
 * // After refreshVaultUrls populates the map:
 * const currentIds = extractTrackedFileIds(editor.document, blockFileMap.current)
 * const removed = [...savedFileIdsRef.current].filter(id => !currentIds.has(id))
 * ```
 */
export function extractTrackedFileIds(
  blocks: Array<Block<any, any, any>>,
  blockFileMap: Map<string, string>,   // Map<blockId, fileId>
): Set<string> {
  if (blockFileMap.size === 0) return new Set()
  const liveBlockIds = collectAllBlockIds(blocks)
  const presentFileIds = new Set<string>()
  for (const [blockId, fileId] of blockFileMap) {
    if (liveBlockIds.has(blockId)) presentFileIds.add(fileId)
  }
  return presentFileIds
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Resolves all `vault://fileId` URLs in the editor document to live presigned
 * GET URLs. Patches each block in-place via `editor.updateBlock`.
 *
 * When `blockFileMap` is provided, populates it with blockId → fileId entries
 * for every vault:// ref that was resolved. This map survives the URL
 * replacement and can be passed to `extractTrackedFileIds` for deletion diff.
 *
 * Idempotent — blocks with non-vault URLs are skipped.
 * No-ops immediately if the document has no vault:// references.
 */
export async function refreshVaultUrls(
  editor: BlockNoteEditor<any, any, any>,
  getToken: () => Promise<string | null>,
  blockFileMap?: Map<string, string>,   // Map<blockId, fileId> — populated in-place
): Promise<void> {
  const refs = collectVaultRefs(editor.document)
  if (refs.length === 0) return

  const fileIds = refs.map((r) => r.fileId)
  log.debug('[REFRESH_START]', { refCount: refs.length, fileIds })

  const token = await getToken()
  if (!token) {
    log.warn('[REFRESH_SKIPPED] not authenticated')
    return
  }

  const urlResults = await batchGetDownloadUrls(fileIds, token)

  // Build maps keyed by fileId for O(1) lookup
  const urlMap = new Map<string, string | null>()
  const statusMap = new Map<string, string>()
  for (const result of urlResults) {
    urlMap.set(result.fileId, result.url ?? null)
    statusMap.set(result.fileId, result.status ?? 'UNKNOWN')
  }

  let resolved = 0
  let tombstoned = 0

  for (const ref of refs) {
    const resolvedUrl = urlMap.get(ref.fileId)
    const status = statusMap.get(ref.fileId) ?? 'UNKNOWN'

    // Record blockId → fileId BEFORE replacing the vault:// URL.
    // This entry survives the editor.updateBlock call and lets
    // extractTrackedFileIds find the fileId by blockId presence.
    if (blockFileMap) {
      blockFileMap.set(ref.blockId, ref.fileId)
    }

    if (resolvedUrl) {
      editor.updateBlock(ref.blockId, { props: { url: resolvedUrl } })
      resolved++
      log.debug('[MEDIA_RENDERED]', {
        fileId: ref.fileId,
        blockId: ref.blockId,
        status,
        outcome: 'resolved',
      })
    } else {
      editor.updateBlock(ref.blockId, { props: { url: '' } })
      tombstoned++
      log.debug('[MEDIA_RENDERED]', {
        fileId: ref.fileId,
        blockId: ref.blockId,
        status,
        outcome: 'tombstoned',
      })
    }
  }

  log.debug('[REFRESH_DONE]', { resolved, tombstoned })
}
