import type { Conversation } from '@/entities/conversation'

/**
 * Extract channel names from conversation list for duplicate validation
 */
export function extractChannelNames(
  conversations: Conversation[] | undefined,
): string[] {
  if (!conversations) return []

  return conversations
    .filter((conv) => conv.type === 'CHANNEL')
    .map((conv) => conv.name || '')
    .filter(Boolean)
}
