import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import {
  openCreateWorkspaceRoleDialog,
  closeCreateWorkspaceRoleDialog,
  selectIsCreateWorkspaceRoleDialogOpen,
} from '../model/create-role-slice'

export function useCreateWorkspaceRoleModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateWorkspaceRoleDialogOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateWorkspaceRoleDialog()),
    close: () => dispatch(closeCreateWorkspaceRoleDialog()),
  }
}
