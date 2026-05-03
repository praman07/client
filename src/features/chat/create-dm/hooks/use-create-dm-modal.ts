import {
  closeCreateDmModal,
  openCreateDmModal,
  selectIsCreateDmModalOpen,
} from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useCreateDmModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateDmModalOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateDmModal()),
    close: () => dispatch(closeCreateDmModal()),
  }
}
