import {
  selectCollaboratorCount,
  selectCollaboratorList,
} from '../model/selectors'
import { useAppSelector } from '@/shared/hooks'

export function useActiveCollaborators() {
  const collaborators = useAppSelector(selectCollaboratorList)
  const count = useAppSelector(selectCollaboratorCount)

  return {
    collaborators,
    count,
    hasCollaborators: count > 0,
  }
}
