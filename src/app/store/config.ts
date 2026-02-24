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
import whiteboardSessionReducer from '@/entities/whiteboard-session/model/slice'
import whiteboardPresenceReducer from '@/entities/whiteboard-presence/model/slice'
import pageSessionReducer from '@/entities/page-session/model/slice'
import pagePresenceReducer from '@/entities/page-presence/model/slice'

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
    whiteboardSession: whiteboardSessionReducer, // ✅ Whiteboard Y.Doc session
    whiteboardPresence: whiteboardPresenceReducer, // ✅ Whiteboard collaborators
    pageSession: pageSessionReducer, // ✅ Pages Y.Doc session
    pagePresence: pagePresenceReducer, // ✅ Pages collaborator presence
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
