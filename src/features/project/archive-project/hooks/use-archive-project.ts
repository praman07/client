import { useMutation } from '@tanstack/react-query'
import { handleArchiveProjectError } from '../lib/error-mapping'
import { ARCHIVE_PROJECT, UNARCHIVE_PROJECT, setCurrentProjectArchived  } from '@/entities/project'
import { GqlClient } from '@/shared/api'
import { useAppDispatch, useAuth } from '@/shared/hooks'

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
