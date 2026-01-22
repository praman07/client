import { useAppSelector } from '@/shared/hooks' // Assuming shared/hooks exports typed selector
import { UserPresenceStatus } from '../model/types'

export function useUserPresence(userId: string): UserPresenceStatus {
  return useAppSelector(
    (state) =>
      // @ts-ignore - Assuming root state has presence
      state.presence?.users[userId] ?? 'offline',
  )
}
