/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n": typeof types.MessageRecoveryFieldsFragmentDoc,
    "\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n": typeof types.GetMissingMessagesDocument,
    "\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n": typeof types.GetHistoryDocument,
    "\n  fragment ConversationFields on Conversation {\n    id\n    type\n    name\n    description: topic\n    topic\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    isArchived\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n    members {\n      ...ConversationMemberFields\n    }\n  }\n": typeof types.ConversationFieldsFragmentDoc,
    "\n  fragment ConversationMemberFields on ConversationMember {\n    userId\n    role\n    isMuted\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n": typeof types.ConversationMemberFieldsFragmentDoc,
    "\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.GetUserConversationsDocument,
    "\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationFields\n      members {\n        ...ConversationMemberFields\n      }\n    }\n  }\n": typeof types.GetConversationDocument,
    "\n  query GetUsersByIds($userIds: [ID!]!) {\n    getUsersByIds(userIds: $userIds) {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n": typeof types.GetUsersByIdsDocument,
    "\n  fragment IssueLabelFields on IssueLabel {\n    id\n    projectId\n    name\n    color\n    createdAt\n  }\n": typeof types.IssueLabelFieldsFragmentDoc,
    "\n  fragment IssueStatusFields on IssueStatus {\n    id\n    projectId\n    name\n    color\n    icon\n    position\n    isSystem\n    issueCount\n  }\n": typeof types.IssueStatusFieldsFragmentDoc,
    "\n  fragment IssueCardFields on Issue {\n    id\n    number\n    title\n    priority\n    position\n    dueDate\n    updatedAt\n    status {\n      id\n      name\n      color\n      icon\n    }\n    assignee {\n      id\n      fullName\n      avatarUrl\n    }\n    labels {\n      id\n      name\n      color\n    }\n  }\n": typeof types.IssueCardFieldsFragmentDoc,
    "\n  fragment IssueDetailFields on Issue {\n    ...IssueCardFields\n    descriptionS3Key\n    createdBy {\n      id\n      fullName\n      avatarUrl\n    }\n    createdAt\n  }\n": typeof types.IssueDetailFieldsFragmentDoc,
    "\n  fragment PageFields on Page {\n    id\n    title\n    workspaceId\n    projectId\n    parentId\n    icon\n    coverUrl\n    position\n    isArchived\n    isLocked\n    s3Key\n    createdBy\n    createdAt\n    updatedAt\n  }\n": typeof types.PageFieldsFragmentDoc,
    "\n  fragment PageWithCollaborators on Page {\n    ...PageFields\n    collaborators {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.PageWithCollaboratorsFragmentDoc,
    "\n  fragment PageWithChildren on Page {\n    ...PageFields\n    children {\n      ...PageFields\n      children {\n        ...PageFields\n        children {\n          ...PageFields\n        }\n      }\n    }\n  }\n": typeof types.PageWithChildrenFragmentDoc,
    "\n  fragment ProjectMemberFields on ProjectMember {\n    id\n    userId\n    role\n    roleId\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n": typeof types.ProjectMemberFieldsFragmentDoc,
    "\n  query GetProjectMembers($projectId: ID!) {\n    projectMembers(projectId: $projectId) {\n      ...ProjectMemberFields\n    }\n  }\n": typeof types.GetProjectMembersDocument,
    "\n  mutation AddProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    addProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n": typeof types.AddProjectMemberDocument,
    "\n  mutation RemoveProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!) {\n    removeProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId)\n  }\n": typeof types.RemoveProjectMemberDocument,
    "\n  mutation UpdateProjectMemberRole($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    updateProjectMemberRole(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n": typeof types.UpdateProjectMemberRoleDocument,
    "\n  mutation LeaveProject($projectId: ID!) {\n    leaveProject(projectId: $projectId)\n  }\n": typeof types.LeaveProjectDocument,
    "\n  fragment ProjectRoleFields on ProjectRole {\n    id\n    name\n    rank\n    description\n    isSystem\n    scopeType\n  }\n": typeof types.ProjectRoleFieldsFragmentDoc,
    "\n  fragment RolePermissionFields on RolePermission {\n    roleId\n    permissionId\n    effect\n    conditions\n    permission {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": typeof types.RolePermissionFieldsFragmentDoc,
    "\n  query GetProjectRoles($projectId: ID!, $workspaceId: ID!) {\n    projectRoles(projectId: $projectId, workspaceId: $workspaceId) {\n      ...ProjectRoleFields\n    }\n  }\n": typeof types.GetProjectRolesDocument,
    "\n  query GetRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      ...RolePermissionFields\n    }\n  }\n": typeof types.GetRolePermissionsDocument,
    "\n  query GetAllPermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": typeof types.GetAllPermissionsDocument,
    "\n  query GetProjectPermissions($workspaceId: ID!, $projectId: ID!) {\n    projectPermissions(workspaceId: $workspaceId, projectId: $projectId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": typeof types.GetProjectPermissionsDocument,
    "\n  mutation CreateProjectRole(\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: CreateProjectRoleInput!\n  ) {\n    createProjectRole(\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n": typeof types.CreateProjectRoleDocument,
    "\n  mutation UpdateProjectRole(\n    $roleId: ID!\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: UpdateProjectRoleInput!\n  ) {\n    updateProjectRole(\n      roleId: $roleId\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n": typeof types.UpdateProjectRoleDocument,
    "\n  mutation DeleteProjectRole($roleId: ID!, $projectId: ID!, $workspaceId: ID!) {\n    deleteProjectRole(roleId: $roleId, projectId: $projectId, workspaceId: $workspaceId)\n  }\n": typeof types.DeleteProjectRoleDocument,
    "\n  mutation AssignRolePermission(\n    $roleId: ID!\n    $workspaceId: ID!\n    $permissionId: ID!\n    $effect: String!\n    $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId\n      workspaceId: $workspaceId\n      permissionId: $permissionId\n      effect: $effect\n      conditions: $conditions\n    ) {\n      ...RolePermissionFields\n    }\n  }\n": typeof types.AssignRolePermissionDocument,
    "\n  mutation RemoveRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n": typeof types.RemoveRolePermissionDocument,
    "\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    isArchived\n    isPrivate\n    logoUrl\n    activePlugins\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n": typeof types.ProjectFieldsFragmentDoc,
    "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n": typeof types.GetProjectDocument,
    "\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n": typeof types.MyProjectsDocument,
    "\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n": typeof types.GetProjectBySlugDocument,
    "\n  query GetProjectOverview($projectId: ID!) {\n    projectOverview(projectId: $projectId) {\n      totalIssues\n      openIssues\n      completedIssues\n      overdueIssues\n      pageCount\n      memberCount\n      issuesByStatus {\n        statusId\n        name\n        color\n        icon\n        issueCount\n      }\n      recentIssues {\n        id\n        number\n        title\n        priority\n        dueDate\n        updatedAt\n        statusName\n        statusColor\n        assigneeId\n        assigneeName\n        assigneeAvatar\n      }\n      members {\n        userId\n        name\n        email\n        avatarUrl\n        roleName\n        roleRank\n        joinedAt\n      }\n      \n      issuesByPriority {\n        priority\n        count\n      }\n      upcomingIssues {\n        id\n        number\n        title\n        dueDate\n        assigneeName\n        assigneeAvatar\n        statusName\n        statusColor\n      }\n      recentPages {\n        id\n        title\n        emojiIcon\n        updatedAt\n        createdByName\n      }\n      recentVaultFiles {\n        id\n        name\n        mimeType\n        sizeBytes\n        createdByName\n        createdAt\n      }\n      recentWhiteboards {\n        id\n        title\n        elementCount\n        updatedAt\n        isLocked\n      }\n      vaultUsage {\n        usedBytes\n        fileCount\n      }\n      projectChannels {\n        id\n        name\n        topic\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetProjectOverviewDocument,
    "\n  query GetProjectContributorStats($projectId: ID!) {\n    projectContributorStats(projectId: $projectId) {\n      userId\n      name\n      avatarUrl\n      assigned\n      completed\n    }\n  }\n": typeof types.GetProjectContributorStatsDocument,
    "\n  mutation UpdateProject($projectId: ID!, $input: UpdateProjectInput!) {\n    updateProject(projectId: $projectId, input: $input) {\n      ...ProjectFields\n    }\n  }\n": typeof types.UpdateProjectDocument,
    "\n  mutation ArchiveProject($projectId: ID!) {\n    archiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n": typeof types.ArchiveProjectDocument,
    "\n  mutation UnarchiveProject($projectId: ID!) {\n    unarchiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n": typeof types.UnarchiveProjectDocument,
    "\n  mutation DeleteProject($projectId: ID!) {\n    deleteProject(projectId: $projectId)\n  }\n": typeof types.DeleteProjectDocument,
    "\n  mutation ToggleProjectPlugin($projectId: ID!, $workspaceId: ID!, $type: String!, $enable: Boolean!) {\n    toggleProjectPlugin(projectId: $projectId, workspaceId: $workspaceId, type: $type, enable: $enable)\n  }\n": typeof types.ToggleProjectPluginDocument,
    "\n  mutation RequestProjectLogoUpload($projectId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestProjectLogoUpload(projectId: $projectId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n": typeof types.RequestProjectLogoUploadDocument,
    "\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }": typeof types.SessionSyncUserDocument,
    "\n  query GetMe {\n    me {\n      ...User\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  fragment User on User {\n    id\n    email\n    fullName\n    avatarUrl\n    bio\n    timezone\n    language\n  }\n": typeof types.UserFragmentDoc,
    "\n  mutation UpdateProfileMutation($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...User\n    }\n  }\n": typeof types.UpdateProfileMutationDocument,
    "\n  fragment VaultFileFields on VaultFile {\n    id\n    projectId\n    workspaceId\n    folderId\n    uploaderUserId\n    name\n    mimeType\n    sizeBytes\n    s3Key\n    source\n    sourceId\n    status\n    uploader {\n      id\n      fullName\n      avatarUrl\n    }\n    confirmedAt\n    createdAt\n    updatedAt\n  }\n": typeof types.VaultFileFieldsFragmentDoc,
    "\n  fragment VaultFolderFields on VaultFolder {\n    id\n    projectId\n    parentFolderId\n    name\n    isSystem\n    createdAt\n    updatedAt\n  }\n": typeof types.VaultFolderFieldsFragmentDoc,
    "\n  fragment BoardFields on Whiteboard {\n    id\n    workspaceId\n    projectId\n    title\n    description\n    elementCount\n    fileSizeBytes\n    isArchived\n    isLocked\n    createdBy\n    createdAt\n    updatedAt\n  }\n": typeof types.BoardFieldsFragmentDoc,
    "\n  fragment BoardWithCollaborators on Whiteboard {\n    ...BoardFields\n    collaborators {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.BoardWithCollaboratorsFragmentDoc,
    "\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    memberRole\n  }\n": typeof types.WorkspaceFragmentFragmentDoc,
    "\n  fragment WorkspaceLightFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n": typeof types.WorkspaceLightFragmentFragmentDoc,
    "\n  fragment WorkspaceSettingsFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    domainWhitelist\n    memberRole\n    createdAt\n    updatedAt\n  }\n": typeof types.WorkspaceSettingsFragmentFragmentDoc,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n": typeof types.GetMyWorkspacesDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceLightFragment\n    }\n  }\n": typeof types.GetWorkspaceBySlugDocument,
    "\n  query GetWorkspaceOverview($workspaceId: ID!) {\n    workspaceOverview(workspaceId: $workspaceId) {\n      totalProjects\n      totalMembers\n      totalIssues\n      totalPages\n      totalChannels\n      activeProjects {\n        id\n        name\n        key\n        description\n        memberCount\n        openIssues\n        updatedAt\n      }\n      recentMembers {\n        userId\n        fullName\n        email\n        avatarUrl\n        roleName\n        joinedAt\n      }\n    }\n  }\n": typeof types.GetWorkspaceOverviewDocument,
    "\n  query GetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      description\n      isSystem\n      rank\n    }\n  }\n": typeof types.GetWorkspaceRolesDocument,
    "\n  mutation UpdateWorkspace($workspaceId: ID!, $input: UpdateWorkspaceInput!) {\n    updateWorkspace(workspaceId: $workspaceId, input: $input) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n": typeof types.UpdateWorkspaceDocument,
    "\n  mutation RenameWorkspaceSlug($workspaceId: ID!, $slug: String!) {\n    renameWorkspaceSlug(workspaceId: $workspaceId, slug: $slug) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n": typeof types.RenameWorkspaceSlugDocument,
    "\n  mutation RequestWorkspaceLogoUpload($workspaceId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestWorkspaceLogoUpload(workspaceId: $workspaceId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n": typeof types.RequestWorkspaceLogoUploadDocument,
    "\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n      reservationId\n    }\n  }\n": typeof types.CheckSlugAvailabilityDocument,
    "\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      roleId\n      roleRank\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.GetWorkspaceMembersDocument,
    "\n  mutation ArchiveChannel($input: ArchiveChannelInput!) {\n    archiveChannel(input: $input) {\n      id\n      name\n      type\n      isArchived\n      deletedAt\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n": typeof types.ArchiveChannelDocument,
    "\n  mutation AddChannelMembers($workspaceId: ID!, $channelId: ID!, $userIds: [ID!]!) {\n    addChannelMembers(workspaceId: $workspaceId, channelId: $channelId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n      members {\n        userId\n        user {\n          id\n          fullName\n          email\n          avatarUrl\n        }\n      }\n    }\n  }\n": typeof types.AddChannelMembersDocument,
    "\n  mutation RemoveChannelMember($workspaceId: ID!, $channelId: ID!, $userId: ID!) {\n    removeChannelMember(workspaceId: $workspaceId, channelId: $channelId, userId: $userId) {\n      success\n      channelId\n      userId\n    }\n  }\n": typeof types.RemoveChannelMemberDocument,
    "\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": typeof types.CheckChannelAvailabilityDocument,
    "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n": typeof types.CreateChannelDocument,
    "\n  mutation CreateDm($input: CreateDmInput!) {\n    createDm(input: $input) {\n      id\n      type\n      workspaceId\n      projectId\n    }\n  }\n": typeof types.CreateDmDocument,
    "\n  mutation DeleteChannel($workspaceId: ID!, $channelId: ID!) {\n    deleteChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n    }\n  }\n": typeof types.DeleteChannelDocument,
    "\n  query GetProjectDms($projectId: ID!, $workspaceId: ID!) {\n    getProjectDms(projectId: $projectId, workspaceId: $workspaceId) {\n      id\n      otherUser {\n        id\n        fullName\n        avatarUrl\n      }\n      unreadCount\n      updatedAt\n    }\n  }\n": typeof types.GetProjectDmsDocument,
    "\n  mutation RenameChannel($input: RenameChannelInput!) {\n    renameChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n": typeof types.RenameChannelDocument,
    "\n  mutation UnarchiveChannel($workspaceId: ID!, $channelId: ID!) {\n    unarchiveChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n      name\n    }\n  }\n": typeof types.UnarchiveChannelDocument,
    "\n  mutation UpdateChannelDescription($workspaceId: ID!, $channelId: ID!, $description: String) {\n    updateChannelDescription(workspaceId: $workspaceId, channelId: $channelId, description: $description) {\n      success\n      channelId\n      description\n    }\n  }\n": typeof types.UpdateChannelDescriptionDocument,
    "\n  mutation UpdateChannelVisibility($workspaceId: ID!, $channelId: ID!, $isPublic: Boolean!) {\n    updateChannelVisibility(workspaceId: $workspaceId, channelId: $channelId, isPublic: $isPublic) {\n      success\n      channelId\n      isPublic\n    }\n  }\n": typeof types.UpdateChannelVisibilityDocument,
    "\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n": typeof types.CreateWorkspaceDocument,
    "\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n": typeof types.InviteToWorkspaceDocument,
    "\n  query InviteMemberGetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      rank\n    }\n  }\n": typeof types.InviteMemberGetWorkspaceRolesDocument,
    "\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      issue {\n        id\n        ...IssueCardFields\n      }\n    }\n  }\n": typeof types.CreateIssueDocument,
    "\n  mutation MoveIssueStatus($input: MoveIssueStatusInput!) {\n    moveIssueStatus(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n": typeof types.MoveIssueStatusDocument,
    "\n  mutation ReorderIssue($input: ReorderIssueInput!) {\n    reorderIssue(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n": typeof types.ReorderIssueDocument,
    "\n  query GetIssue($issueId: ID!) {\n    getIssue(issueId: $issueId) {\n      ...IssueDetailFields\n    }\n  }\n": typeof types.GetIssueDocument,
    "\n  query GetIssueDescriptionUrl($issueId: ID!) {\n    getIssueDescriptionUrl(issueId: $issueId) {\n      url\n    }\n  }\n": typeof types.GetIssueDescriptionUrlDocument,
    "\n  mutation UpdateIssue($input: UpdateIssueInput!) {\n    updateIssue(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n": typeof types.UpdateIssueDocument,
    "\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      success\n    }\n  }\n": typeof types.DeleteIssueDocument,
    "\n  mutation RequestIssueDescriptionUpload($input: RequestIssueDescriptionUploadInput!) {\n    requestIssueDescriptionUpload(input: $input) {\n      presignedUrl\n      descriptionFileId\n    }\n  }\n": typeof types.RequestIssueDescriptionUploadDocument,
    "\n  mutation ConfirmIssueDescriptionUpload($input: ConfirmIssueDescriptionUploadInput!) {\n    confirmIssueDescriptionUpload(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n": typeof types.ConfirmIssueDescriptionUploadDocument,
    "\n  mutation CreateIssueLabel($input: CreateIssueLabelInput!) {\n    createIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n": typeof types.CreateIssueLabelDocument,
    "\n  mutation UpdateIssueLabel($input: UpdateIssueLabelInput!) {\n    updateIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n": typeof types.UpdateIssueLabelDocument,
    "\n  mutation DeleteIssueLabel($input: DeleteIssueLabelInput!) {\n    deleteIssueLabel(input: $input) {\n      success\n    }\n  }\n": typeof types.DeleteIssueLabelDocument,
    "\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n": typeof types.CreateIssueStatusDocument,
    "\n  mutation UpdateIssueStatus($input: UpdateIssueStatusInput!) {\n    updateIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n": typeof types.UpdateIssueStatusDocument,
    "\n  mutation ReorderIssueStatus($input: ReorderIssueStatusInput!) {\n    reorderIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n": typeof types.ReorderIssueStatusDocument,
    "\n  mutation DeleteIssueStatus($input: DeleteIssueStatusInput!) {\n    deleteIssueStatus(input: $input) {\n      success\n    }\n  }\n": typeof types.DeleteIssueStatusDocument,
    "\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n": typeof types.AcceptWorkspaceInviteDocument,
    "\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n": typeof types.GetWorkspaceInviteInfoDocument,
    "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n": typeof types.SyncUserDocument,
    "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n": typeof types.CreateOnboardingWorkspaceDocument,
    "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n": typeof types.OnboardingStatusDocument,
    "\n  mutation AddPageCollaborators($input: AddPageCollaboratorsInput!) {\n    addPageCollaborators(input: $input) {\n      addedCollaborators {\n        userId\n        role\n        user {\n          id\n          fullName\n          avatarUrl\n        }\n      }\n    }\n  }\n": typeof types.AddPageCollaboratorsDocument,
    "\n  mutation CreatePage($input: CreatePageInput!) {\n    createPage(input: $input) {\n      page {\n        id\n        title\n        workspaceId\n        projectId\n        parentId\n        icon\n        coverUrl\n        position\n        isArchived\n        isLocked\n        s3Key\n        createdBy\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.CreatePageDocument,
    "\n  mutation DeletePage($input: DeletePageInput!) {\n    deletePage(input: $input) {\n      success\n      pageId\n    }\n  }\n": typeof types.DeletePageDocument,
    "\n  query GetActivePageCollaborators($pageId: ID!) {\n    getActivePageCollaborators(pageId: $pageId) {\n      userId\n      role\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n": typeof types.GetActivePageCollaboratorsDocument,
    "\n  query GetPageCollaborators($pageId: ID!) {\n    getPageCollaborators(pageId: $pageId) {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.GetPageCollaboratorsDocument,
    "\n  query GetPage($pageId: ID!) {\n    getPage(pageId: $pageId) {\n      id\n      title\n      workspaceId\n      projectId\n      parentId\n      icon\n      coverUrl\n      position\n      isArchived\n      isLocked\n      s3Key\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetPageDocument,
    "\n  query GetProjectPages($projectId: ID!) {\n    getProjectPages(projectId: $projectId) {\n      ...PageWithChildren\n    }\n  }\n": typeof types.GetProjectPagesDocument,
    "\n  query GetPageSnapshot($pageId: ID!) {\n    getPageSnapshot(pageId: $pageId) {\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n": typeof types.GetPageSnapshotDocument,
    "\n  mutation RemovePageCollaborator($input: RemovePageCollaboratorInput!) {\n    removePageCollaborator(input: $input) {\n      success\n    }\n  }\n": typeof types.RemovePageCollaboratorDocument,
    "\n  mutation RenamePage($input: RenamePageInput!) {\n    renamePage(input: $input) {\n      page {\n        id\n        title\n        projectId\n        parentId\n        icon\n        position\n        isArchived\n        isLocked\n        updatedAt\n      }\n    }\n  }\n": typeof types.RenamePageDocument,
    "\n  mutation ReorderPage($input: ReorderPageInput!) {\n    reorderPage(input: $input) {\n      page {\n        id\n        position\n        parentId\n        updatedAt\n      }\n    }\n  }\n": typeof types.ReorderPageDocument,
    "\n  mutation ArchivePage($input: ArchivePageInput!) {\n    archivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n": typeof types.ArchivePageDocument,
    "\n  mutation UnarchivePage($input: UnarchivePageInput!) {\n    unarchivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n": typeof types.UnarchivePageDocument,
    "\n  mutation LockPage($input: LockPageInput!) {\n    lockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n": typeof types.LockPageDocument,
    "\n  mutation UnlockPage($input: UnlockPageInput!) {\n    unlockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n": typeof types.UnlockPageDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n": typeof types.CreateProjectDocument,
    "\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": typeof types.CheckSlugDocument,
    "\n  mutation CreateVaultFolder($input: CreateVaultFolderInput!) {\n    createVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": typeof types.CreateVaultFolderDocument,
    "\n  mutation DeleteVaultFile($input: DeleteVaultFileInput!) {\n    deleteVaultFile(input: $input) {\n      success\n      id\n    }\n  }\n": typeof types.DeleteVaultFileDocument,
    "\n  mutation DeleteVaultFolder($input: DeleteVaultFolderInput!) {\n    deleteVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n": typeof types.DeleteVaultFolderDocument,
    "\n  query GetVaultAncestors($folderId: ID!) {\n    getVaultAncestors(folderId: $folderId) {\n      ...VaultFolderFields\n    }\n  }\n": typeof types.GetVaultAncestorsDocument,
    "\n  query GetVaultChildren(\n    $projectId: ID!\n    $parentFolderId: ID\n    $cursor: ID\n    $limit: Int\n    $sortBy: VaultSortField\n    $sortDir: SortDirection\n  ) {\n    getVaultChildren(\n      projectId: $projectId\n      parentFolderId: $parentFolderId\n      cursor: $cursor\n      limit: $limit\n      sortBy: $sortBy\n      sortDir: $sortDir\n    ) {\n      folders {\n        ...VaultFolderFields\n      }\n      files {\n        ...VaultFileFields\n      }\n      totalFileCount\n      hasNextPage\n      nextCursor\n    }\n  }\n": typeof types.GetVaultChildrenDocument,
    "\n  query GetVaultDownloadUrl($fileId: ID!) {\n    getVaultDownloadUrl(fileId: $fileId) {\n      url\n      expiresAt\n    }\n  }\n": typeof types.GetVaultDownloadUrlDocument,
    "\n  query GetVaultNode($id: ID!, $type: VaultNodeType!) {\n    getVaultNode(id: $id, type: $type) {\n      ... on VaultFolder {\n        ...VaultFolderFields\n      }\n      ... on VaultFile {\n        ...VaultFileFields\n      }\n    }\n  }\n": typeof types.GetVaultNodeDocument,
    "\n  query GetVaultSidebar($projectId: ID!) {\n    getVaultSidebar(projectId: $projectId) {\n      pinnedFolders {\n        ...VaultFolderFields\n      }\n      systemFolders {\n        ...VaultFolderFields\n      }\n    }\n  }\n": typeof types.GetVaultSidebarDocument,
    "\n  query GetVaultUsage($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectLimitBytes\n      workspaceUsedBytes\n      workspaceLimitBytes\n      projectFileCount\n      projectFileCountLimit\n    }\n  }\n": typeof types.GetVaultUsageDocument,
    "\n  mutation MoveVaultFile($input: MoveVaultFileInput!) {\n    moveVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n": typeof types.MoveVaultFileDocument,
    "\n  mutation MoveVaultFolder($input: MoveVaultFolderInput!) {\n    moveVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": typeof types.MoveVaultFolderDocument,
    "\n  mutation PinVaultFolder($input: PinVaultFolderInput!) {\n    pinVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": typeof types.PinVaultFolderDocument,
    "\n  mutation RenameVaultFile($input: RenameVaultFileInput!) {\n    renameVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n": typeof types.RenameVaultFileDocument,
    "\n  mutation RenameVaultFolder($input: RenameVaultFolderInput!) {\n    renameVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": typeof types.RenameVaultFolderDocument,
    "\n  mutation UnpinVaultFolder($input: UnpinVaultFolderInput!) {\n    unpinVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n": typeof types.UnpinVaultFolderDocument,
    "\n  mutation RequestVaultUpload($input: RequestVaultUploadInput!) {\n    requestVaultUpload(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n": typeof types.RequestVaultUploadDocument,
    "\n  mutation ConfirmVaultUpload($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n        folderId\n        projectId\n        workspaceId\n        source\n        sourceId\n        uploader {\n          id\n          fullName\n          avatarUrl\n        }\n        confirmedAt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.ConfirmVaultUploadDocument,
    "\n  query GetWorkspaceInvites($workspaceId: ID!) {\n    workspaceInvites(workspaceId: $workspaceId) {\n      id\n      email\n      role\n      roleId\n      expiresAt\n      createdAt\n    }\n  }\n": typeof types.GetWorkspaceInvitesDocument,
    "\n  mutation CancelWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    cancelWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n": typeof types.CancelWorkspaceInviteDocument,
    "\n  mutation ResendWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    resendWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n": typeof types.ResendWorkspaceInviteDocument,
    "\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $roleId: ID!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, roleId: $roleId) {\n      id\n      role\n      roleId\n      roleRank\n    }\n  }\n": typeof types.UpdateWorkspaceMemberRoleDocument,
    "\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n": typeof types.RemoveWorkspaceMemberDocument,
    "\n  mutation AddBoardCollaborators($boardId: ID!, $userIds: [ID!]!) {\n    addBoardCollaborators(boardId: $boardId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n    }\n  }\n": typeof types.AddBoardCollaboratorsDocument,
    "\n  query GetBoardCollaborators($boardId: ID!) {\n    boardCollaborators(boardId: $boardId) {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.GetBoardCollaboratorsDocument,
    "\n  mutation ArchiveBoard($boardId: ID!) {\n    archiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n": typeof types.ArchiveBoardDocument,
    "\n  mutation CreateBoard($input: CreateBoardInput!) {\n    createBoard(input: $input) {\n      board {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        createdAt\n      }\n      addedCollaborators {\n        userId\n        joinedAt\n      }\n    }\n  }\n": typeof types.CreateBoardDocument,
    "\n  mutation DeleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId) {\n      success\n      boardId\n    }\n  }\n": typeof types.DeleteBoardDocument,
    "\n  query GetBoard($boardId: ID!) {\n    getBoard(boardId: $boardId) {\n      id\n      title\n      description\n      workspaceId\n      projectId\n      createdBy\n      createdAt\n      updatedAt\n      isLocked\n      isArchived\n    }\n  }\n": typeof types.GetBoardDocument,
    "\n  query GetActiveCollaborators($boardId: ID!) {\n    activeCollaborators(boardId: $boardId) {\n      userId\n      connectionId\n      joinedAt\n      lastSeenAt\n      cursorPosition {\n        x\n        y\n      }\n    }\n  }\n": typeof types.GetActiveCollaboratorsDocument,
    "\n  query GetBoardSnapshot($boardId: ID!, $clientSnapshot: String) {\n    getBoardSnapshot(boardId: $boardId, clientSnapshot: $clientSnapshot) {\n      boardId\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n": typeof types.GetBoardSnapshotDocument,
    "\n  query GetUserBoards($workspaceId: ID!, $projectId: ID, $limit: Int, $cursor: ID) {\n    userBoards(workspaceId: $workspaceId, projectId: $projectId, limit: $limit, cursor: $cursor) {\n      boards {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        elementCount\n        fileSizeBytes\n        isArchived\n        isLocked\n        createdBy\n        createdAt\n        updatedAt\n      }\n      nextCursor\n    }\n  }\n": typeof types.GetUserBoardsDocument,
    "\n  mutation LockBoard($boardId: ID!) {\n    lockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n": typeof types.LockBoardDocument,
    "\n  mutation RemoveBoardCollaborator($boardId: ID!, $userId: ID!) {\n    removeBoardCollaborator(boardId: $boardId, userId: $userId) {\n      success\n    }\n  }\n": typeof types.RemoveBoardCollaboratorDocument,
    "\n  mutation RenameBoard($boardId: ID!, $title: String!) {\n    renameBoard(boardId: $boardId, title: $title) {\n      id\n      title\n      updatedAt\n    }\n  }\n": typeof types.RenameBoardDocument,
    "\n  mutation UnarchiveBoard($boardId: ID!) {\n    unarchiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n": typeof types.UnarchiveBoardDocument,
    "\n  mutation UnlockBoard($boardId: ID!) {\n    unlockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n": typeof types.UnlockBoardDocument,
    "\n  mutation UpdateBoardDescription($boardId: ID!, $description: String) {\n    updateBoardDescription(boardId: $boardId, description: $description) {\n      id\n      description\n      updatedAt\n    }\n  }\n": typeof types.UpdateBoardDescriptionDocument,
    "\n  query GetWorkspaceSettings($workspaceId: ID!) {\n    workspaceById(workspaceId: $workspaceId) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n": typeof types.GetWorkspaceSettingsDocument,
    "\n  query GetWorkspaceRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      roleId\n      permissionId\n      effect\n      conditions\n      permission { id resource action description module }\n    }\n  }\n": typeof types.GetWorkspaceRolePermissionsDocument,
    "\n  query GetAllWorkspacePermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": typeof types.GetAllWorkspacePermissionsDocument,
    "\n  query GetWorkspacePermissions($workspaceId: ID!) {\n    workspacePermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": typeof types.GetWorkspacePermissionsDocument,
    "\n  mutation AssignWorkspaceRolePermission(\n    $roleId: ID!, $workspaceId: ID!, $permissionId: ID!, $effect: String, $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId,\n      effect: $effect, conditions: $conditions\n    ) {\n      roleId\n      permissionId\n      effect\n    }\n  }\n": typeof types.AssignWorkspaceRolePermissionDocument,
    "\n  mutation RemoveWorkspaceRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n": typeof types.RemoveWorkspaceRolePermissionDocument,
    "\n  mutation CreateWorkspaceRole($workspaceId: ID!, $input: CreateWorkspaceRoleInput!) {\n    createWorkspaceRole(workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n": typeof types.CreateWorkspaceRoleDocument,
    "\n  mutation UpdateWorkspaceRole($roleId: ID!, $workspaceId: ID!, $input: UpdateWorkspaceRoleInput!) {\n    updateWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n": typeof types.UpdateWorkspaceRoleDocument,
    "\n  mutation DeleteWorkspaceRole($roleId: ID!, $workspaceId: ID!) {\n    deleteWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId)\n  }\n": typeof types.DeleteWorkspaceRoleDocument,
    "\n  mutation RegisterExternalFile($input: RegisterExternalFileInput!) {\n    registerExternalFile(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n": typeof types.RegisterExternalFileDocument,
    "\n  mutation ConfirmVaultUploadExternal($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n      }\n    }\n  }\n": typeof types.ConfirmVaultUploadExternalDocument,
    "\n  query GetBatchDownloadUrls($fileIds: [ID!]!) {\n    getBatchDownloadUrls(fileIds: $fileIds) {\n      fileId\n      url\n      status\n      name\n      mimeType\n      sizeBytes\n    }\n  }\n": typeof types.GetBatchDownloadUrlsDocument,
    "\n  mutation MarkFilesUnreferenced($input: MarkFilesUnreferencedInput!) {\n    markFilesUnreferenced(input: $input) {\n      markedCount\n    }\n  }\n": typeof types.MarkFilesUnreferencedDocument,
    "\n  query GetVaultUsageShared($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectReservedBytes\n      projectLimitBytes\n      projectFileCount\n      projectFileCountLimit\n      workspaceUsedBytes\n      workspaceReservedBytes\n      workspaceLimitBytes\n      percentUsed\n    }\n  }\n": typeof types.GetVaultUsageSharedDocument,
    "\n  query GetActiveContext($workspaceId: ID!, $projectId: ID) {\n    activeContext(workspaceId: $workspaceId, projectId: $projectId) {\n      userId\n      workspaceId\n      projectId\n      workspaceRole\n      projectRole\n      grantedPermissions\n      featureFlags {\n        key\n        enabled\n      }\n    }\n  }\n": typeof types.GetActiveContextDocument,
    "\n  query GetProjectIssues($projectId: ID!) {\n    getProjectIssues(projectId: $projectId) {\n      ...IssueCardFields\n    }\n  }\n": typeof types.GetProjectIssuesDocument,
    "\n  query GetIssueStatuses($projectId: ID!) {\n    getIssueStatuses(projectId: $projectId) {\n      ...IssueStatusFields\n    }\n  }\n": typeof types.GetIssueStatusesDocument,
    "\n  query GetIssueLabels($projectId: ID!) {\n    getIssueLabels(projectId: $projectId) {\n      ...IssueLabelFields\n    }\n  }\n": typeof types.GetIssueLabelsDocument,
};
const documents: Documents = {
    "\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n": types.MessageRecoveryFieldsFragmentDoc,
    "\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n": types.GetMissingMessagesDocument,
    "\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n": types.GetHistoryDocument,
    "\n  fragment ConversationFields on Conversation {\n    id\n    type\n    name\n    description: topic\n    topic\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    isArchived\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n    members {\n      ...ConversationMemberFields\n    }\n  }\n": types.ConversationFieldsFragmentDoc,
    "\n  fragment ConversationMemberFields on ConversationMember {\n    userId\n    role\n    isMuted\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n": types.ConversationMemberFieldsFragmentDoc,
    "\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.GetUserConversationsDocument,
    "\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationFields\n      members {\n        ...ConversationMemberFields\n      }\n    }\n  }\n": types.GetConversationDocument,
    "\n  query GetUsersByIds($userIds: [ID!]!) {\n    getUsersByIds(userIds: $userIds) {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n": types.GetUsersByIdsDocument,
    "\n  fragment IssueLabelFields on IssueLabel {\n    id\n    projectId\n    name\n    color\n    createdAt\n  }\n": types.IssueLabelFieldsFragmentDoc,
    "\n  fragment IssueStatusFields on IssueStatus {\n    id\n    projectId\n    name\n    color\n    icon\n    position\n    isSystem\n    issueCount\n  }\n": types.IssueStatusFieldsFragmentDoc,
    "\n  fragment IssueCardFields on Issue {\n    id\n    number\n    title\n    priority\n    position\n    dueDate\n    updatedAt\n    status {\n      id\n      name\n      color\n      icon\n    }\n    assignee {\n      id\n      fullName\n      avatarUrl\n    }\n    labels {\n      id\n      name\n      color\n    }\n  }\n": types.IssueCardFieldsFragmentDoc,
    "\n  fragment IssueDetailFields on Issue {\n    ...IssueCardFields\n    descriptionS3Key\n    createdBy {\n      id\n      fullName\n      avatarUrl\n    }\n    createdAt\n  }\n": types.IssueDetailFieldsFragmentDoc,
    "\n  fragment PageFields on Page {\n    id\n    title\n    workspaceId\n    projectId\n    parentId\n    icon\n    coverUrl\n    position\n    isArchived\n    isLocked\n    s3Key\n    createdBy\n    createdAt\n    updatedAt\n  }\n": types.PageFieldsFragmentDoc,
    "\n  fragment PageWithCollaborators on Page {\n    ...PageFields\n    collaborators {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.PageWithCollaboratorsFragmentDoc,
    "\n  fragment PageWithChildren on Page {\n    ...PageFields\n    children {\n      ...PageFields\n      children {\n        ...PageFields\n        children {\n          ...PageFields\n        }\n      }\n    }\n  }\n": types.PageWithChildrenFragmentDoc,
    "\n  fragment ProjectMemberFields on ProjectMember {\n    id\n    userId\n    role\n    roleId\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n": types.ProjectMemberFieldsFragmentDoc,
    "\n  query GetProjectMembers($projectId: ID!) {\n    projectMembers(projectId: $projectId) {\n      ...ProjectMemberFields\n    }\n  }\n": types.GetProjectMembersDocument,
    "\n  mutation AddProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    addProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n": types.AddProjectMemberDocument,
    "\n  mutation RemoveProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!) {\n    removeProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId)\n  }\n": types.RemoveProjectMemberDocument,
    "\n  mutation UpdateProjectMemberRole($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    updateProjectMemberRole(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n": types.UpdateProjectMemberRoleDocument,
    "\n  mutation LeaveProject($projectId: ID!) {\n    leaveProject(projectId: $projectId)\n  }\n": types.LeaveProjectDocument,
    "\n  fragment ProjectRoleFields on ProjectRole {\n    id\n    name\n    rank\n    description\n    isSystem\n    scopeType\n  }\n": types.ProjectRoleFieldsFragmentDoc,
    "\n  fragment RolePermissionFields on RolePermission {\n    roleId\n    permissionId\n    effect\n    conditions\n    permission {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": types.RolePermissionFieldsFragmentDoc,
    "\n  query GetProjectRoles($projectId: ID!, $workspaceId: ID!) {\n    projectRoles(projectId: $projectId, workspaceId: $workspaceId) {\n      ...ProjectRoleFields\n    }\n  }\n": types.GetProjectRolesDocument,
    "\n  query GetRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      ...RolePermissionFields\n    }\n  }\n": types.GetRolePermissionsDocument,
    "\n  query GetAllPermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": types.GetAllPermissionsDocument,
    "\n  query GetProjectPermissions($workspaceId: ID!, $projectId: ID!) {\n    projectPermissions(workspaceId: $workspaceId, projectId: $projectId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": types.GetProjectPermissionsDocument,
    "\n  mutation CreateProjectRole(\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: CreateProjectRoleInput!\n  ) {\n    createProjectRole(\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n": types.CreateProjectRoleDocument,
    "\n  mutation UpdateProjectRole(\n    $roleId: ID!\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: UpdateProjectRoleInput!\n  ) {\n    updateProjectRole(\n      roleId: $roleId\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n": types.UpdateProjectRoleDocument,
    "\n  mutation DeleteProjectRole($roleId: ID!, $projectId: ID!, $workspaceId: ID!) {\n    deleteProjectRole(roleId: $roleId, projectId: $projectId, workspaceId: $workspaceId)\n  }\n": types.DeleteProjectRoleDocument,
    "\n  mutation AssignRolePermission(\n    $roleId: ID!\n    $workspaceId: ID!\n    $permissionId: ID!\n    $effect: String!\n    $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId\n      workspaceId: $workspaceId\n      permissionId: $permissionId\n      effect: $effect\n      conditions: $conditions\n    ) {\n      ...RolePermissionFields\n    }\n  }\n": types.AssignRolePermissionDocument,
    "\n  mutation RemoveRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n": types.RemoveRolePermissionDocument,
    "\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    isArchived\n    isPrivate\n    logoUrl\n    activePlugins\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n": types.ProjectFieldsFragmentDoc,
    "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n": types.GetProjectDocument,
    "\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n": types.MyProjectsDocument,
    "\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n": types.GetProjectBySlugDocument,
    "\n  query GetProjectOverview($projectId: ID!) {\n    projectOverview(projectId: $projectId) {\n      totalIssues\n      openIssues\n      completedIssues\n      overdueIssues\n      pageCount\n      memberCount\n      issuesByStatus {\n        statusId\n        name\n        color\n        icon\n        issueCount\n      }\n      recentIssues {\n        id\n        number\n        title\n        priority\n        dueDate\n        updatedAt\n        statusName\n        statusColor\n        assigneeId\n        assigneeName\n        assigneeAvatar\n      }\n      members {\n        userId\n        name\n        email\n        avatarUrl\n        roleName\n        roleRank\n        joinedAt\n      }\n      \n      issuesByPriority {\n        priority\n        count\n      }\n      upcomingIssues {\n        id\n        number\n        title\n        dueDate\n        assigneeName\n        assigneeAvatar\n        statusName\n        statusColor\n      }\n      recentPages {\n        id\n        title\n        emojiIcon\n        updatedAt\n        createdByName\n      }\n      recentVaultFiles {\n        id\n        name\n        mimeType\n        sizeBytes\n        createdByName\n        createdAt\n      }\n      recentWhiteboards {\n        id\n        title\n        elementCount\n        updatedAt\n        isLocked\n      }\n      vaultUsage {\n        usedBytes\n        fileCount\n      }\n      projectChannels {\n        id\n        name\n        topic\n        updatedAt\n      }\n    }\n  }\n": types.GetProjectOverviewDocument,
    "\n  query GetProjectContributorStats($projectId: ID!) {\n    projectContributorStats(projectId: $projectId) {\n      userId\n      name\n      avatarUrl\n      assigned\n      completed\n    }\n  }\n": types.GetProjectContributorStatsDocument,
    "\n  mutation UpdateProject($projectId: ID!, $input: UpdateProjectInput!) {\n    updateProject(projectId: $projectId, input: $input) {\n      ...ProjectFields\n    }\n  }\n": types.UpdateProjectDocument,
    "\n  mutation ArchiveProject($projectId: ID!) {\n    archiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n": types.ArchiveProjectDocument,
    "\n  mutation UnarchiveProject($projectId: ID!) {\n    unarchiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n": types.UnarchiveProjectDocument,
    "\n  mutation DeleteProject($projectId: ID!) {\n    deleteProject(projectId: $projectId)\n  }\n": types.DeleteProjectDocument,
    "\n  mutation ToggleProjectPlugin($projectId: ID!, $workspaceId: ID!, $type: String!, $enable: Boolean!) {\n    toggleProjectPlugin(projectId: $projectId, workspaceId: $workspaceId, type: $type, enable: $enable)\n  }\n": types.ToggleProjectPluginDocument,
    "\n  mutation RequestProjectLogoUpload($projectId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestProjectLogoUpload(projectId: $projectId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n": types.RequestProjectLogoUploadDocument,
    "\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }": types.SessionSyncUserDocument,
    "\n  query GetMe {\n    me {\n      ...User\n    }\n  }\n": types.GetMeDocument,
    "\n  fragment User on User {\n    id\n    email\n    fullName\n    avatarUrl\n    bio\n    timezone\n    language\n  }\n": types.UserFragmentDoc,
    "\n  mutation UpdateProfileMutation($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...User\n    }\n  }\n": types.UpdateProfileMutationDocument,
    "\n  fragment VaultFileFields on VaultFile {\n    id\n    projectId\n    workspaceId\n    folderId\n    uploaderUserId\n    name\n    mimeType\n    sizeBytes\n    s3Key\n    source\n    sourceId\n    status\n    uploader {\n      id\n      fullName\n      avatarUrl\n    }\n    confirmedAt\n    createdAt\n    updatedAt\n  }\n": types.VaultFileFieldsFragmentDoc,
    "\n  fragment VaultFolderFields on VaultFolder {\n    id\n    projectId\n    parentFolderId\n    name\n    isSystem\n    createdAt\n    updatedAt\n  }\n": types.VaultFolderFieldsFragmentDoc,
    "\n  fragment BoardFields on Whiteboard {\n    id\n    workspaceId\n    projectId\n    title\n    description\n    elementCount\n    fileSizeBytes\n    isArchived\n    isLocked\n    createdBy\n    createdAt\n    updatedAt\n  }\n": types.BoardFieldsFragmentDoc,
    "\n  fragment BoardWithCollaborators on Whiteboard {\n    ...BoardFields\n    collaborators {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.BoardWithCollaboratorsFragmentDoc,
    "\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    memberRole\n  }\n": types.WorkspaceFragmentFragmentDoc,
    "\n  fragment WorkspaceLightFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n": types.WorkspaceLightFragmentFragmentDoc,
    "\n  fragment WorkspaceSettingsFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    domainWhitelist\n    memberRole\n    createdAt\n    updatedAt\n  }\n": types.WorkspaceSettingsFragmentFragmentDoc,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n": types.GetMyWorkspacesDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceLightFragment\n    }\n  }\n": types.GetWorkspaceBySlugDocument,
    "\n  query GetWorkspaceOverview($workspaceId: ID!) {\n    workspaceOverview(workspaceId: $workspaceId) {\n      totalProjects\n      totalMembers\n      totalIssues\n      totalPages\n      totalChannels\n      activeProjects {\n        id\n        name\n        key\n        description\n        memberCount\n        openIssues\n        updatedAt\n      }\n      recentMembers {\n        userId\n        fullName\n        email\n        avatarUrl\n        roleName\n        joinedAt\n      }\n    }\n  }\n": types.GetWorkspaceOverviewDocument,
    "\n  query GetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      description\n      isSystem\n      rank\n    }\n  }\n": types.GetWorkspaceRolesDocument,
    "\n  mutation UpdateWorkspace($workspaceId: ID!, $input: UpdateWorkspaceInput!) {\n    updateWorkspace(workspaceId: $workspaceId, input: $input) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n": types.UpdateWorkspaceDocument,
    "\n  mutation RenameWorkspaceSlug($workspaceId: ID!, $slug: String!) {\n    renameWorkspaceSlug(workspaceId: $workspaceId, slug: $slug) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n": types.RenameWorkspaceSlugDocument,
    "\n  mutation RequestWorkspaceLogoUpload($workspaceId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestWorkspaceLogoUpload(workspaceId: $workspaceId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n": types.RequestWorkspaceLogoUploadDocument,
    "\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n      reservationId\n    }\n  }\n": types.CheckSlugAvailabilityDocument,
    "\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      roleId\n      roleRank\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.GetWorkspaceMembersDocument,
    "\n  mutation ArchiveChannel($input: ArchiveChannelInput!) {\n    archiveChannel(input: $input) {\n      id\n      name\n      type\n      isArchived\n      deletedAt\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n": types.ArchiveChannelDocument,
    "\n  mutation AddChannelMembers($workspaceId: ID!, $channelId: ID!, $userIds: [ID!]!) {\n    addChannelMembers(workspaceId: $workspaceId, channelId: $channelId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n      members {\n        userId\n        user {\n          id\n          fullName\n          email\n          avatarUrl\n        }\n      }\n    }\n  }\n": types.AddChannelMembersDocument,
    "\n  mutation RemoveChannelMember($workspaceId: ID!, $channelId: ID!, $userId: ID!) {\n    removeChannelMember(workspaceId: $workspaceId, channelId: $channelId, userId: $userId) {\n      success\n      channelId\n      userId\n    }\n  }\n": types.RemoveChannelMemberDocument,
    "\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": types.CheckChannelAvailabilityDocument,
    "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n": types.CreateChannelDocument,
    "\n  mutation CreateDm($input: CreateDmInput!) {\n    createDm(input: $input) {\n      id\n      type\n      workspaceId\n      projectId\n    }\n  }\n": types.CreateDmDocument,
    "\n  mutation DeleteChannel($workspaceId: ID!, $channelId: ID!) {\n    deleteChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n    }\n  }\n": types.DeleteChannelDocument,
    "\n  query GetProjectDms($projectId: ID!, $workspaceId: ID!) {\n    getProjectDms(projectId: $projectId, workspaceId: $workspaceId) {\n      id\n      otherUser {\n        id\n        fullName\n        avatarUrl\n      }\n      unreadCount\n      updatedAt\n    }\n  }\n": types.GetProjectDmsDocument,
    "\n  mutation RenameChannel($input: RenameChannelInput!) {\n    renameChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n": types.RenameChannelDocument,
    "\n  mutation UnarchiveChannel($workspaceId: ID!, $channelId: ID!) {\n    unarchiveChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n      name\n    }\n  }\n": types.UnarchiveChannelDocument,
    "\n  mutation UpdateChannelDescription($workspaceId: ID!, $channelId: ID!, $description: String) {\n    updateChannelDescription(workspaceId: $workspaceId, channelId: $channelId, description: $description) {\n      success\n      channelId\n      description\n    }\n  }\n": types.UpdateChannelDescriptionDocument,
    "\n  mutation UpdateChannelVisibility($workspaceId: ID!, $channelId: ID!, $isPublic: Boolean!) {\n    updateChannelVisibility(workspaceId: $workspaceId, channelId: $channelId, isPublic: $isPublic) {\n      success\n      channelId\n      isPublic\n    }\n  }\n": types.UpdateChannelVisibilityDocument,
    "\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n": types.CreateWorkspaceDocument,
    "\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n": types.InviteToWorkspaceDocument,
    "\n  query InviteMemberGetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      rank\n    }\n  }\n": types.InviteMemberGetWorkspaceRolesDocument,
    "\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      issue {\n        id\n        ...IssueCardFields\n      }\n    }\n  }\n": types.CreateIssueDocument,
    "\n  mutation MoveIssueStatus($input: MoveIssueStatusInput!) {\n    moveIssueStatus(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n": types.MoveIssueStatusDocument,
    "\n  mutation ReorderIssue($input: ReorderIssueInput!) {\n    reorderIssue(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n": types.ReorderIssueDocument,
    "\n  query GetIssue($issueId: ID!) {\n    getIssue(issueId: $issueId) {\n      ...IssueDetailFields\n    }\n  }\n": types.GetIssueDocument,
    "\n  query GetIssueDescriptionUrl($issueId: ID!) {\n    getIssueDescriptionUrl(issueId: $issueId) {\n      url\n    }\n  }\n": types.GetIssueDescriptionUrlDocument,
    "\n  mutation UpdateIssue($input: UpdateIssueInput!) {\n    updateIssue(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n": types.UpdateIssueDocument,
    "\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      success\n    }\n  }\n": types.DeleteIssueDocument,
    "\n  mutation RequestIssueDescriptionUpload($input: RequestIssueDescriptionUploadInput!) {\n    requestIssueDescriptionUpload(input: $input) {\n      presignedUrl\n      descriptionFileId\n    }\n  }\n": types.RequestIssueDescriptionUploadDocument,
    "\n  mutation ConfirmIssueDescriptionUpload($input: ConfirmIssueDescriptionUploadInput!) {\n    confirmIssueDescriptionUpload(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n": types.ConfirmIssueDescriptionUploadDocument,
    "\n  mutation CreateIssueLabel($input: CreateIssueLabelInput!) {\n    createIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n": types.CreateIssueLabelDocument,
    "\n  mutation UpdateIssueLabel($input: UpdateIssueLabelInput!) {\n    updateIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n": types.UpdateIssueLabelDocument,
    "\n  mutation DeleteIssueLabel($input: DeleteIssueLabelInput!) {\n    deleteIssueLabel(input: $input) {\n      success\n    }\n  }\n": types.DeleteIssueLabelDocument,
    "\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n": types.CreateIssueStatusDocument,
    "\n  mutation UpdateIssueStatus($input: UpdateIssueStatusInput!) {\n    updateIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n": types.UpdateIssueStatusDocument,
    "\n  mutation ReorderIssueStatus($input: ReorderIssueStatusInput!) {\n    reorderIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n": types.ReorderIssueStatusDocument,
    "\n  mutation DeleteIssueStatus($input: DeleteIssueStatusInput!) {\n    deleteIssueStatus(input: $input) {\n      success\n    }\n  }\n": types.DeleteIssueStatusDocument,
    "\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n": types.AcceptWorkspaceInviteDocument,
    "\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n": types.GetWorkspaceInviteInfoDocument,
    "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n": types.SyncUserDocument,
    "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n": types.CreateOnboardingWorkspaceDocument,
    "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n": types.OnboardingStatusDocument,
    "\n  mutation AddPageCollaborators($input: AddPageCollaboratorsInput!) {\n    addPageCollaborators(input: $input) {\n      addedCollaborators {\n        userId\n        role\n        user {\n          id\n          fullName\n          avatarUrl\n        }\n      }\n    }\n  }\n": types.AddPageCollaboratorsDocument,
    "\n  mutation CreatePage($input: CreatePageInput!) {\n    createPage(input: $input) {\n      page {\n        id\n        title\n        workspaceId\n        projectId\n        parentId\n        icon\n        coverUrl\n        position\n        isArchived\n        isLocked\n        s3Key\n        createdBy\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreatePageDocument,
    "\n  mutation DeletePage($input: DeletePageInput!) {\n    deletePage(input: $input) {\n      success\n      pageId\n    }\n  }\n": types.DeletePageDocument,
    "\n  query GetActivePageCollaborators($pageId: ID!) {\n    getActivePageCollaborators(pageId: $pageId) {\n      userId\n      role\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n": types.GetActivePageCollaboratorsDocument,
    "\n  query GetPageCollaborators($pageId: ID!) {\n    getPageCollaborators(pageId: $pageId) {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.GetPageCollaboratorsDocument,
    "\n  query GetPage($pageId: ID!) {\n    getPage(pageId: $pageId) {\n      id\n      title\n      workspaceId\n      projectId\n      parentId\n      icon\n      coverUrl\n      position\n      isArchived\n      isLocked\n      s3Key\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetPageDocument,
    "\n  query GetProjectPages($projectId: ID!) {\n    getProjectPages(projectId: $projectId) {\n      ...PageWithChildren\n    }\n  }\n": types.GetProjectPagesDocument,
    "\n  query GetPageSnapshot($pageId: ID!) {\n    getPageSnapshot(pageId: $pageId) {\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n": types.GetPageSnapshotDocument,
    "\n  mutation RemovePageCollaborator($input: RemovePageCollaboratorInput!) {\n    removePageCollaborator(input: $input) {\n      success\n    }\n  }\n": types.RemovePageCollaboratorDocument,
    "\n  mutation RenamePage($input: RenamePageInput!) {\n    renamePage(input: $input) {\n      page {\n        id\n        title\n        projectId\n        parentId\n        icon\n        position\n        isArchived\n        isLocked\n        updatedAt\n      }\n    }\n  }\n": types.RenamePageDocument,
    "\n  mutation ReorderPage($input: ReorderPageInput!) {\n    reorderPage(input: $input) {\n      page {\n        id\n        position\n        parentId\n        updatedAt\n      }\n    }\n  }\n": types.ReorderPageDocument,
    "\n  mutation ArchivePage($input: ArchivePageInput!) {\n    archivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n": types.ArchivePageDocument,
    "\n  mutation UnarchivePage($input: UnarchivePageInput!) {\n    unarchivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n": types.UnarchivePageDocument,
    "\n  mutation LockPage($input: LockPageInput!) {\n    lockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n": types.LockPageDocument,
    "\n  mutation UnlockPage($input: UnlockPageInput!) {\n    unlockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n": types.UnlockPageDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n": types.CreateProjectDocument,
    "\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": types.CheckSlugDocument,
    "\n  mutation CreateVaultFolder($input: CreateVaultFolderInput!) {\n    createVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": types.CreateVaultFolderDocument,
    "\n  mutation DeleteVaultFile($input: DeleteVaultFileInput!) {\n    deleteVaultFile(input: $input) {\n      success\n      id\n    }\n  }\n": types.DeleteVaultFileDocument,
    "\n  mutation DeleteVaultFolder($input: DeleteVaultFolderInput!) {\n    deleteVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n": types.DeleteVaultFolderDocument,
    "\n  query GetVaultAncestors($folderId: ID!) {\n    getVaultAncestors(folderId: $folderId) {\n      ...VaultFolderFields\n    }\n  }\n": types.GetVaultAncestorsDocument,
    "\n  query GetVaultChildren(\n    $projectId: ID!\n    $parentFolderId: ID\n    $cursor: ID\n    $limit: Int\n    $sortBy: VaultSortField\n    $sortDir: SortDirection\n  ) {\n    getVaultChildren(\n      projectId: $projectId\n      parentFolderId: $parentFolderId\n      cursor: $cursor\n      limit: $limit\n      sortBy: $sortBy\n      sortDir: $sortDir\n    ) {\n      folders {\n        ...VaultFolderFields\n      }\n      files {\n        ...VaultFileFields\n      }\n      totalFileCount\n      hasNextPage\n      nextCursor\n    }\n  }\n": types.GetVaultChildrenDocument,
    "\n  query GetVaultDownloadUrl($fileId: ID!) {\n    getVaultDownloadUrl(fileId: $fileId) {\n      url\n      expiresAt\n    }\n  }\n": types.GetVaultDownloadUrlDocument,
    "\n  query GetVaultNode($id: ID!, $type: VaultNodeType!) {\n    getVaultNode(id: $id, type: $type) {\n      ... on VaultFolder {\n        ...VaultFolderFields\n      }\n      ... on VaultFile {\n        ...VaultFileFields\n      }\n    }\n  }\n": types.GetVaultNodeDocument,
    "\n  query GetVaultSidebar($projectId: ID!) {\n    getVaultSidebar(projectId: $projectId) {\n      pinnedFolders {\n        ...VaultFolderFields\n      }\n      systemFolders {\n        ...VaultFolderFields\n      }\n    }\n  }\n": types.GetVaultSidebarDocument,
    "\n  query GetVaultUsage($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectLimitBytes\n      workspaceUsedBytes\n      workspaceLimitBytes\n      projectFileCount\n      projectFileCountLimit\n    }\n  }\n": types.GetVaultUsageDocument,
    "\n  mutation MoveVaultFile($input: MoveVaultFileInput!) {\n    moveVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n": types.MoveVaultFileDocument,
    "\n  mutation MoveVaultFolder($input: MoveVaultFolderInput!) {\n    moveVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": types.MoveVaultFolderDocument,
    "\n  mutation PinVaultFolder($input: PinVaultFolderInput!) {\n    pinVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": types.PinVaultFolderDocument,
    "\n  mutation RenameVaultFile($input: RenameVaultFileInput!) {\n    renameVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n": types.RenameVaultFileDocument,
    "\n  mutation RenameVaultFolder($input: RenameVaultFolderInput!) {\n    renameVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n": types.RenameVaultFolderDocument,
    "\n  mutation UnpinVaultFolder($input: UnpinVaultFolderInput!) {\n    unpinVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n": types.UnpinVaultFolderDocument,
    "\n  mutation RequestVaultUpload($input: RequestVaultUploadInput!) {\n    requestVaultUpload(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n": types.RequestVaultUploadDocument,
    "\n  mutation ConfirmVaultUpload($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n        folderId\n        projectId\n        workspaceId\n        source\n        sourceId\n        uploader {\n          id\n          fullName\n          avatarUrl\n        }\n        confirmedAt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.ConfirmVaultUploadDocument,
    "\n  query GetWorkspaceInvites($workspaceId: ID!) {\n    workspaceInvites(workspaceId: $workspaceId) {\n      id\n      email\n      role\n      roleId\n      expiresAt\n      createdAt\n    }\n  }\n": types.GetWorkspaceInvitesDocument,
    "\n  mutation CancelWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    cancelWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n": types.CancelWorkspaceInviteDocument,
    "\n  mutation ResendWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    resendWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n": types.ResendWorkspaceInviteDocument,
    "\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $roleId: ID!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, roleId: $roleId) {\n      id\n      role\n      roleId\n      roleRank\n    }\n  }\n": types.UpdateWorkspaceMemberRoleDocument,
    "\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n": types.RemoveWorkspaceMemberDocument,
    "\n  mutation AddBoardCollaborators($boardId: ID!, $userIds: [ID!]!) {\n    addBoardCollaborators(boardId: $boardId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n    }\n  }\n": types.AddBoardCollaboratorsDocument,
    "\n  query GetBoardCollaborators($boardId: ID!) {\n    boardCollaborators(boardId: $boardId) {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.GetBoardCollaboratorsDocument,
    "\n  mutation ArchiveBoard($boardId: ID!) {\n    archiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n": types.ArchiveBoardDocument,
    "\n  mutation CreateBoard($input: CreateBoardInput!) {\n    createBoard(input: $input) {\n      board {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        createdAt\n      }\n      addedCollaborators {\n        userId\n        joinedAt\n      }\n    }\n  }\n": types.CreateBoardDocument,
    "\n  mutation DeleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId) {\n      success\n      boardId\n    }\n  }\n": types.DeleteBoardDocument,
    "\n  query GetBoard($boardId: ID!) {\n    getBoard(boardId: $boardId) {\n      id\n      title\n      description\n      workspaceId\n      projectId\n      createdBy\n      createdAt\n      updatedAt\n      isLocked\n      isArchived\n    }\n  }\n": types.GetBoardDocument,
    "\n  query GetActiveCollaborators($boardId: ID!) {\n    activeCollaborators(boardId: $boardId) {\n      userId\n      connectionId\n      joinedAt\n      lastSeenAt\n      cursorPosition {\n        x\n        y\n      }\n    }\n  }\n": types.GetActiveCollaboratorsDocument,
    "\n  query GetBoardSnapshot($boardId: ID!, $clientSnapshot: String) {\n    getBoardSnapshot(boardId: $boardId, clientSnapshot: $clientSnapshot) {\n      boardId\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n": types.GetBoardSnapshotDocument,
    "\n  query GetUserBoards($workspaceId: ID!, $projectId: ID, $limit: Int, $cursor: ID) {\n    userBoards(workspaceId: $workspaceId, projectId: $projectId, limit: $limit, cursor: $cursor) {\n      boards {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        elementCount\n        fileSizeBytes\n        isArchived\n        isLocked\n        createdBy\n        createdAt\n        updatedAt\n      }\n      nextCursor\n    }\n  }\n": types.GetUserBoardsDocument,
    "\n  mutation LockBoard($boardId: ID!) {\n    lockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n": types.LockBoardDocument,
    "\n  mutation RemoveBoardCollaborator($boardId: ID!, $userId: ID!) {\n    removeBoardCollaborator(boardId: $boardId, userId: $userId) {\n      success\n    }\n  }\n": types.RemoveBoardCollaboratorDocument,
    "\n  mutation RenameBoard($boardId: ID!, $title: String!) {\n    renameBoard(boardId: $boardId, title: $title) {\n      id\n      title\n      updatedAt\n    }\n  }\n": types.RenameBoardDocument,
    "\n  mutation UnarchiveBoard($boardId: ID!) {\n    unarchiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n": types.UnarchiveBoardDocument,
    "\n  mutation UnlockBoard($boardId: ID!) {\n    unlockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n": types.UnlockBoardDocument,
    "\n  mutation UpdateBoardDescription($boardId: ID!, $description: String) {\n    updateBoardDescription(boardId: $boardId, description: $description) {\n      id\n      description\n      updatedAt\n    }\n  }\n": types.UpdateBoardDescriptionDocument,
    "\n  query GetWorkspaceSettings($workspaceId: ID!) {\n    workspaceById(workspaceId: $workspaceId) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n": types.GetWorkspaceSettingsDocument,
    "\n  query GetWorkspaceRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      roleId\n      permissionId\n      effect\n      conditions\n      permission { id resource action description module }\n    }\n  }\n": types.GetWorkspaceRolePermissionsDocument,
    "\n  query GetAllWorkspacePermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": types.GetAllWorkspacePermissionsDocument,
    "\n  query GetWorkspacePermissions($workspaceId: ID!) {\n    workspacePermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n": types.GetWorkspacePermissionsDocument,
    "\n  mutation AssignWorkspaceRolePermission(\n    $roleId: ID!, $workspaceId: ID!, $permissionId: ID!, $effect: String, $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId,\n      effect: $effect, conditions: $conditions\n    ) {\n      roleId\n      permissionId\n      effect\n    }\n  }\n": types.AssignWorkspaceRolePermissionDocument,
    "\n  mutation RemoveWorkspaceRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n": types.RemoveWorkspaceRolePermissionDocument,
    "\n  mutation CreateWorkspaceRole($workspaceId: ID!, $input: CreateWorkspaceRoleInput!) {\n    createWorkspaceRole(workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n": types.CreateWorkspaceRoleDocument,
    "\n  mutation UpdateWorkspaceRole($roleId: ID!, $workspaceId: ID!, $input: UpdateWorkspaceRoleInput!) {\n    updateWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n": types.UpdateWorkspaceRoleDocument,
    "\n  mutation DeleteWorkspaceRole($roleId: ID!, $workspaceId: ID!) {\n    deleteWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId)\n  }\n": types.DeleteWorkspaceRoleDocument,
    "\n  mutation RegisterExternalFile($input: RegisterExternalFileInput!) {\n    registerExternalFile(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n": types.RegisterExternalFileDocument,
    "\n  mutation ConfirmVaultUploadExternal($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n      }\n    }\n  }\n": types.ConfirmVaultUploadExternalDocument,
    "\n  query GetBatchDownloadUrls($fileIds: [ID!]!) {\n    getBatchDownloadUrls(fileIds: $fileIds) {\n      fileId\n      url\n      status\n      name\n      mimeType\n      sizeBytes\n    }\n  }\n": types.GetBatchDownloadUrlsDocument,
    "\n  mutation MarkFilesUnreferenced($input: MarkFilesUnreferencedInput!) {\n    markFilesUnreferenced(input: $input) {\n      markedCount\n    }\n  }\n": types.MarkFilesUnreferencedDocument,
    "\n  query GetVaultUsageShared($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectReservedBytes\n      projectLimitBytes\n      projectFileCount\n      projectFileCountLimit\n      workspaceUsedBytes\n      workspaceReservedBytes\n      workspaceLimitBytes\n      percentUsed\n    }\n  }\n": types.GetVaultUsageSharedDocument,
    "\n  query GetActiveContext($workspaceId: ID!, $projectId: ID) {\n    activeContext(workspaceId: $workspaceId, projectId: $projectId) {\n      userId\n      workspaceId\n      projectId\n      workspaceRole\n      projectRole\n      grantedPermissions\n      featureFlags {\n        key\n        enabled\n      }\n    }\n  }\n": types.GetActiveContextDocument,
    "\n  query GetProjectIssues($projectId: ID!) {\n    getProjectIssues(projectId: $projectId) {\n      ...IssueCardFields\n    }\n  }\n": types.GetProjectIssuesDocument,
    "\n  query GetIssueStatuses($projectId: ID!) {\n    getIssueStatuses(projectId: $projectId) {\n      ...IssueStatusFields\n    }\n  }\n": types.GetIssueStatusesDocument,
    "\n  query GetIssueLabels($projectId: ID!) {\n    getIssueLabels(projectId: $projectId) {\n      ...IssueLabelFields\n    }\n  }\n": types.GetIssueLabelsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n"): (typeof documents)["\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n"): (typeof documents)["\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n"): (typeof documents)["\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ConversationFields on Conversation {\n    id\n    type\n    name\n    description: topic\n    topic\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    isArchived\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n    members {\n      ...ConversationMemberFields\n    }\n  }\n"): (typeof documents)["\n  fragment ConversationFields on Conversation {\n    id\n    type\n    name\n    description: topic\n    topic\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    isArchived\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n    members {\n      ...ConversationMemberFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ConversationMemberFields on ConversationMember {\n    userId\n    role\n    isMuted\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  fragment ConversationMemberFields on ConversationMember {\n    userId\n    role\n    isMuted\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationFields\n      members {\n        ...ConversationMemberFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationFields\n      members {\n        ...ConversationMemberFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUsersByIds($userIds: [ID!]!) {\n    getUsersByIds(userIds: $userIds) {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  query GetUsersByIds($userIds: [ID!]!) {\n    getUsersByIds(userIds: $userIds) {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment IssueLabelFields on IssueLabel {\n    id\n    projectId\n    name\n    color\n    createdAt\n  }\n"): (typeof documents)["\n  fragment IssueLabelFields on IssueLabel {\n    id\n    projectId\n    name\n    color\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment IssueStatusFields on IssueStatus {\n    id\n    projectId\n    name\n    color\n    icon\n    position\n    isSystem\n    issueCount\n  }\n"): (typeof documents)["\n  fragment IssueStatusFields on IssueStatus {\n    id\n    projectId\n    name\n    color\n    icon\n    position\n    isSystem\n    issueCount\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment IssueCardFields on Issue {\n    id\n    number\n    title\n    priority\n    position\n    dueDate\n    updatedAt\n    status {\n      id\n      name\n      color\n      icon\n    }\n    assignee {\n      id\n      fullName\n      avatarUrl\n    }\n    labels {\n      id\n      name\n      color\n    }\n  }\n"): (typeof documents)["\n  fragment IssueCardFields on Issue {\n    id\n    number\n    title\n    priority\n    position\n    dueDate\n    updatedAt\n    status {\n      id\n      name\n      color\n      icon\n    }\n    assignee {\n      id\n      fullName\n      avatarUrl\n    }\n    labels {\n      id\n      name\n      color\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment IssueDetailFields on Issue {\n    ...IssueCardFields\n    descriptionS3Key\n    createdBy {\n      id\n      fullName\n      avatarUrl\n    }\n    createdAt\n  }\n"): (typeof documents)["\n  fragment IssueDetailFields on Issue {\n    ...IssueCardFields\n    descriptionS3Key\n    createdBy {\n      id\n      fullName\n      avatarUrl\n    }\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PageFields on Page {\n    id\n    title\n    workspaceId\n    projectId\n    parentId\n    icon\n    coverUrl\n    position\n    isArchived\n    isLocked\n    s3Key\n    createdBy\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment PageFields on Page {\n    id\n    title\n    workspaceId\n    projectId\n    parentId\n    icon\n    coverUrl\n    position\n    isArchived\n    isLocked\n    s3Key\n    createdBy\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PageWithCollaborators on Page {\n    ...PageFields\n    collaborators {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PageWithCollaborators on Page {\n    ...PageFields\n    collaborators {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PageWithChildren on Page {\n    ...PageFields\n    children {\n      ...PageFields\n      children {\n        ...PageFields\n        children {\n          ...PageFields\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PageWithChildren on Page {\n    ...PageFields\n    children {\n      ...PageFields\n      children {\n        ...PageFields\n        children {\n          ...PageFields\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProjectMemberFields on ProjectMember {\n    id\n    userId\n    role\n    roleId\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectMemberFields on ProjectMember {\n    id\n    userId\n    role\n    roleId\n    joinedAt\n    user {\n      id\n      fullName\n      email\n      avatarUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectMembers($projectId: ID!) {\n    projectMembers(projectId: $projectId) {\n      ...ProjectMemberFields\n    }\n  }\n"): (typeof documents)["\n  query GetProjectMembers($projectId: ID!) {\n    projectMembers(projectId: $projectId) {\n      ...ProjectMemberFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    addProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n"): (typeof documents)["\n  mutation AddProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    addProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!) {\n    removeProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId)\n  }\n"): (typeof documents)["\n  mutation RemoveProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!) {\n    removeProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateProjectMemberRole($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    updateProjectMemberRole(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProjectMemberRole($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {\n    updateProjectMemberRole(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {\n      ...ProjectMemberFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LeaveProject($projectId: ID!) {\n    leaveProject(projectId: $projectId)\n  }\n"): (typeof documents)["\n  mutation LeaveProject($projectId: ID!) {\n    leaveProject(projectId: $projectId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProjectRoleFields on ProjectRole {\n    id\n    name\n    rank\n    description\n    isSystem\n    scopeType\n  }\n"): (typeof documents)["\n  fragment ProjectRoleFields on ProjectRole {\n    id\n    name\n    rank\n    description\n    isSystem\n    scopeType\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment RolePermissionFields on RolePermission {\n    roleId\n    permissionId\n    effect\n    conditions\n    permission {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"): (typeof documents)["\n  fragment RolePermissionFields on RolePermission {\n    roleId\n    permissionId\n    effect\n    conditions\n    permission {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectRoles($projectId: ID!, $workspaceId: ID!) {\n    projectRoles(projectId: $projectId, workspaceId: $workspaceId) {\n      ...ProjectRoleFields\n    }\n  }\n"): (typeof documents)["\n  query GetProjectRoles($projectId: ID!, $workspaceId: ID!) {\n    projectRoles(projectId: $projectId, workspaceId: $workspaceId) {\n      ...ProjectRoleFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      ...RolePermissionFields\n    }\n  }\n"): (typeof documents)["\n  query GetRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      ...RolePermissionFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllPermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"): (typeof documents)["\n  query GetAllPermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectPermissions($workspaceId: ID!, $projectId: ID!) {\n    projectPermissions(workspaceId: $workspaceId, projectId: $projectId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"): (typeof documents)["\n  query GetProjectPermissions($workspaceId: ID!, $projectId: ID!) {\n    projectPermissions(workspaceId: $workspaceId, projectId: $projectId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProjectRole(\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: CreateProjectRoleInput!\n  ) {\n    createProjectRole(\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProjectRole(\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: CreateProjectRoleInput!\n  ) {\n    createProjectRole(\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateProjectRole(\n    $roleId: ID!\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: UpdateProjectRoleInput!\n  ) {\n    updateProjectRole(\n      roleId: $roleId\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProjectRole(\n    $roleId: ID!\n    $projectId: ID!\n    $workspaceId: ID!\n    $input: UpdateProjectRoleInput!\n  ) {\n    updateProjectRole(\n      roleId: $roleId\n      projectId: $projectId\n      workspaceId: $workspaceId\n      input: $input\n    ) {\n      ...ProjectRoleFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteProjectRole($roleId: ID!, $projectId: ID!, $workspaceId: ID!) {\n    deleteProjectRole(roleId: $roleId, projectId: $projectId, workspaceId: $workspaceId)\n  }\n"): (typeof documents)["\n  mutation DeleteProjectRole($roleId: ID!, $projectId: ID!, $workspaceId: ID!) {\n    deleteProjectRole(roleId: $roleId, projectId: $projectId, workspaceId: $workspaceId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AssignRolePermission(\n    $roleId: ID!\n    $workspaceId: ID!\n    $permissionId: ID!\n    $effect: String!\n    $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId\n      workspaceId: $workspaceId\n      permissionId: $permissionId\n      effect: $effect\n      conditions: $conditions\n    ) {\n      ...RolePermissionFields\n    }\n  }\n"): (typeof documents)["\n  mutation AssignRolePermission(\n    $roleId: ID!\n    $workspaceId: ID!\n    $permissionId: ID!\n    $effect: String!\n    $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId\n      workspaceId: $workspaceId\n      permissionId: $permissionId\n      effect: $effect\n      conditions: $conditions\n    ) {\n      ...RolePermissionFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n"): (typeof documents)["\n  mutation RemoveRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    isArchived\n    isPrivate\n    logoUrl\n    activePlugins\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    isArchived\n    isPrivate\n    logoUrl\n    activePlugins\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectOverview($projectId: ID!) {\n    projectOverview(projectId: $projectId) {\n      totalIssues\n      openIssues\n      completedIssues\n      overdueIssues\n      pageCount\n      memberCount\n      issuesByStatus {\n        statusId\n        name\n        color\n        icon\n        issueCount\n      }\n      recentIssues {\n        id\n        number\n        title\n        priority\n        dueDate\n        updatedAt\n        statusName\n        statusColor\n        assigneeId\n        assigneeName\n        assigneeAvatar\n      }\n      members {\n        userId\n        name\n        email\n        avatarUrl\n        roleName\n        roleRank\n        joinedAt\n      }\n      \n      issuesByPriority {\n        priority\n        count\n      }\n      upcomingIssues {\n        id\n        number\n        title\n        dueDate\n        assigneeName\n        assigneeAvatar\n        statusName\n        statusColor\n      }\n      recentPages {\n        id\n        title\n        emojiIcon\n        updatedAt\n        createdByName\n      }\n      recentVaultFiles {\n        id\n        name\n        mimeType\n        sizeBytes\n        createdByName\n        createdAt\n      }\n      recentWhiteboards {\n        id\n        title\n        elementCount\n        updatedAt\n        isLocked\n      }\n      vaultUsage {\n        usedBytes\n        fileCount\n      }\n      projectChannels {\n        id\n        name\n        topic\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjectOverview($projectId: ID!) {\n    projectOverview(projectId: $projectId) {\n      totalIssues\n      openIssues\n      completedIssues\n      overdueIssues\n      pageCount\n      memberCount\n      issuesByStatus {\n        statusId\n        name\n        color\n        icon\n        issueCount\n      }\n      recentIssues {\n        id\n        number\n        title\n        priority\n        dueDate\n        updatedAt\n        statusName\n        statusColor\n        assigneeId\n        assigneeName\n        assigneeAvatar\n      }\n      members {\n        userId\n        name\n        email\n        avatarUrl\n        roleName\n        roleRank\n        joinedAt\n      }\n      \n      issuesByPriority {\n        priority\n        count\n      }\n      upcomingIssues {\n        id\n        number\n        title\n        dueDate\n        assigneeName\n        assigneeAvatar\n        statusName\n        statusColor\n      }\n      recentPages {\n        id\n        title\n        emojiIcon\n        updatedAt\n        createdByName\n      }\n      recentVaultFiles {\n        id\n        name\n        mimeType\n        sizeBytes\n        createdByName\n        createdAt\n      }\n      recentWhiteboards {\n        id\n        title\n        elementCount\n        updatedAt\n        isLocked\n      }\n      vaultUsage {\n        usedBytes\n        fileCount\n      }\n      projectChannels {\n        id\n        name\n        topic\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectContributorStats($projectId: ID!) {\n    projectContributorStats(projectId: $projectId) {\n      userId\n      name\n      avatarUrl\n      assigned\n      completed\n    }\n  }\n"): (typeof documents)["\n  query GetProjectContributorStats($projectId: ID!) {\n    projectContributorStats(projectId: $projectId) {\n      userId\n      name\n      avatarUrl\n      assigned\n      completed\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateProject($projectId: ID!, $input: UpdateProjectInput!) {\n    updateProject(projectId: $projectId, input: $input) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProject($projectId: ID!, $input: UpdateProjectInput!) {\n    updateProject(projectId: $projectId, input: $input) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ArchiveProject($projectId: ID!) {\n    archiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n"): (typeof documents)["\n  mutation ArchiveProject($projectId: ID!) {\n    archiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnarchiveProject($projectId: ID!) {\n    unarchiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n"): (typeof documents)["\n  mutation UnarchiveProject($projectId: ID!) {\n    unarchiveProject(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteProject($projectId: ID!) {\n    deleteProject(projectId: $projectId)\n  }\n"): (typeof documents)["\n  mutation DeleteProject($projectId: ID!) {\n    deleteProject(projectId: $projectId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ToggleProjectPlugin($projectId: ID!, $workspaceId: ID!, $type: String!, $enable: Boolean!) {\n    toggleProjectPlugin(projectId: $projectId, workspaceId: $workspaceId, type: $type, enable: $enable)\n  }\n"): (typeof documents)["\n  mutation ToggleProjectPlugin($projectId: ID!, $workspaceId: ID!, $type: String!, $enable: Boolean!) {\n    toggleProjectPlugin(projectId: $projectId, workspaceId: $workspaceId, type: $type, enable: $enable)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RequestProjectLogoUpload($projectId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestProjectLogoUpload(projectId: $projectId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation RequestProjectLogoUpload($projectId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestProjectLogoUpload(projectId: $projectId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }"): (typeof documents)["\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    me {\n      ...User\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      ...User\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment User on User {\n    id\n    email\n    fullName\n    avatarUrl\n    bio\n    timezone\n    language\n  }\n"): (typeof documents)["\n  fragment User on User {\n    id\n    email\n    fullName\n    avatarUrl\n    bio\n    timezone\n    language\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateProfileMutation($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...User\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfileMutation($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...User\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment VaultFileFields on VaultFile {\n    id\n    projectId\n    workspaceId\n    folderId\n    uploaderUserId\n    name\n    mimeType\n    sizeBytes\n    s3Key\n    source\n    sourceId\n    status\n    uploader {\n      id\n      fullName\n      avatarUrl\n    }\n    confirmedAt\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment VaultFileFields on VaultFile {\n    id\n    projectId\n    workspaceId\n    folderId\n    uploaderUserId\n    name\n    mimeType\n    sizeBytes\n    s3Key\n    source\n    sourceId\n    status\n    uploader {\n      id\n      fullName\n      avatarUrl\n    }\n    confirmedAt\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment VaultFolderFields on VaultFolder {\n    id\n    projectId\n    parentFolderId\n    name\n    isSystem\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment VaultFolderFields on VaultFolder {\n    id\n    projectId\n    parentFolderId\n    name\n    isSystem\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BoardFields on Whiteboard {\n    id\n    workspaceId\n    projectId\n    title\n    description\n    elementCount\n    fileSizeBytes\n    isArchived\n    isLocked\n    createdBy\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment BoardFields on Whiteboard {\n    id\n    workspaceId\n    projectId\n    title\n    description\n    elementCount\n    fileSizeBytes\n    isArchived\n    isLocked\n    createdBy\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BoardWithCollaborators on Whiteboard {\n    ...BoardFields\n    collaborators {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BoardWithCollaborators on Whiteboard {\n    ...BoardFields\n    collaborators {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    memberRole\n  }\n"): (typeof documents)["\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    memberRole\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment WorkspaceLightFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n"): (typeof documents)["\n  fragment WorkspaceLightFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment WorkspaceSettingsFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    domainWhitelist\n    memberRole\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment WorkspaceSettingsFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n    domainWhitelist\n    memberRole\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n"): (typeof documents)["\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceLightFragment\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceLightFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceOverview($workspaceId: ID!) {\n    workspaceOverview(workspaceId: $workspaceId) {\n      totalProjects\n      totalMembers\n      totalIssues\n      totalPages\n      totalChannels\n      activeProjects {\n        id\n        name\n        key\n        description\n        memberCount\n        openIssues\n        updatedAt\n      }\n      recentMembers {\n        userId\n        fullName\n        email\n        avatarUrl\n        roleName\n        joinedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceOverview($workspaceId: ID!) {\n    workspaceOverview(workspaceId: $workspaceId) {\n      totalProjects\n      totalMembers\n      totalIssues\n      totalPages\n      totalChannels\n      activeProjects {\n        id\n        name\n        key\n        description\n        memberCount\n        openIssues\n        updatedAt\n      }\n      recentMembers {\n        userId\n        fullName\n        email\n        avatarUrl\n        roleName\n        joinedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      description\n      isSystem\n      rank\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      description\n      isSystem\n      rank\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateWorkspace($workspaceId: ID!, $input: UpdateWorkspaceInput!) {\n    updateWorkspace(workspaceId: $workspaceId, input: $input) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspace($workspaceId: ID!, $input: UpdateWorkspaceInput!) {\n    updateWorkspace(workspaceId: $workspaceId, input: $input) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RenameWorkspaceSlug($workspaceId: ID!, $slug: String!) {\n    renameWorkspaceSlug(workspaceId: $workspaceId, slug: $slug) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n"): (typeof documents)["\n  mutation RenameWorkspaceSlug($workspaceId: ID!, $slug: String!) {\n    renameWorkspaceSlug(workspaceId: $workspaceId, slug: $slug) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RequestWorkspaceLogoUpload($workspaceId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestWorkspaceLogoUpload(workspaceId: $workspaceId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation RequestWorkspaceLogoUpload($workspaceId: ID!, $mimeType: String!, $sizeBytes: Int!) {\n    requestWorkspaceLogoUpload(workspaceId: $workspaceId, mimeType: $mimeType, sizeBytes: $sizeBytes) {\n      presignedUrl\n      logoUrl\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n      reservationId\n    }\n  }\n"): (typeof documents)["\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n      reservationId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      roleId\n      roleRank\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      roleId\n      roleRank\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ArchiveChannel($input: ArchiveChannelInput!) {\n    archiveChannel(input: $input) {\n      id\n      name\n      type\n      isArchived\n      deletedAt\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation ArchiveChannel($input: ArchiveChannelInput!) {\n    archiveChannel(input: $input) {\n      id\n      name\n      type\n      isArchived\n      deletedAt\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddChannelMembers($workspaceId: ID!, $channelId: ID!, $userIds: [ID!]!) {\n    addChannelMembers(workspaceId: $workspaceId, channelId: $channelId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n      members {\n        userId\n        user {\n          id\n          fullName\n          email\n          avatarUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddChannelMembers($workspaceId: ID!, $channelId: ID!, $userIds: [ID!]!) {\n    addChannelMembers(workspaceId: $workspaceId, channelId: $channelId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n      members {\n        userId\n        user {\n          id\n          fullName\n          email\n          avatarUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveChannelMember($workspaceId: ID!, $channelId: ID!, $userId: ID!) {\n    removeChannelMember(workspaceId: $workspaceId, channelId: $channelId, userId: $userId) {\n      success\n      channelId\n      userId\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveChannelMember($workspaceId: ID!, $channelId: ID!, $userId: ID!) {\n    removeChannelMember(workspaceId: $workspaceId, channelId: $channelId, userId: $userId) {\n      success\n      channelId\n      userId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"): (typeof documents)["\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateDm($input: CreateDmInput!) {\n    createDm(input: $input) {\n      id\n      type\n      workspaceId\n      projectId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDm($input: CreateDmInput!) {\n    createDm(input: $input) {\n      id\n      type\n      workspaceId\n      projectId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteChannel($workspaceId: ID!, $channelId: ID!) {\n    deleteChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteChannel($workspaceId: ID!, $channelId: ID!) {\n    deleteChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectDms($projectId: ID!, $workspaceId: ID!) {\n    getProjectDms(projectId: $projectId, workspaceId: $workspaceId) {\n      id\n      otherUser {\n        id\n        fullName\n        avatarUrl\n      }\n      unreadCount\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetProjectDms($projectId: ID!, $workspaceId: ID!) {\n    getProjectDms(projectId: $projectId, workspaceId: $workspaceId) {\n      id\n      otherUser {\n        id\n        fullName\n        avatarUrl\n      }\n      unreadCount\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RenameChannel($input: RenameChannelInput!) {\n    renameChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation RenameChannel($input: RenameChannelInput!) {\n    renameChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnarchiveChannel($workspaceId: ID!, $channelId: ID!) {\n    unarchiveChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UnarchiveChannel($workspaceId: ID!, $channelId: ID!) {\n    unarchiveChannel(workspaceId: $workspaceId, channelId: $channelId) {\n      success\n      channelId\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateChannelDescription($workspaceId: ID!, $channelId: ID!, $description: String) {\n    updateChannelDescription(workspaceId: $workspaceId, channelId: $channelId, description: $description) {\n      success\n      channelId\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateChannelDescription($workspaceId: ID!, $channelId: ID!, $description: String) {\n    updateChannelDescription(workspaceId: $workspaceId, channelId: $channelId, description: $description) {\n      success\n      channelId\n      description\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateChannelVisibility($workspaceId: ID!, $channelId: ID!, $isPublic: Boolean!) {\n    updateChannelVisibility(workspaceId: $workspaceId, channelId: $channelId, isPublic: $isPublic) {\n      success\n      channelId\n      isPublic\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateChannelVisibility($workspaceId: ID!, $channelId: ID!, $isPublic: Boolean!) {\n    updateChannelVisibility(workspaceId: $workspaceId, channelId: $channelId, isPublic: $isPublic) {\n      success\n      channelId\n      isPublic\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n"): (typeof documents)["\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query InviteMemberGetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      rank\n    }\n  }\n"): (typeof documents)["\n  query InviteMemberGetWorkspaceRoles($workspaceId: ID!) {\n    workspaceRoles(workspaceId: $workspaceId) {\n      id\n      name\n      rank\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      issue {\n        id\n        ...IssueCardFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      issue {\n        id\n        ...IssueCardFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MoveIssueStatus($input: MoveIssueStatusInput!) {\n    moveIssueStatus(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation MoveIssueStatus($input: MoveIssueStatusInput!) {\n    moveIssueStatus(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ReorderIssue($input: ReorderIssueInput!) {\n    reorderIssue(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderIssue($input: ReorderIssueInput!) {\n    reorderIssue(input: $input) {\n      issue {\n        ...IssueCardFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIssue($issueId: ID!) {\n    getIssue(issueId: $issueId) {\n      ...IssueDetailFields\n    }\n  }\n"): (typeof documents)["\n  query GetIssue($issueId: ID!) {\n    getIssue(issueId: $issueId) {\n      ...IssueDetailFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIssueDescriptionUrl($issueId: ID!) {\n    getIssueDescriptionUrl(issueId: $issueId) {\n      url\n    }\n  }\n"): (typeof documents)["\n  query GetIssueDescriptionUrl($issueId: ID!) {\n    getIssueDescriptionUrl(issueId: $issueId) {\n      url\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateIssue($input: UpdateIssueInput!) {\n    updateIssue(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIssue($input: UpdateIssueInput!) {\n    updateIssue(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RequestIssueDescriptionUpload($input: RequestIssueDescriptionUploadInput!) {\n    requestIssueDescriptionUpload(input: $input) {\n      presignedUrl\n      descriptionFileId\n    }\n  }\n"): (typeof documents)["\n  mutation RequestIssueDescriptionUpload($input: RequestIssueDescriptionUploadInput!) {\n    requestIssueDescriptionUpload(input: $input) {\n      presignedUrl\n      descriptionFileId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ConfirmIssueDescriptionUpload($input: ConfirmIssueDescriptionUploadInput!) {\n    confirmIssueDescriptionUpload(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ConfirmIssueDescriptionUpload($input: ConfirmIssueDescriptionUploadInput!) {\n    confirmIssueDescriptionUpload(input: $input) {\n      issue {\n        ...IssueDetailFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssueLabel($input: CreateIssueLabelInput!) {\n    createIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssueLabel($input: CreateIssueLabelInput!) {\n    createIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateIssueLabel($input: UpdateIssueLabelInput!) {\n    updateIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIssueLabel($input: UpdateIssueLabelInput!) {\n    updateIssueLabel(input: $input) {\n      label {\n        ...IssueLabelFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIssueLabel($input: DeleteIssueLabelInput!) {\n    deleteIssueLabel(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIssueLabel($input: DeleteIssueLabelInput!) {\n    deleteIssueLabel(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateIssueStatus($input: UpdateIssueStatusInput!) {\n    updateIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIssueStatus($input: UpdateIssueStatusInput!) {\n    updateIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ReorderIssueStatus($input: ReorderIssueStatusInput!) {\n    reorderIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderIssueStatus($input: ReorderIssueStatusInput!) {\n    reorderIssueStatus(input: $input) {\n      status {\n        ...IssueStatusFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIssueStatus($input: DeleteIssueStatusInput!) {\n    deleteIssueStatus(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIssueStatus($input: DeleteIssueStatusInput!) {\n    deleteIssueStatus(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n"): (typeof documents)["\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddPageCollaborators($input: AddPageCollaboratorsInput!) {\n    addPageCollaborators(input: $input) {\n      addedCollaborators {\n        userId\n        role\n        user {\n          id\n          fullName\n          avatarUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddPageCollaborators($input: AddPageCollaboratorsInput!) {\n    addPageCollaborators(input: $input) {\n      addedCollaborators {\n        userId\n        role\n        user {\n          id\n          fullName\n          avatarUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePage($input: CreatePageInput!) {\n    createPage(input: $input) {\n      page {\n        id\n        title\n        workspaceId\n        projectId\n        parentId\n        icon\n        coverUrl\n        position\n        isArchived\n        isLocked\n        s3Key\n        createdBy\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePage($input: CreatePageInput!) {\n    createPage(input: $input) {\n      page {\n        id\n        title\n        workspaceId\n        projectId\n        parentId\n        icon\n        coverUrl\n        position\n        isArchived\n        isLocked\n        s3Key\n        createdBy\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeletePage($input: DeletePageInput!) {\n    deletePage(input: $input) {\n      success\n      pageId\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePage($input: DeletePageInput!) {\n    deletePage(input: $input) {\n      success\n      pageId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetActivePageCollaborators($pageId: ID!) {\n    getActivePageCollaborators(pageId: $pageId) {\n      userId\n      role\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetActivePageCollaborators($pageId: ID!) {\n    getActivePageCollaborators(pageId: $pageId) {\n      userId\n      role\n      user {\n        id\n        fullName\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPageCollaborators($pageId: ID!) {\n    getPageCollaborators(pageId: $pageId) {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPageCollaborators($pageId: ID!) {\n    getPageCollaborators(pageId: $pageId) {\n      userId\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPage($pageId: ID!) {\n    getPage(pageId: $pageId) {\n      id\n      title\n      workspaceId\n      projectId\n      parentId\n      icon\n      coverUrl\n      position\n      isArchived\n      isLocked\n      s3Key\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetPage($pageId: ID!) {\n    getPage(pageId: $pageId) {\n      id\n      title\n      workspaceId\n      projectId\n      parentId\n      icon\n      coverUrl\n      position\n      isArchived\n      isLocked\n      s3Key\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectPages($projectId: ID!) {\n    getProjectPages(projectId: $projectId) {\n      ...PageWithChildren\n    }\n  }\n"): (typeof documents)["\n  query GetProjectPages($projectId: ID!) {\n    getProjectPages(projectId: $projectId) {\n      ...PageWithChildren\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPageSnapshot($pageId: ID!) {\n    getPageSnapshot(pageId: $pageId) {\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n"): (typeof documents)["\n  query GetPageSnapshot($pageId: ID!) {\n    getPageSnapshot(pageId: $pageId) {\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemovePageCollaborator($input: RemovePageCollaboratorInput!) {\n    removePageCollaborator(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation RemovePageCollaborator($input: RemovePageCollaboratorInput!) {\n    removePageCollaborator(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RenamePage($input: RenamePageInput!) {\n    renamePage(input: $input) {\n      page {\n        id\n        title\n        projectId\n        parentId\n        icon\n        position\n        isArchived\n        isLocked\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RenamePage($input: RenamePageInput!) {\n    renamePage(input: $input) {\n      page {\n        id\n        title\n        projectId\n        parentId\n        icon\n        position\n        isArchived\n        isLocked\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ReorderPage($input: ReorderPageInput!) {\n    reorderPage(input: $input) {\n      page {\n        id\n        position\n        parentId\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderPage($input: ReorderPageInput!) {\n    reorderPage(input: $input) {\n      page {\n        id\n        position\n        parentId\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ArchivePage($input: ArchivePageInput!) {\n    archivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ArchivePage($input: ArchivePageInput!) {\n    archivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnarchivePage($input: UnarchivePageInput!) {\n    unarchivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UnarchivePage($input: UnarchivePageInput!) {\n    unarchivePage(input: $input) {\n      page {\n        id\n        isArchived\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LockPage($input: LockPageInput!) {\n    lockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LockPage($input: LockPageInput!) {\n    lockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnlockPage($input: UnlockPageInput!) {\n    unlockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UnlockPage($input: UnlockPageInput!) {\n    unlockPage(input: $input) {\n      page {\n        id\n        isLocked\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"): (typeof documents)["\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateVaultFolder($input: CreateVaultFolderInput!) {\n    createVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateVaultFolder($input: CreateVaultFolderInput!) {\n    createVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteVaultFile($input: DeleteVaultFileInput!) {\n    deleteVaultFile(input: $input) {\n      success\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteVaultFile($input: DeleteVaultFileInput!) {\n    deleteVaultFile(input: $input) {\n      success\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteVaultFolder($input: DeleteVaultFolderInput!) {\n    deleteVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteVaultFolder($input: DeleteVaultFolderInput!) {\n    deleteVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultAncestors($folderId: ID!) {\n    getVaultAncestors(folderId: $folderId) {\n      ...VaultFolderFields\n    }\n  }\n"): (typeof documents)["\n  query GetVaultAncestors($folderId: ID!) {\n    getVaultAncestors(folderId: $folderId) {\n      ...VaultFolderFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultChildren(\n    $projectId: ID!\n    $parentFolderId: ID\n    $cursor: ID\n    $limit: Int\n    $sortBy: VaultSortField\n    $sortDir: SortDirection\n  ) {\n    getVaultChildren(\n      projectId: $projectId\n      parentFolderId: $parentFolderId\n      cursor: $cursor\n      limit: $limit\n      sortBy: $sortBy\n      sortDir: $sortDir\n    ) {\n      folders {\n        ...VaultFolderFields\n      }\n      files {\n        ...VaultFileFields\n      }\n      totalFileCount\n      hasNextPage\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  query GetVaultChildren(\n    $projectId: ID!\n    $parentFolderId: ID\n    $cursor: ID\n    $limit: Int\n    $sortBy: VaultSortField\n    $sortDir: SortDirection\n  ) {\n    getVaultChildren(\n      projectId: $projectId\n      parentFolderId: $parentFolderId\n      cursor: $cursor\n      limit: $limit\n      sortBy: $sortBy\n      sortDir: $sortDir\n    ) {\n      folders {\n        ...VaultFolderFields\n      }\n      files {\n        ...VaultFileFields\n      }\n      totalFileCount\n      hasNextPage\n      nextCursor\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultDownloadUrl($fileId: ID!) {\n    getVaultDownloadUrl(fileId: $fileId) {\n      url\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  query GetVaultDownloadUrl($fileId: ID!) {\n    getVaultDownloadUrl(fileId: $fileId) {\n      url\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultNode($id: ID!, $type: VaultNodeType!) {\n    getVaultNode(id: $id, type: $type) {\n      ... on VaultFolder {\n        ...VaultFolderFields\n      }\n      ... on VaultFile {\n        ...VaultFileFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetVaultNode($id: ID!, $type: VaultNodeType!) {\n    getVaultNode(id: $id, type: $type) {\n      ... on VaultFolder {\n        ...VaultFolderFields\n      }\n      ... on VaultFile {\n        ...VaultFileFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultSidebar($projectId: ID!) {\n    getVaultSidebar(projectId: $projectId) {\n      pinnedFolders {\n        ...VaultFolderFields\n      }\n      systemFolders {\n        ...VaultFolderFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetVaultSidebar($projectId: ID!) {\n    getVaultSidebar(projectId: $projectId) {\n      pinnedFolders {\n        ...VaultFolderFields\n      }\n      systemFolders {\n        ...VaultFolderFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultUsage($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectLimitBytes\n      workspaceUsedBytes\n      workspaceLimitBytes\n      projectFileCount\n      projectFileCountLimit\n    }\n  }\n"): (typeof documents)["\n  query GetVaultUsage($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectLimitBytes\n      workspaceUsedBytes\n      workspaceLimitBytes\n      projectFileCount\n      projectFileCountLimit\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MoveVaultFile($input: MoveVaultFileInput!) {\n    moveVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation MoveVaultFile($input: MoveVaultFileInput!) {\n    moveVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MoveVaultFolder($input: MoveVaultFolderInput!) {\n    moveVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation MoveVaultFolder($input: MoveVaultFolderInput!) {\n    moveVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PinVaultFolder($input: PinVaultFolderInput!) {\n    pinVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation PinVaultFolder($input: PinVaultFolderInput!) {\n    pinVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RenameVaultFile($input: RenameVaultFileInput!) {\n    renameVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RenameVaultFile($input: RenameVaultFileInput!) {\n    renameVaultFile(input: $input) {\n      file {\n        ...VaultFileFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RenameVaultFolder($input: RenameVaultFolderInput!) {\n    renameVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RenameVaultFolder($input: RenameVaultFolderInput!) {\n    renameVaultFolder(input: $input) {\n      folder {\n        ...VaultFolderFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnpinVaultFolder($input: UnpinVaultFolderInput!) {\n    unpinVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UnpinVaultFolder($input: UnpinVaultFolderInput!) {\n    unpinVaultFolder(input: $input) {\n      success\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RequestVaultUpload($input: RequestVaultUploadInput!) {\n    requestVaultUpload(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation RequestVaultUpload($input: RequestVaultUploadInput!) {\n    requestVaultUpload(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ConfirmVaultUpload($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n        folderId\n        projectId\n        workspaceId\n        source\n        sourceId\n        uploader {\n          id\n          fullName\n          avatarUrl\n        }\n        confirmedAt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ConfirmVaultUpload($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n        folderId\n        projectId\n        workspaceId\n        source\n        sourceId\n        uploader {\n          id\n          fullName\n          avatarUrl\n        }\n        confirmedAt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceInvites($workspaceId: ID!) {\n    workspaceInvites(workspaceId: $workspaceId) {\n      id\n      email\n      role\n      roleId\n      expiresAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceInvites($workspaceId: ID!) {\n    workspaceInvites(workspaceId: $workspaceId) {\n      id\n      email\n      role\n      roleId\n      expiresAt\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CancelWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    cancelWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n"): (typeof documents)["\n  mutation CancelWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    cancelWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ResendWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    resendWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n"): (typeof documents)["\n  mutation ResendWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {\n    resendWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $roleId: ID!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, roleId: $roleId) {\n      id\n      role\n      roleId\n      roleRank\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $roleId: ID!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, roleId: $roleId) {\n      id\n      role\n      roleId\n      roleRank\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddBoardCollaborators($boardId: ID!, $userIds: [ID!]!) {\n    addBoardCollaborators(boardId: $boardId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n    }\n  }\n"): (typeof documents)["\n  mutation AddBoardCollaborators($boardId: ID!, $userIds: [ID!]!) {\n    addBoardCollaborators(boardId: $boardId, userIds: $userIds) {\n      success\n      addedCount\n      skippedCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBoardCollaborators($boardId: ID!) {\n    boardCollaborators(boardId: $boardId) {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBoardCollaborators($boardId: ID!) {\n    boardCollaborators(boardId: $boardId) {\n      userId\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ArchiveBoard($boardId: ID!) {\n    archiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation ArchiveBoard($boardId: ID!) {\n    archiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateBoard($input: CreateBoardInput!) {\n    createBoard(input: $input) {\n      board {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        createdAt\n      }\n      addedCollaborators {\n        userId\n        joinedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBoard($input: CreateBoardInput!) {\n    createBoard(input: $input) {\n      board {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        createdAt\n      }\n      addedCollaborators {\n        userId\n        joinedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId) {\n      success\n      boardId\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId) {\n      success\n      boardId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBoard($boardId: ID!) {\n    getBoard(boardId: $boardId) {\n      id\n      title\n      description\n      workspaceId\n      projectId\n      createdBy\n      createdAt\n      updatedAt\n      isLocked\n      isArchived\n    }\n  }\n"): (typeof documents)["\n  query GetBoard($boardId: ID!) {\n    getBoard(boardId: $boardId) {\n      id\n      title\n      description\n      workspaceId\n      projectId\n      createdBy\n      createdAt\n      updatedAt\n      isLocked\n      isArchived\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetActiveCollaborators($boardId: ID!) {\n    activeCollaborators(boardId: $boardId) {\n      userId\n      connectionId\n      joinedAt\n      lastSeenAt\n      cursorPosition {\n        x\n        y\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetActiveCollaborators($boardId: ID!) {\n    activeCollaborators(boardId: $boardId) {\n      userId\n      connectionId\n      joinedAt\n      lastSeenAt\n      cursorPosition {\n        x\n        y\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBoardSnapshot($boardId: ID!, $clientSnapshot: String) {\n    getBoardSnapshot(boardId: $boardId, clientSnapshot: $clientSnapshot) {\n      boardId\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n"): (typeof documents)["\n  query GetBoardSnapshot($boardId: ID!, $clientSnapshot: String) {\n    getBoardSnapshot(boardId: $boardId, clientSnapshot: $clientSnapshot) {\n      boardId\n      snapshot\n      lastStreamId\n      snapshotTimestamp\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserBoards($workspaceId: ID!, $projectId: ID, $limit: Int, $cursor: ID) {\n    userBoards(workspaceId: $workspaceId, projectId: $projectId, limit: $limit, cursor: $cursor) {\n      boards {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        elementCount\n        fileSizeBytes\n        isArchived\n        isLocked\n        createdBy\n        createdAt\n        updatedAt\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  query GetUserBoards($workspaceId: ID!, $projectId: ID, $limit: Int, $cursor: ID) {\n    userBoards(workspaceId: $workspaceId, projectId: $projectId, limit: $limit, cursor: $cursor) {\n      boards {\n        id\n        workspaceId\n        projectId\n        title\n        description\n        elementCount\n        fileSizeBytes\n        isArchived\n        isLocked\n        createdBy\n        createdAt\n        updatedAt\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LockBoard($boardId: ID!) {\n    lockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation LockBoard($boardId: ID!) {\n    lockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveBoardCollaborator($boardId: ID!, $userId: ID!) {\n    removeBoardCollaborator(boardId: $boardId, userId: $userId) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveBoardCollaborator($boardId: ID!, $userId: ID!) {\n    removeBoardCollaborator(boardId: $boardId, userId: $userId) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RenameBoard($boardId: ID!, $title: String!) {\n    renameBoard(boardId: $boardId, title: $title) {\n      id\n      title\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation RenameBoard($boardId: ID!, $title: String!) {\n    renameBoard(boardId: $boardId, title: $title) {\n      id\n      title\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnarchiveBoard($boardId: ID!) {\n    unarchiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UnarchiveBoard($boardId: ID!) {\n    unarchiveBoard(boardId: $boardId) {\n      id\n      isArchived\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnlockBoard($boardId: ID!) {\n    unlockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UnlockBoard($boardId: ID!) {\n    unlockBoard(boardId: $boardId) {\n      id\n      isLocked\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateBoardDescription($boardId: ID!, $description: String) {\n    updateBoardDescription(boardId: $boardId, description: $description) {\n      id\n      description\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBoardDescription($boardId: ID!, $description: String) {\n    updateBoardDescription(boardId: $boardId, description: $description) {\n      id\n      description\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceSettings($workspaceId: ID!) {\n    workspaceById(workspaceId: $workspaceId) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceSettings($workspaceId: ID!) {\n    workspaceById(workspaceId: $workspaceId) {\n      ...WorkspaceSettingsFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      roleId\n      permissionId\n      effect\n      conditions\n      permission { id resource action description module }\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceRolePermissions($roleId: ID!, $workspaceId: ID!) {\n    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {\n      roleId\n      permissionId\n      effect\n      conditions\n      permission { id resource action description module }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllWorkspacePermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"): (typeof documents)["\n  query GetAllWorkspacePermissions($workspaceId: ID!) {\n    allPermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspacePermissions($workspaceId: ID!) {\n    workspacePermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspacePermissions($workspaceId: ID!) {\n    workspacePermissions(workspaceId: $workspaceId) {\n      id\n      resource\n      action\n      description\n      module\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AssignWorkspaceRolePermission(\n    $roleId: ID!, $workspaceId: ID!, $permissionId: ID!, $effect: String, $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId,\n      effect: $effect, conditions: $conditions\n    ) {\n      roleId\n      permissionId\n      effect\n    }\n  }\n"): (typeof documents)["\n  mutation AssignWorkspaceRolePermission(\n    $roleId: ID!, $workspaceId: ID!, $permissionId: ID!, $effect: String, $conditions: String\n  ) {\n    assignRolePermission(\n      roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId,\n      effect: $effect, conditions: $conditions\n    ) {\n      roleId\n      permissionId\n      effect\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveWorkspaceRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n"): (typeof documents)["\n  mutation RemoveWorkspaceRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {\n    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateWorkspaceRole($workspaceId: ID!, $input: CreateWorkspaceRoleInput!) {\n    createWorkspaceRole(workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorkspaceRole($workspaceId: ID!, $input: CreateWorkspaceRoleInput!) {\n    createWorkspaceRole(workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateWorkspaceRole($roleId: ID!, $workspaceId: ID!, $input: UpdateWorkspaceRoleInput!) {\n    updateWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspaceRole($roleId: ID!, $workspaceId: ID!, $input: UpdateWorkspaceRoleInput!) {\n    updateWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId, input: $input) {\n      id\n      name\n      rank\n      description\n      isSystem\n      scopeType\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteWorkspaceRole($roleId: ID!, $workspaceId: ID!) {\n    deleteWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId)\n  }\n"): (typeof documents)["\n  mutation DeleteWorkspaceRole($roleId: ID!, $workspaceId: ID!) {\n    deleteWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RegisterExternalFile($input: RegisterExternalFileInput!) {\n    registerExternalFile(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterExternalFile($input: RegisterExternalFileInput!) {\n    registerExternalFile(input: $input) {\n      fileId\n      presignedUrl\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ConfirmVaultUploadExternal($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ConfirmVaultUploadExternal($input: ConfirmVaultUploadInput!) {\n    confirmVaultUpload(input: $input) {\n      file {\n        id\n        name\n        mimeType\n        sizeBytes\n        status\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBatchDownloadUrls($fileIds: [ID!]!) {\n    getBatchDownloadUrls(fileIds: $fileIds) {\n      fileId\n      url\n      status\n      name\n      mimeType\n      sizeBytes\n    }\n  }\n"): (typeof documents)["\n  query GetBatchDownloadUrls($fileIds: [ID!]!) {\n    getBatchDownloadUrls(fileIds: $fileIds) {\n      fileId\n      url\n      status\n      name\n      mimeType\n      sizeBytes\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MarkFilesUnreferenced($input: MarkFilesUnreferencedInput!) {\n    markFilesUnreferenced(input: $input) {\n      markedCount\n    }\n  }\n"): (typeof documents)["\n  mutation MarkFilesUnreferenced($input: MarkFilesUnreferencedInput!) {\n    markFilesUnreferenced(input: $input) {\n      markedCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVaultUsageShared($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectReservedBytes\n      projectLimitBytes\n      projectFileCount\n      projectFileCountLimit\n      workspaceUsedBytes\n      workspaceReservedBytes\n      workspaceLimitBytes\n      percentUsed\n    }\n  }\n"): (typeof documents)["\n  query GetVaultUsageShared($projectId: ID!) {\n    getVaultUsage(projectId: $projectId) {\n      projectUsedBytes\n      projectReservedBytes\n      projectLimitBytes\n      projectFileCount\n      projectFileCountLimit\n      workspaceUsedBytes\n      workspaceReservedBytes\n      workspaceLimitBytes\n      percentUsed\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetActiveContext($workspaceId: ID!, $projectId: ID) {\n    activeContext(workspaceId: $workspaceId, projectId: $projectId) {\n      userId\n      workspaceId\n      projectId\n      workspaceRole\n      projectRole\n      grantedPermissions\n      featureFlags {\n        key\n        enabled\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetActiveContext($workspaceId: ID!, $projectId: ID) {\n    activeContext(workspaceId: $workspaceId, projectId: $projectId) {\n      userId\n      workspaceId\n      projectId\n      workspaceRole\n      projectRole\n      grantedPermissions\n      featureFlags {\n        key\n        enabled\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectIssues($projectId: ID!) {\n    getProjectIssues(projectId: $projectId) {\n      ...IssueCardFields\n    }\n  }\n"): (typeof documents)["\n  query GetProjectIssues($projectId: ID!) {\n    getProjectIssues(projectId: $projectId) {\n      ...IssueCardFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIssueStatuses($projectId: ID!) {\n    getIssueStatuses(projectId: $projectId) {\n      ...IssueStatusFields\n    }\n  }\n"): (typeof documents)["\n  query GetIssueStatuses($projectId: ID!) {\n    getIssueStatuses(projectId: $projectId) {\n      ...IssueStatusFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIssueLabels($projectId: ID!) {\n    getIssueLabels(projectId: $projectId) {\n      ...IssueLabelFields\n    }\n  }\n"): (typeof documents)["\n  query GetIssueLabels($projectId: ID!) {\n    getIssueLabels(projectId: $projectId) {\n      ...IssueLabelFields\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;