import { gql } from '@/gql';

// NOTE: Do NOT interpolate fragment variables into the codegen gql tag.
// Codegen resolves fragments by spread name at build time — ${...} interpolation
// is a graphql-tag pattern and will break codegen type generation.
export const GET_NOTIFICATION_SUMMARY = gql(`
  query GetNotificationSummary {
    myNotificationSummary {
      ...NotificationSummaryFields
    }
  }
`);