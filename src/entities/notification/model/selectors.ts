import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { GlobalNotifMode } from '@/gql/graphql';

const selectNotificationDomain = (state: RootState) => state.notification;

export const selectNotificationSummary = createSelector(
  selectNotificationDomain,
  (state) => state.summary
);

export const selectGlobalMode = createSelector(
  selectNotificationSummary,
  (summary) => summary?.globalMode ?? GlobalNotifMode.All
);

export const selectEmailEnabled = createSelector(
  selectNotificationSummary,
  (summary) => summary?.emailEnabled ?? true
);

export const selectPushEnabled = createSelector(
  selectNotificationSummary,
  (summary) => summary?.pushEnabled ?? true
);

export const selectIsDndActive = createSelector(
  selectNotificationSummary,
  (summary) => summary?.isDndActive ?? false
);

export const selectDndUntil = createSelector(
  selectNotificationSummary,
  (summary) => summary?.dndUntil ?? null
);

export const selectCategories = createSelector(
  selectNotificationSummary,
  (summary) => summary?.categories ?? []
);

export const selectIsLoading = createSelector(
  selectNotificationDomain,
  (state) => state.pendingMode !== null || state.isDndPending
);

export const selectError = createSelector(
  selectNotificationDomain,
  (state) => state.error
);