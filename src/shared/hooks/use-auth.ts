import { useAuth as useClerkAuth } from '@clerk/clerk-react'

export const useAuth = () => {
  return useClerkAuth()
}
