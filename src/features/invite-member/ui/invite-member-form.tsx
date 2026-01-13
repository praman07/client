import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { INVITE_TO_WORKSPACE } from '../api/mutations'
import { mapInviteMemberError } from '../lib/error-mapping'
import { inviteMemberSchema } from '../api/schema'
import { EmailListField } from './email-list-field'
import type { InviteMemberFormValues } from '../api/schema'
import { createGqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/auth'
import { useAppSelector } from '@/shared/lib/redux'
import { Button } from '@/shared/ui/primitives/button'
import { selectCurrentWorkspace } from '@/entities/session/model/selectors'

interface Props {
  onClose: () => void
}

export function InviteMemberForm({ onClose }: Props) {
  const { getToken } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: InviteMemberFormValues) => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected')
      const token = await getToken()
      const client = createGqlClient(token)

      const emailList = values.emails.map((e) => e.email)

      return client.request(INVITE_TO_WORKSPACE, {
        input: {
          workspaceId: currentWorkspace.id,
          emails: emailList,
        },
      })
    },
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
  })

  const form = useForm({
    defaultValues: {
      emails: [{ email: '' }],
    } as InviteMemberFormValues,
    validators: {
      onChange: inviteMemberSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value)
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
      className="space-y-6 pt-2"
    >
      <EmailListField form={form} />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit]}
          children={([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit || isPending}>
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
