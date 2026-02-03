import { configureStore } from '@reduxjs/toolkit'
import chatSessionReducer from '@/entities/chat-session/model/slice'
import sessionReducer from '@/entities/session/model/slice'
import workspaceReducer from '@/entities/workspace/model/slice'
import createWorkspaceReducer from '@/features/create-workspace/model/slice'
import userReducer from '@/entities/user/model/slice'
import projectReducer from '@/entities/project/model/slice'
import createProjectReducer from '@/features/create-project/model/slice'
import { createChannelReducer } from '@/features/chat/create-channel/model/slice'
import conversationReducer from '@/entities/conversation/model/slice'
import { channelSettingsReducer } from '@/widgets/channel-settings-modal'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    workspace: workspaceReducer,
    createWorkspace: createWorkspaceReducer,
    user: userReducer,
    project: projectReducer,
    createProject: createProjectReducer,
    createChannel: createChannelReducer,
    chatSession: chatSessionReducer,
    conversation: conversationReducer, // ✅ NEW - Conversation state management
    channelSettings: channelSettingsReducer, // Channel settings modal state
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
