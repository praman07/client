import { useInfiniteQuery } from '@tanstack/react-query';
import { GET_NOTIFICATIONS, notificationKeys } from '../api';
import { useAuth } from '@/shared/hooks';
import { GqlClient } from '@/shared/api';
import type { GetNotificationsQuery } from '@/gql/graphql';

interface UseNotificationsOptions {
  limit?: number;
  isRead?: boolean;
}

export function useNotifications({ limit = 20, isRead }: UseNotificationsOptions = {}) {
  const { getToken } = useAuth();

  return useInfiniteQuery({
    queryKey: notificationKeys.list({ isRead }),
    queryFn: async ({ pageParam }): Promise<GetNotificationsQuery> => {
      const token = await getToken();
      const client = GqlClient(token);
      return client.request(GET_NOTIFICATIONS, {
        limit,
        cursor: pageParam,
        isRead: isRead ?? undefined,
      }) as Promise<GetNotificationsQuery>;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.notifications.pageInfo;
      return pageInfo.endCursor ?? undefined;
    },
  });
}
