import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
} from '@clerk/clerk-react'

export const useAuth = () => {
  return useClerkAuth()
}

export const useUser = () => {
  return useClerkUser()
}
