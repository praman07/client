import type { ConversationNotifMode } from '@/gql/graphql';

export type MuteDuration =
  | '1h'
  | '4h'
  | '8h'
  | '24h'
  | 'indefinite'
  | null;

export interface ChannelNotificationSettingsState {
  mode: ConversationNotifMode;
  muteUntil: string | null;
}
