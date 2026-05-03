import {
  closeCreateWorkspaceRoleDialog,
  openCreateWorkspaceRoleDialog,
  selectIsCreateWorkspaceRoleDialogOpen,
} from '../model/create-role-slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useCreateWorkspaceRoleModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreateWorkspaceRoleDialogOpen)

  return {
    isOpen,
    open: () => dispatch(openCreateWorkspaceRoleDialog()),
    close: () => dispatch(closeCreateWorkspaceRoleDialog()),
  }
}
