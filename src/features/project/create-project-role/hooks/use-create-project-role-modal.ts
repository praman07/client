import {
  closeCreateProjectRoleDialog,
  openCreateProjectRoleDialog,
  selectIsCreateProjectRoleDialogOpen,
} from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

/** Controls the "Create Project Role" dialog from anywhere in the widget layer. */
export function useCreateProjectRoleModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateProjectRoleDialogOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateProjectRoleDialog()),
    close: () => dispatch(closeCreateProjectRoleDialog()),
  }
}