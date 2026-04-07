import {
  closeInviteMemberModal,
  openInviteMemberModal,
  selectIsInviteMemberModalOpen,
} from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useInviteMemberModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsInviteMemberModalOpen)

  return {
    isOpen,
    open: () => dispatch(openInviteMemberModal()),
    close: () => dispatch(closeInviteMemberModal()),
  }
}
