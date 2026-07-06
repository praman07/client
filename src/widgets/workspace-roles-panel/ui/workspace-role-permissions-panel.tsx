import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Shield,
  Trash2,
  X,
} from 'lucide-react'
import type { WorkspaceRole } from './workspace-role-list'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Switch } from '@/shared/ui/primitives/switch'
import { Badge } from '@/shared/ui/primitives/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/primitives/card'
import { useUpdateWorkspaceRole } from '@/features/workspace/manage-workspace-role'
import { useAssignRolePermission, useRemoveRolePermission } from '@/features/workspace/manage-role-permissions'
import { Guard, usePermission } from '@/shared/lib/auth'

interface AvailablePermission {
  id: string
  name: string
  resource: string
  action: string
  module: string
}

interface WorkspaceRolePermissionsPanelProps {
  workspaceId: string
  role: WorkspaceRole
  availablePermissions: Array<AvailablePermission>
  onDelete?: (roleId: string) => void
}

// ── Permission grouping ────────────────────────────────────────────────────────
const RESOURCE_GROUP_LABELS: Record<string, string> = {
  member: 'Members',
  invite: 'Invites',
  role: 'Roles',
  settings: 'Settings',
}

function getGroupLabel(resource: string): string {
  const parts = resource.split(':')
  const key = parts[1]
  return key ? (RESOURCE_GROUP_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)) : 'Workspace'
}

function groupPermissions(permissions: Array<AvailablePermission>) {
  const groups = new Map<string, Array<AvailablePermission>>()
  for (const perm of permissions) {
    const group = getGroupLabel(perm.resource)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(perm)
  }
  return groups
}

// ── Editable field ─────────────────────────────────────────────────────────────

interface EditableTextProps {
  value: string
  onCommit: (v: string) => void
  disabled?: boolean
  placeholder?: string
  multiline?: boolean
  className?: string
}

function EditableText({ value, onCommit, disabled, placeholder, multiline, className }: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => { setDraft(value) }, [value])

  const commit = () => { onCommit(draft); setEditing(false) }
  const cancel = () => { setDraft(value); setEditing(false) }

  if (disabled) {
    return (
      <span className={cn('text-14 text-secondary', className)}>
        {value || <span className="italic text-disabled">{placeholder}</span>}
      </span>
    )
  }

  if (editing) {
    const sharedProps = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      autoFocus: true,
      className: 'text-14',
      placeholder,
    }
    return (
      <div className="flex items-start gap-1.5 flex-1 min-w-0">
        {multiline ? (
          <Textarea {...sharedProps} rows={2} maxHeight="lg" onKeyDown={(e) => { if (e.key === 'Escape') cancel() }} />
        ) : (
          <Input {...sharedProps} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }} />
        )}
        <button onClick={commit} className="mt-1 p-1 rounded text-primary hover:bg-layer-2 shrink-0" type="button" title="Save">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button onClick={cancel} className="mt-1 p-1 rounded text-secondary hover:bg-layer-2 shrink-0" type="button" title="Cancel">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5 group/edit flex-1 min-w-0', className)}>
      <span className="text-14 truncate">
        {value || <span className="italic text-secondary opacity-60">{placeholder}</span>}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="shrink-0 opacity-0 group-hover/edit:opacity-60 hover:opacity-100! transition-opacity p-0.5 rounded hover:bg-layer-2"
        type="button"
        title="Edit"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  )
}

// ── Collapsible permission group ───────────────────────────────────────────────

