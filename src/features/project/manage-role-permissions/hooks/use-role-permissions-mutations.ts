import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleRolePermissionError } from '../lib/error-mapping'
import {
  ASSIGN_ROLE_PERMISSION,
  REMOVE_ROLE_PERMISSION, rolePermissionKeys 
} from '@/entities/project-role'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface AssignPermissionInput {
  roleId: string
  workspaceId: string
  permissionId: string
  effect?: string
}

interface RemovePermissionInput {
  roleId: string
  workspaceId: string
  permissionId: string
}

export function useAssignRolePermission() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      roleId,
      workspaceId,
      permissionId,
      effect = 'ALLOW',
    }: AssignPermissionInput) => {
      const token = await getToken()
      return GqlClient(token).request(ASSIGN_ROLE_PERMISSION, {
        roleId,
        workspaceId,
        permissionId,
        effect,
      })
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionKeys.list(roleId),
      })
    },
    onError: handleRolePermissionError,
  })
}

export function useRemoveRolePermission() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      roleId,
      workspaceId,
      permissionId,
    }: RemovePermissionInput) => {
      const token = await getToken()
      return GqlClient(token).request(REMOVE_ROLE_PERMISSION, {
        roleId,
        workspaceId,
        permissionId,
      })
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionKeys.list(roleId),
      })
    },
    onError: handleRolePermissionError,
  })
}
