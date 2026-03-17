/**
 * useCreateIssueDescription — thin wrapper around useDescriptionUpload
 * scoped to the create-issue feature.
 *
 * Exposes the 3-step S3 upload flow and the isDescriptionEmpty helper
 * so the caller only needs one import.
 *
 * @layer Features
 */
export { useDescriptionUpload as useCreateIssueDescription } from '@/features/issues/edit-issue'
export { isDescriptionEmpty } from '../lib/description-helpers'