function PermissionGroup({
  groupName,
  permissions,
  pendingPermIds,
  onToggle,
  disabled,
  isSaving,
}: {
  groupName: string
  permissions: Array<AvailablePermission>
  pendingPermIds: Set<string>
  onToggle: (id: string) => void
  disabled: boolean
  isSaving: boolean
}) {
  const [open, setOpen] = useState(true)
  const grantedCount = permissions.filter((p) => pendingPermIds.has(p.id)).length

  return (
    <div className="rounded-lg border border-subtle bg-layer-1 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-layer-2 hover:bg-layer-2-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            {groupName}
          </span>
          <Badge variant="default" className="text-[9px] h-4 px-1.5">
            {grantedCount}/{permissions.length}
          </Badge>
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-secondary" />}
      </button>

      {open && (
        <div className="divide-y divide-subtle">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className={cn(
                'flex items-center justify-between px-4 py-3 transition-colors',
                !disabled && 'hover:bg-layer-1-hover'
              )}
            >
              <div className="space-y-0.5 flex-1 min-w-0 pr-4">
                <span className="text-14 font-medium">
                  {perm.name || `${perm.resource}:${perm.action}`}
                </span>
                <p className="text-[11px] text-secondary font-mono">
                  {perm.resource}:{perm.action}
                </p>
              </div>
              <Switch
                checked={pendingPermIds.has(perm.id)}
                onCheckedChange={() => onToggle(perm.id)}
                disabled={disabled || isSaving}
                className="shrink-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Panel ─────────────────────────────────────────────────────────────────

export function WorkspaceRolePermissionsPanel({
  workspaceId,
  role,
  availablePermissions,
  onDelete,
}: WorkspaceRolePermissionsPanelProps) {
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description ?? '')
  const [rank, setRank] = useState<number | undefined>(role.rank)
  const [pendingPermIds, setPendingPermIds] = useState<Set<string>>(
    new Set(role.permissions.map((p) => p.id))
  )
  const [isSaving, setIsSaving] = useState(false)

  const { mutateAsync: updateRole } = useUpdateWorkspaceRole(workspaceId)
  const { mutateAsync: assignPerm } = useAssignRolePermission(workspaceId, role.id)
  const { mutateAsync: removePerm } = useRemoveRolePermission(workspaceId, role.id)

  const canUpdateRole = usePermission('workspace:role:update')
  const canAssignPerm = usePermission('workspace:role:assign-permission')

  const canEditIdentity = canUpdateRole && !role.isSystem
  const canEditPerms    = canAssignPerm  && !role.isSystem
  const canSave = (canUpdateRole || canAssignPerm) && !role.isSystem

  useEffect(() => {
    setName(role.name)
    setDescription(role.description ?? '')
    setRank(role.rank)
    setPendingPermIds(new Set(role.permissions.map((p) => p.id)))
  }, [role])

  const initialPermIds = useMemo(() => new Set(role.permissions.map((p) => p.id)), [role])

  const isDirty = useMemo(() => {
    if (name !== role.name) return true
    if (description !== (role.description ?? '')) return true
    if (rank !== role.rank) return true
    if (pendingPermIds.size !== initialPermIds.size) return true
    for (const id of pendingPermIds) {
      if (!initialPermIds.has(id)) return true
    }
    return false
  }, [name, description, rank, pendingPermIds, initialPermIds, role])

  const handleToggle = useCallback(
    (permId: string) => {
      if (role.isSystem || !canAssignPerm) return
      setPendingPermIds((prev) => {
        const next = new Set(prev)
        if (next.has(permId)) next.delete(permId)
        else next.add(permId)
        return next
      })
    },
    [role.isSystem, canAssignPerm]
  )

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const promises: Array<Promise<any>> = []

      const identityChanged =
        canEditIdentity &&
        (name !== role.name || description !== (role.description ?? '') || rank !== role.rank)

      if (identityChanged) {
        promises.push(
          updateRole({ roleId: role.id, input: { name, description: description || undefined, rank } })
        )
      }

      const toAdd = [...pendingPermIds].filter((id) => !initialPermIds.has(id))
      const toRemove = [...initialPermIds].filter((id) => !pendingPermIds.has(id))
      for (const id of toAdd) promises.push(assignPerm({ permissionId: id }))
      for (const id of toRemove) promises.push(removePerm(id))

      await Promise.all(promises)
      toast.success('Changes saved')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setName(role.name)
    setDescription(role.description ?? '')
    setRank(role.rank)
    setPendingPermIds(new Set(role.permissions.map((p) => p.id)))
  }

  const groupedPermissions = useMemo(
    () => groupPermissions(availablePermissions),
    [availablePermissions]
  )

  return (
    <Card className="flex flex-col h-full shadow-raised-100 border border-subtle min-w-[500px] w-full">
      {/* ── Header ── */}
      <CardHeader className="pb-3 px-3 lg:px-4 space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="p-1.5 rounded-lg bg-layer-2 shrink-0">
              <Shield className="h-4 w-4 text-primary" />
            </div>

            {/* Role name — inline edit */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <EditableText
                value={name}
                onCommit={setName}
                disabled={!canEditIdentity}
                placeholder="Role name"
                className="font-semibold text-16"
              />
              {role.isSystem && (
                <Badge variant="outline" className="text-[9px] h-4 px-1.5 uppercase tracking-wide shrink-0">
                  System
                </Badge>
              )}
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto sm:ml-auto justify-end">
            {isDirty && canSave && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-8 text-12 flex-1 sm:flex-none"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-8 text-12 px-4 flex-1 sm:flex-none"
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </Button>
              </>
            )}
            {!role.isSystem && (
              <Guard permission="workspace:role:delete">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-danger-primary hover:bg-danger-subtle shrink-0"
                  onClick={() => onDelete?.(role.id)}
                  disabled={isSaving}
                  title="Delete role"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Guard>
            )}
          </div>
        </div>

        {/* Description + Rank row — inline edit */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pt-4 sm:pt-3 pl-0 sm:pl-10">
          <div className="flex-1 min-w-0 w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Description</p>
            <EditableText
              value={description}
              onCommit={setDescription}
              disabled={!canEditIdentity}
              placeholder="Add a description…"
              multiline
            />
          </div>
          <div className="shrink-0 w-full sm:w-24">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-1">Rank</p>
            {!canEditIdentity ? (
              <span className="text-14 text-secondary">{rank}</span>
            ) : (
              <Input
                type="number"
                value={rank}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setRank(undefined)
                    return
                  }
                  let val = parseInt(e.target.value, 10)
                  if (isNaN(val)) return
                  if (val < 0) val = 0
                  if (val > 99) val = 99
                  setRank(val)
                }}
                disabled={isSaving}
                min={0}
                max={99}
                className="h-9 text-14 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
          </div>
        </div>

        {role.isSystem && (
          <p className="pl-0 sm:pl-10 mt-3 sm:mt-2 text-12 text-secondary italic">
            System roles are managed by Collabifyy and cannot be modified.
          </p>
        )}
      </CardHeader>

      {/* ── Permissions Matrix ── */}
      <CardContent className="flex-1 overflow-y-auto py-4 lg:py-5 px-3 lg:px-4 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-4">
          Permissions
        </p>

        {availablePermissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="h-10 w-10 text-secondary opacity-30 mb-3" />
            <p className="text-14 text-secondary">No workspace permissions available</p>
          </div>
        ) : (
          Array.from(groupedPermissions.entries()).map(([groupName, perms]) => (
            <PermissionGroup
              key={groupName}
              groupName={groupName}
              permissions={perms}
              pendingPermIds={pendingPermIds}
              onToggle={handleToggle}
              disabled={!canEditPerms}
              isSaving={isSaving}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
