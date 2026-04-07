import {
  closeCreateRoleDialog,
  openCreateRoleDialog,
  selectIsCreateRoleDialogOpen,
} from '../model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

/** Controls the "Create Project Role" dialog from within the widget layer. */
export function useCreateProjectRoleModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateRoleDialogOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateRoleDialog()),
    close: () => dispatch(closeCreateRoleDialog()),
  }
}
