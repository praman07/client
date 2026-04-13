import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UPDATE_GLOBAL_NOTIF_PREFS, notificationKeys } from '../api';
import { useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';
import type { UpdateGlobalNotifPrefsInput } from '@/gql/graphql';

/**
 * Unified hook for updating global notification preferences.
 *
 * Covers email, push, globalMode, and category toggles in a single mutation.
 * Callers pass ONLY the fields they want to change — others are left untouched:
 *
 *   mutate({ emailEnabled: false })   ← toggle email only
 *   mutate({ pushEnabled: true })     ← toggle push only
 *   mutate({ emailEnabled: false, pushEnabled: false }) ← both
 *
 * Uses updateGlobalNotifPrefs — the only backend mutation for channel preferences.
 * (No separate setEmailNotifications / setPushNotifications exist in the schema.)
 */
export function useUpdateGlobalNotifPrefs(options?: Parameters<typeof useMutation>[0]) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateGlobalNotifPrefsInput) => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(UPDATE_GLOBAL_NOTIF_PREFS, { input });
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
