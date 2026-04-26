import {
  closeUserProfilePanel,
  openUserProfilePanel,
  selectIsUserProfilePanelOpen,
  selectUserProfilePanelUserId,
  selectUserProfilePanelProjectId,
} from '../model'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useUserProfilePanel() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsUserProfilePanelOpen)
  const userId = useAppSelector(selectUserProfilePanelUserId)
  const projectId = useAppSelector(selectUserProfilePanelProjectId)

  return {
    isOpen,
    userId,
    projectId,
    open: (uid: string, pid: string) =>
      dispatch(openUserProfilePanel({ userId: uid, projectId: pid })),
    close: () => dispatch(closeUserProfilePanel()),
  }
}
