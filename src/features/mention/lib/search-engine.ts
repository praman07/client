import type { SearchEntity } from '@/gql/graphql'

export interface SearchResult {
  item: SearchEntity
  score: number
  matchType: MatchType
}

export type MatchType = 'exact' | 'prefix' | 'word' | 'contains'

function tokenize(text: string): Array<string> {
  return text
    .toLowerCase()
    .split(/[\s\-_.,!?()[\]{}]+/)
    .filter(Boolean)
}

function getScore(query: string, name: string, tokens: Array<string>): { score: number; matchType: MatchType } | null {
  const lowerQuery = query.toLowerCase()
  const lowerName = name.toLowerCase()

  if (lowerName === lowerQuery) {
    return { score: 100, matchType: 'exact' }
  }

  if (lowerName.startsWith(lowerQuery)) {
    return { score: 80, matchType: 'prefix' }
  }

  for (const token of tokens) {
    if (token === lowerQuery) {
      return { score: 60, matchType: 'word' }
    }
  }

  if (lowerName.includes(lowerQuery)) {
    return { score: 40, matchType: 'contains' }
  }

  return null
}

export function searchEntities(entities: Array<SearchEntity>, query: string, limit = 50): Array<SearchResult> {
  if (!query.trim()) {
    return entities.slice(0, limit).map((item) => ({
      item,
      score: 0,
      matchType: 'exact' as MatchType,
    }))
  }

  const results: Array<SearchResult> = []

  for (const entity of entities) {
    const tokens = tokenize(entity.name)
    const match = getScore(query, entity.name, tokens)

    if (match) {
      results.push({
        item: entity,
        score: match.score,
        matchType: match.matchType,
      })
    }
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.item.name.localeCompare(b.item.name)
  })

  return results.slice(0, limit)
}
