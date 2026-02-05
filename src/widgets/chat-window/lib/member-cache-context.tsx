import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react'

/**
 * Member information cached from conversation query
 */
export interface MemberInfo {
  userId: string
  fullName: string
  email: string
  avatarUrl?: string | null
}

interface MemberCacheContextValue {
  getMemberInfo: (userId: string) => MemberInfo | null
  addUsers: (users: Array<MemberInfo>) => void
}

const MemberCacheContext = createContext<MemberCacheContextValue | null>(null)


interface MemberCacheProviderProps {
  members:
    | Array<{
        userId: string
        role: string
        isMuted: boolean
        joinedAt: string
        user: {
          id: string
          fullName: string
          email: string
          avatarUrl?: string | null
        }
      }>
    | undefined
  children: ReactNode
}


/**
 * Provider that caches conversation member data for efficient lookups
 * Fetches member data once from conversation query and provides O(1) access
 */
export function MemberCacheProvider({
  members,
  children,
}: MemberCacheProviderProps) {
  // Extra users fetched dynamically (e.g. message authors who left)
  const [extraUsers, setExtraUsers] = useState<Map<string, MemberInfo>>(
    new Map()
  )

  // Build combined Map: conversation members + extra fetched users
  const memberMap = useMemo(() => {
    const map = new Map<string, MemberInfo>()

    // Add conversation members
    if (members) {
      console.log('[MemberCache] Building cache for', members.length, 'members')
      for (const member of members) {
        const memberInfo = {
          userId: member.userId,
          fullName: member.user.fullName,
          email: member.user.email,
          avatarUrl: member.user.avatarUrl,
        }
        console.log('[MemberCache] Adding member:', memberInfo)
        map.set(member.userId, memberInfo)
      }
    } else {
      console.log('[MemberCache] No members provided')
    }

    // Add extra fetched users
    extraUsers.forEach((user, userId) => {
      if (!map.has(userId)) {
        console.log('[MemberCache] Adding extra user:', user)
        map.set(userId, user)
      }
    })

    console.log('[MemberCache] Cache built with', map.size, 'entries')
    return map
  }, [members, extraUsers])

  const addUsers = useCallback((users: Array<MemberInfo>) => {
    console.log('[MemberCache] Adding', users.length, 'extra users to cache')
    setExtraUsers(prev => {
      const next = new Map(prev)
      users.forEach(u => {
        console.log('[MemberCache] Caching extra user:', u)
        next.set(u.userId, u)
      })
      return next
    })
  }, [])

  const value: MemberCacheContextValue = useMemo(
    () => ({
      getMemberInfo: (userId: string) => memberMap.get(userId) ?? null,
      addUsers,
    }),
    [memberMap, addUsers],
  )

  return (
    <MemberCacheContext.Provider value={value}>
      {children}
    </MemberCacheContext.Provider>
  )
}

/**
 * Hook to access member cache
 * @returns Object with getMemberInfo function
 * @throws Error if used outside MemberCacheProvider
 */
export function useMemberCache(): MemberCacheContextValue {
  const context = useContext(MemberCacheContext)

  if (!context) {
    throw new Error('useMemberCache must be used within MemberCacheProvider')
  }

  return context
}
