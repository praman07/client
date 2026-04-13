import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SET_GLOBAL_NOTIF_MODE, notificationKeys } from '../api';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';
import { setGlobalModeOptimistic, clearPendingMode, setError } from '@/entities/notification';
import type { GlobalNotifMode } from '@/gql/graphql';

export function useSetGlobalMode() {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mode: GlobalNotifMode) => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(SET_GLOBAL_NOTIF_MODE, { mode });
    },
    onMutate: (mode) => {
      dispatch(setGlobalModeOptimistic(mode));
    },
    onError: () => {
      dispatch(clearPendingMode());
      dispatch(setError('Failed to update notification mode'));
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },
    onSuccess: () => {
      dispatch(clearPendingMode());
      queryClient.invalidateQueries({ queryKey: notificationKeys.summary() });
    },
  });
}
