import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationKeys } from '../api';
import type { ConversationNotifPreference } from '../model';

/**
 * Reads the cached conversation notification preference.
 *
 * There is no GET query for this in the GraphQL schema.
 * The cache is populated by useSetConversationNotifMode's onSuccess handler
 * via queryClient.setQueryData — making this hook reactive without a network call.
 *
 * Returns null until the user has changed the notification mode for this conversation.
 */
export function useConversationNotificationPreference(conversationId: string) {
  const queryClient = useQueryClient();

  return useQuery<ConversationNotifPreference | null>({
    queryKey: conversationKeys.notifPreference(conversationId),
    // Never fetches from the network — data is written by setConversationNotifMode mutation
    queryFn: () =>
      queryClient.getQueryData<ConversationNotifPreference>(
        conversationKeys.notifPreference(conversationId)
      ) ?? null,
    enabled: false,
    staleTime: Infinity,
  });
}
