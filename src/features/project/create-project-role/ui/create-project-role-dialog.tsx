import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import {
  closeCreateRoleDialog,
  selectIsCreateRoleDialogOpen,
} from '../model/slice'
import {
  
  createProjectRoleSchema
} from '../model/schema'
import { useCreateProjectRoleForm } from '../hooks/use-create-project-role-form'
import {
  StepMembers,
  StepPermissions,
  StepRoleDetails,
} from './create-project-role-form'
import type {CreateProjectRoleFormValues} from '../model/schema';
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

// ─── Step indicator ──────────────────────────────────────────────────────────

const STEPS = ['Role Details', 'Permissions', 'Members'] as const
type Step = 0 | 1 | 2

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 select-none">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary bg-background text-primary',
                  !done &&
                    !active &&
                    'border-muted-foreground/30 bg-background text-muted-foreground',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : done
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 mx-3 shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Dialog Orchestrator ─────────────────────────────────────────────────────

interface CreateProjectRoleDialogProps {
  projectId: string
  workspaceId: string
}

const EMPTY_FORM: CreateProjectRoleFormValues = {
  name: '',
  rank: 10,
  description: '',
}

export function CreateProjectRoleDialog({
  projectId,
  workspaceId,
}: CreateProjectRoleDialogProps) {
  const isOpen = useAppSelector(selectIsCreateRoleDialogOpen)
  const dispatch = useAppDispatch()

  // ── Step state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(0)
  const [formValues, setFormValues] =
    useState<CreateProjectRoleFormValues>(EMPTY_FORM)
  const [step1Errors, setStep1Errors] = useState<
    Partial<Record<keyof CreateProjectRoleFormValues, string>>
  >({})
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<
    Set<string>
  >(new Set())
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set(),
  )

  // ── Submission ──────────────────────────────────────────────────────────
  const { submit, isPending } = useCreateProjectRoleForm({
    projectId,
    workspaceId,
    selectedPermissionIds: [...selectedPermissionIds],
    selectedMemberIds: [...selectedMemberIds],
  })

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleClose() {
    if (isPending) return
    dispatch(closeCreateRoleDialog())
    // Reset after close animation settles
    setTimeout(() => {
      setStep(0)
      setFormValues(EMPTY_FORM)
      setStep1Errors({})
      setSelectedPermissionIds(new Set())
      setSelectedMemberIds(new Set())
    }, 200)
  }

  function handleFieldChange(
    field: keyof CreateProjectRoleFormValues,
    value: any,
  ) {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    setStep1Errors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleNext() {
    if (step === 0) {
      const r = createProjectRoleSchema.safeParse(formValues)
      if (!r.success) {
        const errs: Partial<Record<keyof CreateProjectRoleFormValues, string>> =
          {}
        r.error.issues.forEach((i) => {
          const key = i.path[0] as keyof CreateProjectRoleFormValues
          if (!errs[key]) errs[key] = i.message
        })
        setStep1Errors(errs)
        return
      }
    }
    setStep((s) => (s < 2 ? ((s + 1) as Step) : s))
  }

  function handleBack() {
    setStep((s) => (s > 0 ? ((s - 1) as Step) : s))
  }

  function handlePermToggle(id: string) {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handlePermToggleResource(ids: Array<string>) {
    const allSelected = ids.every((id) => selectedPermissionIds.has(id))
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev)
      allSelected
        ? ids.forEach((id) => next.delete(id))
        : ids.forEach((id) => next.add(id))
      return next
    })
  }

  function handlePermToggleAll(ids: Array<string>, selectAll: boolean) {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev)
      selectAll
        ? ids.forEach((id) => next.add(id))
        : ids.forEach((id) => next.delete(id))
      return next
    })
  }

  function handleMemberToggle(userId: string) {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  async function handleSubmit() {
    await submit(formValues)
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl h-[680px] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-lg">Create Role</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new project role with permissions and member assignments.
          </DialogDescription>
          <div className="pt-3">
            <StepIndicator current={step} />
          </div>
        </DialogHeader>

        {/* Step content */}
        <div className="flex-1 overflow-hidden px-6 py-5">
          {step === 0 && (
            <StepRoleDetails
              values={formValues}
              onChange={handleFieldChange}
              errors={step1Errors}
            />
          )}
          {step === 1 && (
            <StepPermissions
              workspaceId={workspaceId}
              projectId={projectId}
              selectedIds={selectedPermissionIds}
              onToggle={handlePermToggle}
              onToggleResource={handlePermToggleResource}
              onToggleAll={handlePermToggleAll}
            />
          )}
          {step === 2 && (
            <StepMembers
              projectId={projectId}
              selectedIds={selectedMemberIds}
              onToggle={handleMemberToggle}
            />
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            {step === 1 && selectedPermissionIds.size > 0 && (
              <span>
                {selectedPermissionIds.size} permission
                {selectedPermissionIds.size !== 1 ? 's' : ''} selected
              </span>
            )}
            {step === 2 && (
              <span>
                {selectedMemberIds.size > 0
                  ? `${selectedMemberIds.size} member${selectedMemberIds.size !== 1 ? 's' : ''} selected`
                  : 'Member assignment is optional'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
              >
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Role'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
