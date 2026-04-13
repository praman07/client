import { gql } from '@/gql';
import { conversationKeys } from '@/entities/conversation/api/query-keys';

export { conversationKeys };

export const SET_CONVERSATION_NOTIF_MODE = gql(`
  mutation SetConversationNotifMode($conversationId: String!, $mode: ConversationNotifMode!, $muteUntil: String) {
    setConversationNotifMode(conversationId: $conversationId, mode: $mode, muteUntil: $muteUntil) {
      conversationId
      mode
      muteUntil
      pushEnabled
      emailEnabled
    }
  }
`);
