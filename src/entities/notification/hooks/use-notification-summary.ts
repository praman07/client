import { useQuery } from '@tanstack/react-query';
import { GET_NOTIFICATION_SUMMARY, NOTIFICATION_SUMMARY_FRAGMENT, notificationKeys } from '../api';
import { setNotificationSummary } from '../model/slice';
import { useAppDispatch, useAuth } from '@/shared/hooks';
import { GqlClient, getFragmentData } from '@/shared/api';

export function useNotificationSummary(options?: Parameters<typeof useQuery>[0]) {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: notificationKeys.summary(),
    queryFn: async () => {
      const token = await getToken();
      const client = GqlClient(token);
      const data = await client.request(GET_NOTIFICATION_SUMMARY);

      // data.myNotificationSummary is a codegen-masked fragment ref — getFragmentData
      // unmasks it to the concrete NotificationSummary type before Redux dispatch.
      if (data?.myNotificationSummary) {
        const summary = getFragmentData(NOTIFICATION_SUMMARY_FRAGMENT, data.myNotificationSummary);
        dispatch(setNotificationSummary(summary));
        return summary;
      }

      return null;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}