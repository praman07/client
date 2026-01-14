import { selectCurrentWorkspace } from '../model/selectors'
import { useAppSelector } from '@/shared/lib/store/redux'

export function useCurrentWorkspace() {
  return useAppSelector(selectCurrentWorkspace)
}
