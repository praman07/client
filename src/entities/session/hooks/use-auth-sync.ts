import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { clearSession, setSession } from '../model/slice'
import { useAppDispatch } from '@/shared/hooks'

export function useAuthSync() {
  const { getToken, isSignedIn } = useAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const syncAuth = async () => {
      if (isSignedIn) {
        const token = await getToken()
        if (token) {
          dispatch(setSession({ token }))
        }
      } else {
        dispatch(clearSession())
      }
    }
    syncAuth()
  }, [isSignedIn, getToken, dispatch])
}
