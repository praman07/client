import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  clearPendingMode,
  setError,
  setGlobalModeOptimistic,
} from '../model/slice';
import { SET_GLOBAL_NOTIF_MODE, notificationKeys } from '../api';
import type { GlobalNotifMode } from '@/gql/graphql';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';

export function useSetGlobalMode(options?: Parameters<typeof useMutation>[0]) {
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

    ...options,
  });
}