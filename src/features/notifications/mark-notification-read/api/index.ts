import { gql } from '@/gql';
import { notificationKeys } from '@/entities/notification/api/query-keys';

export { notificationKeys };

export const MARK_NOTIFICATION_READ = gql(`
  mutation MarkNotificationRead($ids: [ID!]!) {
    markNotificationRead(ids: $ids)
  }
`);

export const MARK_ALL_NOTIFICATIONS_READ = gql(`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`);
