import { useMutation } from '@tanstack/react-query'
import { ARCHIVE_PROJECT, UNARCHIVE_PROJECT } from '@/entities/project'
import { GqlClient } from '@/shared/api'
import { useAuth, useAppDispatch } from '@/shared/hooks'
import { setCurrentProjectArchived } from '@/entities/project'
import { handleArchiveProjectError } from '../lib/error-mapping'

export function useArchiveProject() {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken()
      return GqlClient(token).request(ARCHIVE_PROJECT, { projectId })
    },
    onSuccess: () => {
      dispatch(setCurrentProjectArchived(true))
    },
    onError: handleArchiveProjectError,
  })
}

export function useUnarchiveProject() {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken()
      return GqlClient(token).request(UNARCHIVE_PROJECT, { projectId })
    },
    onSuccess: () => {
      dispatch(setCurrentProjectArchived(false))
    },
    onError: handleArchiveProjectError,
  })
}
