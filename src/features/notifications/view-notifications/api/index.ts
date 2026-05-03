import { gql } from '@/gql';
import { notificationKeys } from '@/entities/notification/api/query-keys';

export { notificationKeys };

// Schema: notifications(limit: Int, cursor: String, isRead: Boolean): NotificationConnection!
// NotificationConnection: { edges: [NotificationEdge!]!, pageInfo: PageInfo! }
// NotificationEdge: { cursor: String!, node: Notification! }

export const GET_NOTIFICATIONS = gql(`
  query GetNotifications($limit: Int, $cursor: String, $isRead: Boolean) {
    notifications(limit: $limit, cursor: $cursor, isRead: $isRead) {
      edges {
        cursor
        node {
          id
          entityType
          category
          isRead
          createdAt
          data
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);
