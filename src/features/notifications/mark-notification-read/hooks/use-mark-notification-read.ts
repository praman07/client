import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATION_READ, notificationKeys } from '../api';
import { useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

export function useMarkNotificationRead() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: Array<string>) => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(MARK_NOTIFICATION_READ, { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(MARK_ALL_NOTIFICATIONS_READ);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}
