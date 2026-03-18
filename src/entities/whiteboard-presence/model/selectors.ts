import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

const selectPresenceDomain = (state: RootState) => state.whiteboardPresence

export const selectRemoteCursors = createSelector(
  [selectPresenceDomain],
  (presence) => presence.remoteCursors,
)

export const selectCollaboratorCount = createSelector(
  [selectPresenceDomain],
  (presence) => presence.totalCount,
)

export const selectCollaboratorById = (userId: string) =>
  createSelector(
    [selectPresenceDomain],
    (presence) => presence.remoteCursors[userId] ?? null,
  )

export const selectActiveCollaborators = createSelector(
  [selectPresenceDomain],
  (presence) =>
    (Object.values(presence.remoteCursors).filter(
      (collab): collab is NonNullable<typeof collab> =>
        collab !== undefined && !collab.isIdle,
    )),
)

export const selectIdleCollaborators = createSelector(
  [selectPresenceDomain],
  (presence) =>
    (Object.values(presence.remoteCursors).filter(
      (collab): collab is NonNullable<typeof collab> =>
        collab !== undefined && collab.isIdle,
    )),
)

export const selectCollaboratorList = createSelector(
  [selectPresenceDomain],
  (presence) =>
    (Object.values(presence.remoteCursors).filter(
      (collab): collab is NonNullable<typeof collab> => collab !== undefined,
    )),
)
