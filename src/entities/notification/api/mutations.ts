import { gql } from '@/gql';

export const SET_GLOBAL_NOTIF_MODE = gql(`
  mutation SetGlobalNotifMode($mode: GlobalNotifMode!) {
    setGlobalNotifMode(mode: $mode)
  }
`);

export const PAUSE_NOTIFICATIONS = gql(`
  mutation PauseNotifications($until: String!) {
    pauseNotifications(until: $until)
  }
`);

export const RESUME_NOTIFICATIONS = gql(`
  mutation ResumeNotifications {
    resumeNotifications
  }
`);

// Email and push notification channel preferences are controlled via updateGlobalNotifPrefs,
// which accepts a single input with optional emailEnabled, pushEnabled, and globalMode fields.
// There are no separate setEmailNotifications / setPushNotifications mutations in the schema.
export const UPDATE_GLOBAL_NOTIF_PREFS = gql(`
  mutation UpdateGlobalNotifPrefs($input: UpdateGlobalNotifPrefsInput!) {
    updateGlobalNotifPrefs(input: $input) {
      emailEnabled
      pushEnabled
      globalMode
    }
  }
`);

// NOTE: GET_NOTIFICATION_SUMMARY_AFTER_MUTATION was removed.
// myNotificationSummary is a GraphQL Query, not a Mutation.
// Cache refresh after mutations is handled via:
//   queryClient.invalidateQueries({ queryKey: notificationKeys.summary() })
// in each mutation's onSuccess / onError handler.
