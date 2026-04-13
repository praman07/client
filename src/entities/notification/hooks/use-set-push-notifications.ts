import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UPDATE_GLOBAL_NOTIF_PREFS, notificationKeys } from '../api';
import { useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

/**
 * Toggles push notifications.
 * Uses updateGlobalNotifPrefs — the only mutation for changing channel preferences.
 * Passes { pushEnabled: true/false }; other fields are omitted so they are not overwritten.
 */
export function useSetPushNotifications(options?: Parameters<typeof useMutation>[0]) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(UPDATE_GLOBAL_NOTIF_PREFS, { input: { pushEnabled: enabled } });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },

    ...options,
  });
}
