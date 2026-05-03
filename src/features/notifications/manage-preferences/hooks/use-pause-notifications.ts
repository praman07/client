import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PAUSE_NOTIFICATIONS, notificationKeys } from '../api';
import { DND_DURATION_PRESETS } from '../model/types';
import { setDndPending } from '@/entities/notification';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

export function usePauseNotifications(options?: Parameters<typeof useMutation>[0]) {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const pauseMutation = useMutation({
    mutationFn: async (until: Date) => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(PAUSE_NOTIFICATIONS, {
        until: until.toISOString(),
      });
    },
    onMutate: () => {
      dispatch(setDndPending(true));
    },
    onError: () => {
      dispatch(setDndPending(false)); // Rollback optimistic state
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },
    ...options,
  });

  return {
    pause1Hour: () => {
      const until = new Date(Date.now() + (DND_DURATION_PRESETS['1h'] ?? 0));
      return pauseMutation.mutate(until);
    },
    pause4Hours: () => {
      const until = new Date(Date.now() + (DND_DURATION_PRESETS['4h'] ?? 0));
      return pauseMutation.mutate(until);
    },
    pauseUntilTomorrow: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);
      return pauseMutation.mutate(tomorrow);
    },
    pauseCustom: (until: Date) => pauseMutation.mutate(until),
    ...pauseMutation,
  };
}
