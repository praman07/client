import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RESUME_NOTIFICATIONS, notificationKeys } from '../api';
import { setDndPending } from '@/entities/notification';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

export function useResumeNotifications() {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(RESUME_NOTIFICATIONS);
    },
    onMutate: () => {
      dispatch(setDndPending(false));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },
  });
}
