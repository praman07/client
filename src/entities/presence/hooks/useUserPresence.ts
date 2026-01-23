import type { UserPresenceStatus } from '../model/types'
import { useAppSelector } from '@/shared/hooks' // Assuming shared/hooks exports typed selector

export function useUserPresence(userId: string): UserPresenceStatus {
  return useAppSelector(
    (state) =>
      // @ts-ignore - Assuming root state has presence
      state.presence?.users[userId] ?? 'offline',
  )
}
