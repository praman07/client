import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SYNC_USER_MUTATION } from '@/entities/session/api'
import { setCurrentUser } from '@/entities/user/model'
import { GqlClient } from '@/shared/api'
import { useAppDispatch, useAuth, useUser } from '@/shared/hooks'

export function useUpdateUser() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  const { mutateAsync: syncUser } = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('No token found')
      const client = GqlClient(token)
      if (!user) throw new Error('No user found')

      return client.request(SYNC_USER_MUTATION, {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        fullName: user.fullName || '',
        avatarUrl: user.imageUrl || '',
      })
    },
    onSuccess: (data) => {
      dispatch(setCurrentUser(data.syncUser))
    },
  })

  useEffect(() => {
    if (isLoaded && user) {
      syncUser()
    }
  }, [isLoaded, user, syncUser])
}
