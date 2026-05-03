import { useMemo } from 'react'
import { searchEntities } from '../../lib'
import { useProjectEntities } from '../../fetch-entities'

export function useTagSearch(projectId: string, query: string, limit = 50) {
  const { data: entities, isLoading, error } = useProjectEntities(projectId)

  const results = useMemo(() => {
    if (!entities) return []
    return searchEntities(entities, query, limit)
  }, [entities, query, limit])

  return {
    results,
    entities,
    isLoading,
    error,
  }
}
