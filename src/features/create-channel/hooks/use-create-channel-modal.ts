import {
  closeCreateChannelModal,
  openCreateChannelModal,
  selectIsCreateChannelModalOpen,
} from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useCreateChannelModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateChannelModalOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateChannelModal()),
    close: () => dispatch(closeCreateChannelModal()),
  }
}
