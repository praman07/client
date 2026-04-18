import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { CreateProjectRoleFormValues } from '../model/schema'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  ScrollArea,
  Textarea,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useProjectPermissionsCatalog } from '@/features/project/manage-role-permissions'
import { useProjectMembers } from '@/entities/project-member'

// ─── Step 1: Role Details ────────────────────────────────────────────────────

interface StepRoleDetailsProps {
  values: CreateProjectRoleFormValues
  onChange: (field: keyof CreateProjectRoleFormValues, value: any) => void
  errors: Partial<Record<keyof CreateProjectRoleFormValues, string>>
}

export function StepRoleDetails({
  values,
  onChange,
  errors,
}: StepRoleDetailsProps) {
  return (
    <div className="space-y-5 py-2">
      <div className="grid grid-cols-[1fr_140px] gap-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label>
            Role Name <span className="text-danger-primary">*</span>
          </Label>
          <Input
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Tech Lead, QA Engineer"
          />
          {errors.name && (
            <p className="text-13 text-danger-primary">{errors.name}</p>
          )}
        </div>

        {/* Rank */}
        <div className="space-y-1.5">
          <Label>Rank</Label>
          <Input
            type="number"
            min={2}
            max={98}
            value={values.rank}
            onChange={(e) => onChange('rank', Number(e.target.value))}
          />
          <p className="text-11 text-secondary leading-tight">
            Lower = higher authority.
            <br />
            MANAGER is rank 1.
          </p>
          {errors.rank && (
            <p className="text-13 text-danger-primary">{errors.rank}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label>
          Description{' '}
          <span className="text-secondary text-11">(optional)</span>
        </Label>
        <Textarea
          value={values.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Briefly describe what this role can do..."
          rows={3}
          className="resize-none"
        />
        {errors.description && (
          <p className="text-13 text-danger-primary">{errors.description}</p>
        )}
      </div>
    </div>
  )
}

// ─── Step 2: Permissions ─────────────────────────────────────────────────────

interface StepPermissionsProps {
  workspaceId: string
  projectId: string
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onToggleResource: (ids: Array<string>) => void
  onToggleAll: (ids: Array<string>, selectAll: boolean) => void
}

export function StepPermissions({
  workspaceId,
  projectId,
  selectedIds,
  onToggle,
  onToggleResource,
  onToggleAll,
}: StepPermissionsProps) {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useProjectPermissionsCatalog(workspaceId, projectId)
  const allPermissions = useMemo(
    () => data ?? [],
    [data],
  )

  const byResource = useMemo(() => {
    const lower = search.toLowerCase()
    const filtered = lower
      ? allPermissions.filter(
          (p) =>
            p.resource.toLowerCase().includes(lower) ||
            p.action.toLowerCase().includes(lower),
        )
      : allPermissions
    const grouped: Record<string, typeof allPermissions> = {}
    for (const p of filtered) {
      grouped[p.resource] = [...(grouped[p.resource] ?? []), p]
    }
    return grouped
  }, [allPermissions, search])

  const allFilteredIds = Object.values(byResource)
    .flat()
    .map((p) => p.id)
  const allSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedIds.has(id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-13 text-secondary animate-pulse py-10">
        Loading permissions...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary" />
          <Input
            className="pl-8 h-9"
            placeholder="Search permissions or resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onToggleAll(allFilteredIds, !allSelected)}
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </Button>
        <span className="text-11 text-secondary shrink-0 tabular-nums">
          {selectedIds.size} selected
        </span>
      </div>

      {/* Resource grid */}
      <ScrollArea className="h-[380px] -mx-1 px-1">
        {Object.keys(byResource).length === 0 ? (
          <p className="text-13 text-secondary text-center py-10">
            No permissions match.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 pb-2">
            {Object.entries(byResource).map(([resource, perms]) => {
              const ids = perms.map((p) => p.id)
              const allGroupSelected = ids.every((id) => selectedIds.has(id))
              const someGroupSelected =
                ids.some((id) => selectedIds.has(id)) && !allGroupSelected
              return (
                <div
                  key={resource}
                  className={cn(
'rounded-lg border border-subtle p-3 space-y-2.5 transition-colors',
                    allGroupSelected
                      ? 'border-accent-subtle bg-accent-subtle'
                      : someGroupSelected
                        ? 'border-accent-subtle bg-accent-subtle'
                        : 'bg-layer-2',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-11 font-semibold uppercase tracking-wider text-primary truncate">
                      {resource.replace('.', ' › ')}
                    </p>
                    <button
                      type="button"
                      onClick={() => onToggleResource(ids)}
                      className="text-10 text-secondary hover:text-primary shrink-0 transition-colors"
                    >
                      {allGroupSelected ? 'None' : 'All'}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {perms.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 text-13 cursor-pointer select-none group"
                      >
                        <Checkbox
                          checked={selectedIds.has(p.id)}
                          onCheckedChange={() => onToggle(p.id)}
                          className="shrink-0"
                        />
                        <span className="capitalize group-hover:text-primary transition-colors text-secondary [&:has(~input:checked)]:text-primary">
                          {p.action}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ─── Step 3: Members ─────────────────────────────────────────────────────────

interface StepMembersProps {
  projectId: string
  selectedIds: Set<string>
  onToggle: (userId: string) => void
}

export function StepMembers({
  projectId,
  selectedIds,
  onToggle,
}: StepMembersProps) {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useProjectMembers(projectId)
  const allMembers = useMemo(
    () =>
      (data?.projectMembers ?? []) as Array<{
        id: string
        userId: string
        role: string | null
        user: {
          id: string
          fullName: string | null
          email: string
          avatarUrl: string | null
        }
      }>,
    [data?.projectMembers],
  )

  const assignable = useMemo(() => {
    const lower = search.toLowerCase()
    return allMembers.filter((m) => {
      // Exclude members who already hold the top project role (MANAGER).
      // They outrank any new role being created so assigning them is a no-op.
      // TODO: filter by roleRank when projectMembers query exposes rank field.
      if (m.role?.toLowerCase() === 'manager') return false

      if (!lower) return true
      return (
        (m.user.fullName ?? '').toLowerCase().includes(lower) ||
        m.user.email.toLowerCase().includes(lower)
      )
    })
  }, [allMembers, search])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-13 text-secondary animate-pulse py-10">
        Loading members...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary" />
          <Input
            className="pl-8 h-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-11 text-secondary shrink-0">
          {selectedIds.size} selected
        </span>
      </div>

      <ScrollArea className="h-[390px] rounded-md border">
        {assignable.length === 0 ? (
          <p className="text-13 text-secondary text-center py-10">
            {search
              ? 'No members match.'
              : 'No assignable members (Managers are excluded).'}
          </p>
        ) : (
          <div className="divide-y">
            {assignable.map((m) => {
              const isSelected = selectedIds.has(m.userId)
              const initials = (m.user.fullName ?? m.user.email)
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
              return (
                <label
                  key={m.userId}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors hover:bg-layer-2',
                    isSelected && 'bg-layer-2',
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(m.userId)}
                    className="shrink-0"
                  />
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={m.user.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-11">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-13 font-medium truncate">
                      {m.user.fullName ?? m.user.email}
                    </p>
                    {m.user.fullName && (
                      <p className="text-11 text-secondary truncate">
                        {m.user.email}
                      </p>
                    )}
                  </div>
                  {m.role ? (
                    <Badge variant="outline" className="text-11 shrink-0">
                      {m.role}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-11 shrink-0 text-secondary"
                    >
                      No role
                    </Badge>
                  )}
                </label>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {selectedIds.size > 0 && (
        <p className="text-11 text-secondary">
          <span className="font-medium">Note:</span> Members with an existing
          role will have it replaced by the new role.
        </p>
      )}
    </div>
  )
}
