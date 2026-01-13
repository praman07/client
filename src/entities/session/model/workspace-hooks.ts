import { useAppSelector } from '@/shared/lib/redux'
import { selectCurrentWorkspace } from './selectors'

export function useCurrentWorkspace() {
  return useAppSelector(selectCurrentWorkspace)
}
