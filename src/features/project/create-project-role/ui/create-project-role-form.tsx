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
import { useAllPermissions } from '@/entities/project-role'
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
            Role Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Tech Lead, QA Engineer"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
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
          <p className="text-[11px] text-muted-foreground leading-tight">
            Lower = higher authority.
            <br />
            MANAGER is rank 1.
          </p>
          {errors.rank && (
            <p className="text-sm text-destructive">{errors.rank}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label>
          Description{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea
          value={values.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Briefly describe what this role can do..."
          rows={3}
          className="resize-none"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>
    </div>
  )
}

// ─── Step 2: Permissions ─────────────────────────────────────────────────────

interface StepPermissionsProps {
  workspaceId: string
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onToggleResource: (ids: Array<string>) => void
  onToggleAll: (ids: Array<string>, selectAll: boolean) => void
}

export function StepPermissions({
  workspaceId,
  selectedIds,
  onToggle,
  onToggleResource,
  onToggleAll,
}: StepPermissionsProps) {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAllPermissions(workspaceId)
  const allPermissions = data?.allPermissions ?? []

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
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground animate-pulse py-10">
        Loading permissions...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {selectedIds.size} selected
        </span>
      </div>

      {/* Resource grid */}
      <ScrollArea className="h-[380px] -mx-1 px-1">
        {Object.keys(byResource).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
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
                    'rounded-lg border p-3 space-y-2.5 transition-colors',
                    allGroupSelected
                      ? 'border-primary/40 bg-primary/5'
                      : someGroupSelected
                        ? 'border-primary/20 bg-primary/2'
                        : 'bg-muted/20',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground truncate">
                      {resource.replace('.', ' › ')}
                    </p>
                    <button
                      type="button"
                      onClick={() => onToggleResource(ids)}
                      className="text-[10px] text-muted-foreground hover:text-primary shrink-0 transition-colors"
                    >
                      {allGroupSelected ? 'None' : 'All'}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {perms.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none group"
                      >
                        <Checkbox
                          checked={selectedIds.has(p.id)}
                          onCheckedChange={() => onToggle(p.id)}
                          className="shrink-0"
                        />
                        <span className="capitalize group-hover:text-foreground transition-colors text-muted-foreground [&:has(~input:checked)]:text-foreground">
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
  const allMembers = (data?.projectMembers ?? []) as Array<{
    id: string
    userId: string
    role: string | null
    user: {
      id: string
      fullName: string | null
      email: string
      avatarUrl: string | null
    }
  }>

  const assignable = useMemo(() => {
    const lower = search.toLowerCase()
    return allMembers.filter((m) => {
      if (m.role === 'MANAGER' || m.role === 'Manager') return false
      if (!lower) return true
      return (
        (m.user.fullName ?? '').toLowerCase().includes(lower) ||
        m.user.email.toLowerCase().includes(lower)
      )
    })
  }, [allMembers, search])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground animate-pulse py-10">
        Loading members...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 h-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {selectedIds.size} selected
        </span>
      </div>

      <ScrollArea className="h-[390px] rounded-md border">
        {assignable.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
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
                    'flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors hover:bg-muted/40',
                    isSelected && 'bg-muted/20',
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(m.userId)}
                    className="shrink-0"
                  />
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={m.user.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {m.user.fullName ?? m.user.email}
                    </p>
                    {m.user.fullName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {m.user.email}
                      </p>
                    )}
                  </div>
                  {m.role ? (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {m.role}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 text-muted-foreground"
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
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Note:</span> Members with an existing
          role will have it replaced by the new role.
        </p>
      )}
    </div>
  )
}
