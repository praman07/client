import { gql } from '@/gql';

// NOTE: These mutations return Boolean! — no sub-selections allowed
// Schema: setGlobalNotifMode(mode: GlobalNotifMode!): Boolean!
// Schema: pauseNotifications(until: String!): Boolean!
// Schema: resumeNotifications: Boolean!

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

export const UPDATE_GLOBAL_NOTIF_PREFS = gql(`
  mutation UpdateGlobalNotifPrefs($input: UpdateGlobalNotifPrefsInput!) {
    updateGlobalNotifPrefs(input: $input) {
      emailEnabled
      pushEnabled
      globalMode
    }
  }
`);
