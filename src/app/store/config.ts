import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from '@/entities/session/model/slice'
import workspaceReducer from '@/entities/workspace/model/slice'
import createWorkspaceReducer from '@/features/create-workspace/model/slice'
import userReducer from '@/entities/user/model/slice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    workspace: workspaceReducer,
    createWorkspace: createWorkspaceReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
