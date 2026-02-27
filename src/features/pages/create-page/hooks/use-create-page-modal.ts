import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import {
  openCreatePageModal,
  closeCreatePageModal,
  selectIsCreatePageModalOpen,
  selectCreatePageModalParentId,
} from '../model/create-page-modal-store'

/**
 * Hook for controlling the create-page modal.
 * Mirrors useCreateChannelModal from features/chat/create-channel.
 *
 * @layer Features
 */
export function useCreatePageModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCreatePageModalOpen)
  const parentId = useAppSelector(selectCreatePageModalParentId)

  return {
    isOpen,
    parentId,
    open: (opts?: { parentId?: string | null }) =>
      dispatch(openCreatePageModal({ parentId: opts?.parentId ?? null })),
    close: () => dispatch(closeCreatePageModal()),
  }
}
