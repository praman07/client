import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { mapInviteMemberError } from '../lib'
import { inviteMemberSchema } from '../model'
import { useInviteFormValidation, useInviteMember, validateAllEmails } from '../hooks'
import { EmailListField } from './email-list-field'
import type { InviteMemberFormValues } from '../model'
import { useWorkspaceMembers, useWorkspaceRoles } from '@/entities/workspace/hooks'
import { useAppSelector } from '@/shared/hooks'
import { Button } from '@/shared/ui'
import { selectCurrentWorkspace } from '@/entities/workspace'

interface Props {
  onClose: () => void
}

export function InviteMemberForm({ onClose }: Props) {
  const [isSuccess, setIsSuccess] = useState(false)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const { mutate, isPending } = useInviteMember()
  const { data: roles } = useWorkspaceRoles()

  // Get workspace members for validation
  const { data: membersData } = useWorkspaceMembers(currentWorkspace?.id ?? '')
  const members = membersData?.workspaceMembers ?? []

  // Validation hook
  const { existingMemberEmails } = useInviteFormValidation({ members })

  const memberRoleId = roles?.find((r) => r.name === 'MEMBER')?.id ?? ''

  const form = useForm({
    defaultValues: {
      emails: [{ email: '' }],
    } as InviteMemberFormValues,
    validators: {
      onChange: inviteMemberSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        { emails: value.emails, roleId: memberRoleId },
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
            if (message !== '') {
              toast.error(message)
            }
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
      <EmailListField
        form={form}
        existingMemberEmails={existingMemberEmails}
      />

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        {/* form.Subscribe ensures this re-renders reactively when form values change */}
        <form.Subscribe
          selector={(state) => ({
            canFormSubmit: state.canSubmit,
            emails: state.values.emails as Array<{ email: string }>,
          })}
        >
          {({ canFormSubmit, emails }) => {
            const validationErrors = validateAllEmails(emails, existingMemberEmails)
            const hasValidationErrors = Object.keys(validationErrors).length > 0
            const hasAtLeastOneValidEmail = emails.some(
              (f) => f.email.trim().length > 0 && f.email.includes('@'),
            )
            const canSubmit =
              canFormSubmit && !hasValidationErrors && hasAtLeastOneValidEmail
            return (
              <Button type="submit" disabled={!canSubmit || isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invites
              </Button>
            )
          }}
        </form.Subscribe>
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
      <div className="rounded-full bg-success-subtle p-3 text-success-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-16 font-medium text-primary">Invites Sent!</h3>
        <p className="text-13 text-secondary">
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
