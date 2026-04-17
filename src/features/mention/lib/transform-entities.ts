import type { SearchEntity, SearchEntityType  } from '@/gql/graphql'

export function transformEntities(raw: { getProjectEntities: Array<SearchEntity> }): Array<SearchEntity> {
  return raw.getProjectEntities
}

export function groupByType(entities: Array<SearchEntity>): Record<SearchEntityType, Array<SearchEntity>> {
  const groups: Partial<Record<SearchEntityType, Array<SearchEntity>>> = {}

  for (const entity of entities) {
    if (!groups[entity.type]) {
      groups[entity.type] = []
    }
    groups[entity.type]!.push(entity)
  }

  return groups as Record<SearchEntityType, Array<SearchEntity>>
}
