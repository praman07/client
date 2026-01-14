import { selectCurrentWorkspace } from '../model/selectors'
import { useAppSelector } from '@/shared/hooks'

export function useCurrentWorkspace() {
  return useAppSelector(selectCurrentWorkspace)
}
