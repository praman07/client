import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { mapInviteMemberError } from '../lib'
import { inviteMemberSchema } from '../model'
import { useInviteMember } from '../hooks'
import { useWorkspaceRoles } from '../hooks/use-workspace-roles'
import { EmailListField } from './email-list-field'
import type { InviteMemberFormValues } from '../model'
import { useAppSelector } from '@/shared/hooks'
import { Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/shared/ui'
import { selectCurrentWorkspace } from '@/entities/workspace'

interface Props {
  onClose: () => void
}

export function InviteMemberForm({ onClose }: Props) {
  const [isSuccess, setIsSuccess] = useState(false)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const { mutate, isPending } = useInviteMember()
  const { data: roles, isLoading: rolesLoading } = useWorkspaceRoles()

  // Default to the lowest-ranked role (most restrictive default)
  const defaultRoleId = roles
    ? [...roles].sort((a, b) => b.rank - a.rank)[0]?.id ?? ''
    : ''

  const form = useForm({
    defaultValues: {
      emails: [{ email: '' }],
      roleId: defaultRoleId,
    } as InviteMemberFormValues,
    validators: {
      onChange: inviteMemberSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        { emails: value.emails, roleId: value.roleId },
        {
          onSuccess: (data) => {
            if (data.inviteToWorkspace.success) {
              setIsSuccess(true)
              toast.success(data.inviteToWorkspace.message)
            } else {
              toast.error('Failed to invite members')
            }
          },
          onError: (error) => {
            const message = mapInviteMemberError(error)
            toast.error(message)
          },
        },
      )
    },
  })

  if (isSuccess) {
    return (
      <InviteSuccess
        workspaceName={currentWorkspace?.name}
        onClose={onClose}
        onReset={() => {
          setIsSuccess(false)
          form.reset()
        }}
      />
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-5 pt-2"
    >
      <EmailListField form={form} />

      {/* Role selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Invite as</label>
        <form.Field name="roleId">
          {(field) => (
            <Select
              value={field.state.value}
              onValueChange={(val) => val && field.handleChange(val)}
              disabled={rolesLoading || !roles?.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={rolesLoading ? 'Loading roles…' : 'Select a role'} />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit]}
          children={([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit || isPending || rolesLoading}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invites
            </Button>
          )}
        />
      </div>
    </form>
  )
}

function InviteSuccess({
  onClose,
  onReset,
  workspaceName,
}: {
  onClose: () => void
  onReset: () => void
  workspaceName?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center animate-in fade-in-50">
      <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Invites Sent!</h3>
        <p className="text-sm text-muted-foreground">
          Your teammates have been invited to join <b>{workspaceName}</b>.
        </p>
      </div>
      <div className="flex w-full gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Done
        </Button>
        <Button className="flex-1" onClick={onReset}>
          Invite More
        </Button>
      </div>
    </div>
  )
}
