import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import {
  openInviteMemberModal,
  closeInviteMemberModal,
  selectIsInviteMemberModalOpen,
} from '../model/slice'

export function useInviteMemberModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsInviteMemberModalOpen)

  return {
    isOpen,
    open: () => dispatch(openInviteMemberModal()),
    close: () => dispatch(closeInviteMemberModal()),
  }
}
