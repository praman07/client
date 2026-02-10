import { useAppSelector } from '@/shared/hooks'
import {
  selectCollaboratorList,
  selectCollaboratorCount,
} from '../model/selectors'

export function useActiveCollaborators() {
  const collaborators = useAppSelector(selectCollaboratorList)
  const count = useAppSelector(selectCollaboratorCount)

  return {
    collaborators,
    count,
    hasCollaborators: count > 0,
  }
}
