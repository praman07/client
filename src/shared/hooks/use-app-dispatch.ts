import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/store/config'

export const useAppDispatch: () => AppDispatch = useDispatch
