import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import {
  openUserProfilePanel,
  closeUserProfilePanel,
  selectIsUserProfilePanelOpen,
  selectUserProfilePanelUserId,
} from '../model'

export function useUserProfilePanel() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsUserProfilePanelOpen)
  const userId = useAppSelector(selectUserProfilePanelUserId)

  return {
    isOpen,
    userId,
    open: (uid: string) => dispatch(openUserProfilePanel(uid)),
    close: () => dispatch(closeUserProfilePanel()),
  }
}
