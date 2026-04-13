import { configureStore } from '@reduxjs/toolkit'
import chatSessionReducer from '@/entities/chat-session/model/slice'
import sessionReducer from '@/entities/session/model/slice'
import workspaceReducer from '@/entities/workspace/model/slice'
import createWorkspaceReducer from '@/features/create-workspace/model/slice'
import userReducer from '@/entities/user/model/slice'
import projectReducer from '@/entities/project/model/slice'
import createProjectReducer from '@/features/project/create-project/model/slice'
import { createChannelReducer } from '@/features/chat/create-channel/model/slice'
import { createDmReducer } from '@/features/chat/create-dm/model/slice'
import conversationReducer from '@/entities/conversation/model/slice'
import { channelSettingsReducer } from '@/widgets/channel-settings-modal'
import whiteboardSessionReducer from '@/entities/whiteboard-session/model/slice'
import whiteboardPresenceReducer from '@/entities/whiteboard-presence/model/slice'
import pageSessionReducer from '@/entities/page-session/model/slice'
import pagePresenceReducer from '@/entities/page-presence/model/slice'
import { createPageModalReducer } from '@/features/pages/create-page/model/create-page-modal-store'
import { uploadTrayReducer } from '@/widgets/vault/vault-upload-tray/model/upload-tray-slice'
import issuesReducer from '@/entities/issue/model/slice'
import { addProjectMemberReducer } from '@/features/project/add-project-member/model/slice'
import { deleteProjectReducer } from '@/features/project/delete-project/model/slice'
import { leaveProjectReducer } from '@/features/project/leave-project/model/slice'
import { createProjectRoleReducer } from '@/features/project/create-project-role/model/slice'
import { updateProjectRoleReducer } from '@/features/project/update-project-role/model/slice'
import inviteMemberReducer from '@/features/invite-member/model/slice'
import { createWorkspaceRoleReducer } from '@/features/workspace/manage-workspace-role/model/create-role-slice'
import { userProfilePanelReducer } from '@/features/chat/user-profile-panel'
import notificationReducer from '@/entities/notification/model/slice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    workspace: workspaceReducer,
    createWorkspace: createWorkspaceReducer,
    user: userReducer,
    project: projectReducer,
    createProject: createProjectReducer,
    createChannel: createChannelReducer, // ✅ Create channel modal state
    createDm: createDmReducer, // ✅ Create DM modal state
    chatSession: chatSessionReducer,
    conversation: conversationReducer, // ✅ Conversation state management
    channelSettings: channelSettingsReducer, // Channel settings modal state
    whiteboardSession: whiteboardSessionReducer, // ✅ Whiteboard Y.Doc session
    whiteboardPresence: whiteboardPresenceReducer, // ✅ Whiteboard collaborators
    pageSession: pageSessionReducer, // ✅ Pages Y.Doc session
    pagePresence: pagePresenceReducer, // ✅ Pages collaborator presence
    createPageModal: createPageModalReducer, // ✅ Create page modal state
    uploadTray: uploadTrayReducer, // ✅ Vault upload progress tray
    issues: issuesReducer, // ✅ Issues Kanban board state
    addProjectMember: addProjectMemberReducer, // ✅ Add member dialog state
    deleteProject: deleteProjectReducer, // ✅ Delete project dialog state
    leaveProject: leaveProjectReducer, // ✅ Leave project dialog state
    createProjectRole: createProjectRoleReducer, // ✅ Create role dialog state
    updateProjectRole: updateProjectRoleReducer, // ✅ Update role dialog state
    inviteMember: inviteMemberReducer, // ✅ Invite member dialog state
    createWorkspaceRole: createWorkspaceRoleReducer, // ✅ Create workspace role dialog
    userProfilePanel: userProfilePanelReducer, // ✅ user-profile-panel reducer
    notification: notificationReducer, // ✅ Notification preferences state
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
