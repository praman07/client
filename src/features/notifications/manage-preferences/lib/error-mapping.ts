export const ERROR_MESSAGES = {
  SET_MODE_FAILED: 'Failed to update notification mode. Please try again.',
  PAUSE_FAILED: 'Failed to pause notifications. Please try again.',
  RESUME_FAILED: 'Failed to resume notifications. Please try again.',
  UPDATE_PREFS_FAILED: 'Failed to update preferences. Please try again.',
} as const;

export type ErrorKey = keyof typeof ERROR_MESSAGES;

export function getErrorMessage(key: ErrorKey): string {
  return ERROR_MESSAGES[key];
}
