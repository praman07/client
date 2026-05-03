import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RESUME_NOTIFICATIONS, notificationKeys } from '../api';
import { setDndPending, setError } from '../model/slice';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

export function useResumeNotifications(options?: Parameters<typeof useMutation>[0]) {
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
      // Revert optimistic DND state — without this isDndActive stays false after a failed resume
      dispatch(setDndPending(true));
      dispatch(setError('Failed to resume notifications'));
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },

    ...options,
  });
}