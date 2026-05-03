import { gql } from '@/gql';

export const NOTIFICATION_SUMMARY_FRAGMENT = gql(`
  fragment NotificationSummaryFields on NotificationSummary {
    globalMode
    emailEnabled
    pushEnabled
    isDndActive
    dndUntil
    categories {
      category
      email
      push
      inApp
    }
  }
`);

export const CATEGORY_PREFERENCE_FRAGMENT = gql(`
  fragment CategoryPreferenceFields on CategoryPreferenceSetting {
    category
    email
    push
    inApp
  }
`);