import { z } from 'zod';

export const setGlobalModeSchema = z.object({
  mode: z.enum(['ALL', 'MENTIONS_ONLY', 'NOTHING']),
});

export type SetGlobalModeInput = z.infer<typeof setGlobalModeSchema>;

export const pauseNotificationsSchema = z.object({
  until: z.string().datetime(),
});

export type PauseNotificationsInput = z.infer<typeof pauseNotificationsSchema>;

export const setEmailNotificationsSchema = z.object({
  enabled: z.boolean(),
});

export type SetEmailNotificationsInput = z.infer<typeof setEmailNotificationsSchema>;

export const setPushNotificationsSchema = z.object({
  enabled: z.boolean(),
});

export type SetPushNotificationsInput = z.infer<typeof setPushNotificationsSchema>;