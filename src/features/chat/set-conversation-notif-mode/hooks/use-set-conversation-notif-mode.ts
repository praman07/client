import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SET_CONVERSATION_NOTIF_MODE, conversationKeys } from '../api';
import type { ConversationNotifMode } from '@/gql/graphql';
import { useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

export function useSetConversationNotifMode() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      conversationId: string;
      mode: ConversationNotifMode;
      muteUntil?: string | null;
    }) => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(SET_CONVERSATION_NOTIF_MODE, params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.notifPreference(variables.conversationId),
      });
    },
  });
}
