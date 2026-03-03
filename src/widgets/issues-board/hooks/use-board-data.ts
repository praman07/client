/**
 * useBoardData — Seeds the Redux store by running 3 parallel queries on mount.
 *
 * GQL documents are cast to TypedDocumentNode<any, any> until `pnpm gen`
 * regenerates the codegen types for the new board queries.
 *
 * Queries fired:
 *   1. getIssueStatuses(projectId)  → dispatch(setStatuses)
 *   2. getIssueLabels(projectId)    → dispatch(setLabels)
 *   3. getProjectIssues(projectId)  → dispatch(setIssues)
 *
 * Returns { isLoading, isError, refetch } for the root board to render
 * skeleton / error state.
 *
 * Note: GQL return types are cast to `any` — they will resolve correctly
 * after `pnpm gen` regenerates the codegen types for the board queries.
 *
 * @layer Widgets
 */
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { issueKeys, setStatuses, setIssues, setLabels } from '@/entities/issue'
import { issueStatusKeys } from '@/entities/issue-status'
import { issueLabelKeys } from '@/entities/issue-label'
import type { AppDispatch } from '@/app/store'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import {
  GET_ISSUE_STATUSES,
  GET_ISSUE_LABELS,
  GET_PROJECT_ISSUES,
} from '../api/fragments'

/* eslint-disable @typescript-eslint/no-explicit-any */
const _GET_ISSUE_STATUSES = GET_ISSUE_STATUSES as TypedDocumentNode<
  any,
  { projectId: string }
>
const _GET_ISSUE_LABELS = GET_ISSUE_LABELS as TypedDocumentNode<
  any,
  { projectId: string }
>
const _GET_PROJECT_ISSUES = GET_PROJECT_ISSUES as TypedDocumentNode<
  any,
  { projectId: string }
>
/* eslint-enable */

export function useBoardData(projectId: string) {
  const { getToken } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  // ── Statuses ──────────────────────────────────────────────────────────────
  const statusesQ = useQuery({
    queryKey: issueStatusKeys.list(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const data: any = await GqlClient(token).request(_GET_ISSUE_STATUSES, {
        projectId,
      })
      return data.getIssueStatuses ?? []
    },
    staleTime: 30_000,
  })

  // ── Labels ────────────────────────────────────────────────────────────────
  const labelsQ = useQuery({
    queryKey: issueLabelKeys.list(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const data: any = await GqlClient(token).request(_GET_ISSUE_LABELS, {
        projectId,
      })
      return data.getIssueLabels ?? []
    },
    staleTime: 30_000,
  })

  // ── Issues ────────────────────────────────────────────────────────────────
  const issuesQ = useQuery({
    queryKey: issueKeys.list(projectId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const data: any = await GqlClient(token).request(_GET_PROJECT_ISSUES, {
        projectId,
      })
      return data.getProjectIssues ?? []
    },
    staleTime: 30_000,
  })

  // ── Seed Redux on data arrival ─────────────────────────────────────────────
  useEffect(() => {
    if (statusesQ.data) dispatch(setStatuses(statusesQ.data))
  }, [statusesQ.data, dispatch])

  useEffect(() => {
    if (labelsQ.data) dispatch(setLabels(labelsQ.data))
  }, [labelsQ.data, dispatch])

  useEffect(() => {
    if (issuesQ.data) dispatch(setIssues(issuesQ.data))
  }, [issuesQ.data, dispatch])

  return {
    isLoading: statusesQ.isLoading || labelsQ.isLoading || issuesQ.isLoading,
    isFetching:
      statusesQ.isFetching || labelsQ.isFetching || issuesQ.isFetching,
    isError: statusesQ.isError || labelsQ.isError || issuesQ.isError,
    refetch: () => {
      statusesQ.refetch()
      labelsQ.refetch()
      issuesQ.refetch()
    },
  }
}
