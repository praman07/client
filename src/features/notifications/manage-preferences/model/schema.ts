import { z } from 'zod';
import { GlobalNotifMode } from '@/gql/graphql';

export const SetGlobalModeSchema = z.object({
  mode: z.nativeEnum(GlobalNotifMode),
});

export const PauseNotificationsSchema = z.object({
  until: z.string().datetime(),
});

export type SetGlobalModeInput = z.infer<typeof SetGlobalModeSchema>;
export type PauseNotificationsInput = z.infer<typeof PauseNotificationsSchema>;
export type UpdateGlobalNotifPrefsInput = {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  globalMode?: GlobalNotifMode;
  muteUntil?: string | null;
  categories?: Array<{
    category: string;
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
  }>;
};
