import { selectCurrentWorkspace } from './selectors'
import { useAppSelector } from '@/shared/lib/redux'

export function useCurrentWorkspace() {
  return useAppSelector(selectCurrentWorkspace)
}
