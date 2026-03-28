/**
 * Reaction Event Handler
 *
 * Handles real-time reaction events from the server and applies them
 * as surgical Dexie patches. useLiveQuery auto-propagates to all
 * components observing the affected message — both the main chat view
 * and any thread panel — without any extra events or state management.
 *
 * Uses the same mergeReactionAdd/Remove logic as the optimistic UI,
 * guaranteeing convergence regardless of which path updates first.
 */
import type { ReactionAddedContract, ReactionRemovedContract } from '@/shared/contracts/chat/downstream'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { registerHandler } from '@/shared/ws/event-bus'
import { db } from '@/shared/lib/db'
import { mergeReactionAdd, mergeReactionRemove } from '@/entities/reaction'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:reaction-handler')

/**
 * Registers WS handlers for chat:reaction-added and chat:reaction-removed.
 *
 * @param getCurrentUserId - Binding to current user ID, used to set hasReacted correctly.
 */
export function registerReactionHandlers(getCurrentUserId: () => string) {
  const unsubAdded = registerHandler<ReactionAddedContract>(
    ChatDownstreamEvent.ReactionAdded,
    async (event) => {
      const { messageId, userId, emoji } =
        event.payload as unknown as {
          messageId: string
          userId: string
          emoji: string
          timestamp: number
        }

      const currentUserId = getCurrentUserId()
      log.debug('chat:reaction-added', { messageId, emoji, userId })

      try {
        const updated = await db.messages
          .where('id')
          .equals(messageId)
          .modify((msg) => {
            msg.reactions = mergeReactionAdd(
              msg.reactions ?? [],
              emoji,
              userId,
              currentUserId,
            )
          })

        if (updated === 0) {
          log.debug('Reaction target not in local cache, skipping.', { messageId })
        }
      } catch (error) {
        log.error('Failed to apply reaction-added to IndexedDB', { error, messageId })
      }
    },
  )

  const unsubRemoved = registerHandler<ReactionRemovedContract>(
    ChatDownstreamEvent.ReactionRemoved,
    async (event) => {
      const { messageId, userId, emoji } =
        event.payload as unknown as {
          messageId: string
          userId: string
          emoji: string
          timestamp: number
        }

      const currentUserId = getCurrentUserId()
      log.debug('chat:reaction-removed', { messageId, emoji, userId })

      try {
        const updated = await db.messages
          .where('id')
          .equals(messageId)
          .modify((msg) => {
            msg.reactions = mergeReactionRemove(
              msg.reactions ?? [],
              emoji,
              userId,
              currentUserId,
            )
          })

        if (updated === 0) {
          log.debug('Reaction removal target not in local cache, skipping.', { messageId })
        }
      } catch (error) {
        log.error('Failed to apply reaction-removed to IndexedDB', { error, messageId })
      }
    },
  )

  return () => {
    unsubAdded()
    unsubRemoved()
  }
}
