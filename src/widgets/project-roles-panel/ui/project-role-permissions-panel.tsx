import { useState, useMemo, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Shield,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Switch } from '@/shared/ui/primitives/switch'
import { Badge } from '@/shared/ui/primitives/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/primitives/card'
import type { ProjectRole } from './project-role-list'
import { useUpdateProjectRole } from '@/features/project/update-project-role'
import {
  useAssignRolePermission,
  useRemoveRolePermission,
} from '@/features/project/manage-role-permissions'
import { usePermission, Guard } from '@/shared/lib/auth'

interface AvailablePermission {
  id: string
  name: string
  resource: string
  action: string
  module: string
}

interface ProjectRolePermissionsPanelProps {
  workspaceId: string
  projectId: string
  role: ProjectRole
  availablePermissions: AvailablePermission[]
  onDelete?: (roleId: string) => void
}

// ── Permission grouping ────────────────────────────────────────────────────────
// Groups are derived purely from the resource field, second segment.
// resource="project:member", action="add" → group "Member"
// resource="project", action="read"       → group "Project"

function getGroupLabel(resource: string): string {
  const parts = resource.split(':')
  // Second segment (e.g. "member" from "project:member"), fallback first segment
  const key = parts[1] ?? parts[0]
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')
}

function groupPermissions(permissions: AvailablePermission[]) {
  const groups = new Map<string, AvailablePermission[]>()
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
      <span className={cn('text-sm text-muted-foreground', className)}>
        {value || <span className="italic opacity-50">{placeholder}</span>}
      </span>
    )
  }

  if (editing) {
    const sharedProps = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      autoFocus: true,
      className: 'text-sm',
      placeholder,
    }
    return (
      <div className="flex items-start gap-1.5 flex-1 min-w-0">
        {multiline ? (
          <Textarea {...sharedProps} rows={2} onKeyDown={(e) => { if (e.key === 'Escape') cancel() }} />
        ) : (
          <Input {...sharedProps} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }} />
        )}
        <button onClick={commit} className="mt-1 p-1 rounded text-primary hover:bg-primary/10 shrink-0" type="button" title="Save">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button onClick={cancel} className="mt-1 p-1 rounded text-muted-foreground hover:bg-muted shrink-0" type="button" title="Cancel">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5 group/edit flex-1 min-w-0', className)}>
      <span className="text-sm truncate">
        {value || <span className="italic text-muted-foreground opacity-60">{placeholder}</span>}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="shrink-0 opacity-0 group-hover/edit:opacity-60 hover:opacity-100! transition-opacity p-0.5 rounded hover:bg-muted"
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
  permissions: AvailablePermission[]
  pendingPermIds: Set<string>
  onToggle: (id: string) => void
  disabled: boolean
  isSaving: boolean
}) {
  const [open, setOpen] = useState(true)
  const grantedCount = permissions.filter((p) => pendingPermIds.has(p.id)).length

  return (
    <div className="rounded-lg border bg-muted/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {groupName}
          </span>
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
            {grantedCount}/{permissions.length}
          </Badge>
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="divide-y">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className={cn(
                'flex items-center justify-between px-4 py-3 transition-colors',
                !disabled && 'hover:bg-muted/20'
              )}
            >
              <div className="space-y-0.5 flex-1 min-w-0 pr-4">
                <span className="text-sm font-medium">
                  {perm.name || `${perm.resource}:${perm.action}`}
                </span>
                <p className="text-[11px] text-muted-foreground font-mono">
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

export function ProjectRolePermissionsPanel({
  workspaceId,
  projectId,
  role,
  availablePermissions,
  onDelete,
}: ProjectRolePermissionsPanelProps) {
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description ?? '')
  const [rank, setRank] = useState(role.rank)
  const [pendingPermIds, setPendingPermIds] = useState<Set<string>>(
    new Set(role.permissions.map((p) => p.id))
  )
  const [isSaving, setIsSaving] = useState(false)

  const { mutateAsync: updateRole } = useUpdateProjectRole()
  const { mutateAsync: assignPerm } = useAssignRolePermission()
  const { mutateAsync: removePerm } = useRemoveRolePermission()

  // Permission gates (project-scoped)
  const canUpdateRole = usePermission('project:role:update')
  const canAssignPerm = usePermission('project:role:assign-permission')

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
      const promises: Promise<any>[] = []

      const identityChanged =
        canEditIdentity &&
        (name !== role.name || description !== (role.description ?? '') || rank !== role.rank)

      if (identityChanged) {
        promises.push(
          updateRole({ roleId: role.id, projectId, workspaceId, name, description: description || undefined, rank })
        )
      }

      const toAdd = [...pendingPermIds].filter((id) => !initialPermIds.has(id))
      const toRemove = [...initialPermIds].filter((id) => !pendingPermIds.has(id))
      for (const id of toAdd) {
        promises.push(assignPerm({ roleId: role.id, workspaceId, permissionId: id, effect: 'ALLOW' }))
      }
      for (const id of toRemove) {
        promises.push(removePerm({ roleId: role.id, workspaceId, permissionId: id }))
      }

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
    <Card className="flex flex-col h-full shadow-sm border-muted/60">
      {/* ── Header ── */}
      <CardHeader className="pb-3 border-b space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
              <Shield className="h-4 w-4 text-primary" />
            </div>

            {/* Role name — inline edit */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <EditableText
                value={name}
                onCommit={setName}
                disabled={!canEditIdentity}
                placeholder="Role name"
                className="font-semibold text-base"
              />
              {role.isSystem && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1.5 uppercase tracking-wide shrink-0">
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
                  className="h-8 text-xs flex-1 sm:flex-none"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-8 text-xs px-4 flex-1 sm:flex-none"
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </Button>
              </>
            )}
            {!role.isSystem && (
              <Guard permission="project:role:delete">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
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
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
            <EditableText
              value={description}
              onCommit={setDescription}
              disabled={!canEditIdentity}
              placeholder="Add a description…"
              multiline
            />
          </div>
          <div className="shrink-0 w-full sm:w-24">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Rank</p>
            {!canEditIdentity ? (
              <span className="text-sm text-muted-foreground">{rank}</span>
            ) : (
              <Input
                type="number"
                value={rank}
                onChange={(e) => {
                  if (e.target.value === '') return setRank(0)
                  let val = parseInt(e.target.value, 10)
                  if (isNaN(val)) return
                  if (val < 0) val = 0
                  if (val > 99) val = 99
                  setRank(val)
                }}
                disabled={isSaving}
                min={0}
                max={99}
                className="h-9 text-sm w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
          </div>
        </div>

        {role.isSystem && (
          <p className="pl-0 sm:pl-10 mt-3 sm:mt-2 text-xs text-muted-foreground italic">
            System roles are managed by Collabify and cannot be modified.
          </p>
        )}
      </CardHeader>

      {/* ── Permissions Matrix ── */}
      <CardContent className="flex-1 overflow-y-auto py-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Permissions
        </p>

        {availablePermissions.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            No project permissions available
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
