import {
  closeUserProfilePanel,
  openUserProfilePanel,
  selectIsUserProfilePanelOpen,
  selectUserProfilePanelUserId,
} from '../model'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

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
