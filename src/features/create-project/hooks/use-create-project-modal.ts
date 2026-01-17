import {
  closeCreateProjectModal,
  openCreateProjectModal,
  selectIsCreateProjectModalOpen,
  toggleCreateProjectModal,
} from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useCreateProjectModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateProjectModalOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateProjectModal()),
    close: () => dispatch(closeCreateProjectModal()),
    toggle: () => dispatch(toggleCreateProjectModal()),
  }
}
