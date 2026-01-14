import { useUser as useClerkUser } from '@clerk/clerk-react'

export const useUser = () => {
  return useClerkUser()
}
