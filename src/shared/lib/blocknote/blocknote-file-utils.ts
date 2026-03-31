/**
 * blocknote-file-utils.ts
 *
 * System Design Decision: Direct Proxy URL Persistence
 *   Asset URLs are stored structurally as permanent proxy endpoints (`{SERVER_URL}/vault/file/{fileId}`)
 *   in the Yjs CRDT. This eliminates the legacy `vault://` string substitution lifecycle, 
 *   ensuring instant hydration across all clients without a secondary S3 URL resolution pass.
 *
 * @layer Shared
 */

import type { Block, BlockNoteEditor } from '@blocknote/core'
import { getVaultFileUrl } from '@/shared/api/vault'
import { env } from '@/shared/config/env'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('shared:blocknote:file-utils')

// ── Helpers ───────────────────────────────────────────────────────────────────

const PROXY_PATH = '/vault/file/'

/**
 * Extracts the vault fileId from a permanent proxy URL.
 * Returns null if the URL does not match the proxy pattern.
 */
function extractFileIdFromProxyUrl(url: string): string | null {
  const serverBase = env.VITE_SERVER_URL ?? ''
  // Match absolute: http://localhost:3001/vault/file/<fileId>
  if (serverBase && url.startsWith(serverBase + PROXY_PATH)) {
    const fileId = url.slice((serverBase + PROXY_PATH).length)
    return fileId.length > 0 ? fileId : null
  }
  // Match relative: /vault/file/<fileId>  (production / reverse-proxy setups)
  if (url.startsWith(PROXY_PATH)) {
    const fileId = url.slice(PROXY_PATH.length)
    return fileId.length > 0 ? fileId : null
  }
  return null
}

/**
 * Recursively collects all blocks with a `url` prop from the block tree.
 */
function collectUrlBlocks(
  blocks: Array<Block<any, any, any>>,
): Array<{ blockId: string; url: string }> {
  const result: Array<{ blockId: string; url: string }> = []
  for (const block of blocks) {
    const url = (block.props as Record<string, unknown>)['url']
    if (typeof url === 'string' && url.length > 0) {
      result.push({ blockId: block.id, url })
    }
    if (Array.isArray(block.children) && block.children.length > 0) {
      result.push(...collectUrlBlocks(block.children))
    }
  }
  return result
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * System Design Decision: Document Snapshot Generation
 * Traverses the parsed block tree to generate an active snapshot of file IDs. 
 * This O(N) traversal acts as the deterministic source of truth for the garbage collector's `markFilesUnreferenced` diffing.
 */
export function extractActiveFileIds(
  blocks: Array<Block<any, any, any>>,
): Set<string> {
  const ids = new Set<string>()
  for (const { url } of collectUrlBlocks(blocks)) {
    const fileId = extractFileIdFromProxyUrl(url)
    if (fileId) ids.add(fileId)
  }
  return ids
}

/**
 * System Design Decision: Synchronous Legacy Migration
 * Imperatively mutates the BlockNote editor instance on mount to eradicate obsolete URL schemas.
 * Because CRDT patches trigger a full broadcast, this safely retrofits historic documents globally during read.
 * // TODO (Architecture): Re-evaluate performance penalty on massive legacy documents; consider migrating this to a background DB job.
 */
export function migrateDocumentUrls(
  editor: BlockNoteEditor<any, any, any>,
): void {
  const urlBlocks = collectUrlBlocks(editor.document)
  if (urlBlocks.length === 0) return

  let migrated = 0

  for (const { blockId, url } of urlBlocks) {
    let fileId: string | null = null

    // Pattern 1: vault://cuid
    if (url.startsWith('vault://')) {
      fileId = url.slice('vault://'.length) || null
    }

    // Pattern 2: presigned amazonaws URL containing /vault/.../cuid/filename
    // e.g. https://bucket.s3.amazonaws.com/vault/ws1/proj1/page/src1/cuid/filename?...
    if (!fileId && url.includes('amazonaws.com')) {
      const vaultIdx = url.indexOf('/vault/')
      if (vaultIdx !== -1) {
        const pathAfterVault = url.slice(vaultIdx + '/vault/'.length)
        // Structure: workspaceId/projectId/source/sourceId/cuid/filename
        const segments = pathAfterVault.split('/')
        if (segments.length >= 5) {
          const candidateId = segments[4] // 0-indexed: ws/proj/source/srcId/fileId
          // cuid pattern: starts with 'c' or 'C', 8+ chars, alphanumeric
          if (/^[cC][a-z0-9A-Z]{8,}$/.test(candidateId)) {
            fileId = candidateId
          }
        }
      }
    }

    // Pattern 3: already a proxy URL — skip
    if (!fileId) continue

    const permanentUrl = getVaultFileUrl(fileId)
    editor.updateBlock(blockId, { props: { url: permanentUrl } })
    migrated++
  }

  if (migrated > 0) {
    log.info('[DOC_MIGRATED]', {
      migrated,
      total: urlBlocks.length,
      note: 'Legacy vault:// or amazonaws URLs replaced with permanent proxy URLs',
    })
  }
}
