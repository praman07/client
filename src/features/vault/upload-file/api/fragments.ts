import { gql } from '@/gql'

export const REQUEST_VAULT_UPLOAD = gql(`
  mutation RequestVaultUpload($input: RequestVaultUploadInput!) {
    requestVaultUpload(input: $input) {
      fileId
      presignedUrl
      expiresAt
    }
  }
`)

export const CONFIRM_VAULT_UPLOAD = gql(`
  mutation ConfirmVaultUpload($input: ConfirmVaultUploadInput!) {
    confirmVaultUpload(input: $input) {
      file {
        id
        name
        mimeType
        sizeBytes
        status
        folderId
        projectId
        workspaceId
        source
        sourceId
        uploader {
          id
          fullName
          avatarUrl
        }
        confirmedAt
        createdAt
        updatedAt
      }
    }
  }
`)
